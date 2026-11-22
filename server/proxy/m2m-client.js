const assert = require('assert');

const LOGGER_TAG_ID = '[M2MCLT] :::';
const REDIS_TOKEN_PREFIX = 'm2m_token:';
const FALLBACK_TTL_SECONDS = 300;
const SAFETY_MARGIN_SECONDS = 60;

/**
 * Machine-to-machine (M2M) client of the BFF. It trades the client credentials of the application's Backbone managed client
 * (`POST /api/v1/managed-clients/token`, JSON body `{clientId, clientSecret, scopes}`) for the service token the BFF sends as
 * `Authorization: Bearer` to Backbone and to Directory Backend. It replaces the Keycloak password grant of `OAuthClient`.
 *
 * The token is cached (Redis when available, memory otherwise) until a minute before it expires, a distributed lock keeps parallel
 * requests from asking for it twice, and neither the secret nor the token is ever logged.
 */
class M2MClient {
  /**
   * @param {Object} config
   * @param {string} config.clientId - Managed client id (UUID).
   * @param {string} config.clientSecret - Managed client secret.
   * @param {string} config.tokenUrl - Full URL of the managed-client token endpoint.
   * @param {string[]} [config.scopes] - Scopes asked for.
   * @param {Object} [deps] - Injectable collaborators (tests).
   */
  constructor(config, deps = {}) {
    assert.ok(config, `${LOGGER_TAG_ID} config is not defined`);
    assert.ok(config.clientId, `${LOGGER_TAG_ID} config.clientId is not provided`);
    assert.ok(config.clientSecret, `${LOGGER_TAG_ID} config.clientSecret is not provided`);
    assert.ok(config.tokenUrl, `${LOGGER_TAG_ID} config.tokenUrl is not provided`);
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.tokenUrl = config.tokenUrl;
    this.scopes = Array.isArray(config.scopes) ? config.scopes : [];
    this.http = deps.http || require('axios');
    this.logger = deps.logger || require('../config/app.config').getLoggerApp();
    this.getRedis = deps.getRedis || (() => require('../shared/redis-client').getRedisClient());
    this.locks = deps.locks || require('../shared/redis-lock');
    this.now = deps.now || Date.now;
    this.memory = null;
    this.pending = null;
  }

  /** @returns {string} cache key; the scopes are part of it so a change of scopes never reuses an old token */
  cacheKey() {
    return `${REDIS_TOKEN_PREFIX}${this.clientId}:${this.scopes.join(',')}`;
  }

  isValid(entry) {
    return !!entry && !!entry.accessToken && entry.validUntil > this.now();
  }

  async redis() {
    try {
      const client = await this.getRedis();
      return client && client.isOpen ? client : null;
    } catch (error) {
      this.logger.warn(`${LOGGER_TAG_ID} Redis not available, using memory cache: ${error.message}`);
      return null;
    }
  }

  async readCache(redis) {
    if (redis) {
      try {
        const raw = await redis.get(this.cacheKey());
        if (raw) {
          const entry = JSON.parse(raw);
          if (this.isValid(entry)) {
            return entry;
          }
        }
      } catch (error) {
        this.logger.warn(`${LOGGER_TAG_ID} Error reading the token from Redis: ${error.message}`);
      }
    }
    return this.isValid(this.memory) ? this.memory : null;
  }

  async writeCache(redis, entry, ttlSeconds) {
    this.memory = entry;
    if (redis) {
      try {
        await redis.setEx(this.cacheKey(), ttlSeconds, JSON.stringify(entry));
      } catch (error) {
        this.logger.warn(`${LOGGER_TAG_ID} Error caching the token in Redis: ${error.message}`);
      }
    }
  }

  async requestToken() {
    const response = await this.http({
      method: 'POST',
      url: this.tokenUrl,
      headers: {'Content-Type': 'application/json'},
      data: {clientId: this.clientId, clientSecret: this.clientSecret, scopes: this.scopes}
    });
    const body = response.data || {};
    const accessToken = body.accessToken || body.access_token;
    if (!accessToken) {
      throw new Error('The managed-client token endpoint answered without a token');
    }
    const expiresIn = Number(body.expiresIn || body.expires_in) || FALLBACK_TTL_SECONDS;
    return {accessToken, expiresIn};
  }

  /**
   * Returns the M2M bearer token: the cached one, or a new one.
   * @returns {Promise<string>}
   */
  getBearerToken = async () => {
    const redis = await this.redis();
    const cached = await this.readCache(redis);
    if (cached) {
      return cached.accessToken;
    }
    // Calls of this process that arrive while one is fetching share its result.
    if (!this.pending) {
      this.pending = this.fetchAndCache(redis).finally(() => {
        this.pending = null;
      });
    }
    return this.pending;
  };

  async fetchAndCache(redis) {
    const lockKey = `lock:${this.cacheKey()}`;
    const lock = redis ? await this.locks.acquireLock(redis, lockKey, 5000) : null;
    try {
      if (redis && !lock) {
        // Another instance is fetching: wait a moment and use what it cached.
        await new Promise(resolve => setTimeout(resolve, 100));
        const cached = await this.readCache(redis);
        if (cached) {
          return cached.accessToken;
        }
      }
      this.logger.debug(`${LOGGER_TAG_ID} Requesting a new M2M token (scopes: ${this.scopes.join(',') || 'none'})`);
      const {accessToken, expiresIn} = await this.requestToken();
      const lifeSeconds = Math.max(expiresIn - SAFETY_MARGIN_SECONDS, 1);
      await this.writeCache(redis, {accessToken, validUntil: this.now() + lifeSeconds * 1000}, lifeSeconds);
      return accessToken;
    } catch (error) {
      this.logger.error(`${LOGGER_TAG_ID} Error fetching the M2M token: ${error.message}`);
      throw error;
    } finally {
      if (lock) {
        await this.locks.releaseLock(redis, lockKey, lock);
      }
    }
  }

  /** Forgets the cached token (memory and Redis) so the next call asks for a new one, e.g. after a 401. */
  invalidate = async () => {
    this.memory = null;
    const redis = await this.redis();
    if (redis) {
      try {
        await redis.del(this.cacheKey());
      } catch (error) {
        this.logger.warn(`${LOGGER_TAG_ID} Error dropping the token from Redis: ${error.message}`);
      }
    }
  };
}

let instance = null;

/**
 * Reads the M2M settings from the environment (Vault injects them): `M2M_CLIENT_ID`, `M2M_CLIENT_SECRET`, `M2M_TOKEN_URL` and
 * optionally `M2M_SCOPES` (comma separated).
 * @param {Object} [env] - Environment, `process.env` by default.
 * @returns {{clientId: string, clientSecret: string, tokenUrl: string, scopes: string[]}|null} null when M2M is not configured
 */
function readM2MConfig(env = process.env) {
  if (!env.M2M_CLIENT_ID || !env.M2M_CLIENT_SECRET || !env.M2M_TOKEN_URL) {
    return null;
  }
  return {
    clientId: env.M2M_CLIENT_ID,
    clientSecret: env.M2M_CLIENT_SECRET,
    tokenUrl: env.M2M_TOKEN_URL,
    scopes: (env.M2M_SCOPES || '').split(',').map(scope => scope.trim()).filter(Boolean)
  };
}

/**
 * The shared M2M client, or null when the environment does not configure one.
 * @returns {M2MClient|null}
 */
function getM2MClient() {
  if (!instance) {
    const config = readM2MConfig();
    if (!config) {
      return null;
    }
    instance = new M2MClient(config);
  }
  return instance;
}

/** Drops the shared instance (tests). */
function resetM2MClient() {
  instance = null;
}

module.exports = {M2MClient, readM2MConfig, getM2MClient, resetM2MClient};
