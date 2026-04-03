'use strict';

const axios = require('axios');
const appConfig = require('../config/app.config');
const logger = appConfig.getLoggerApp();
const { getOAuthClient } = require('../proxy/oauth-client');
const { getRedisClient } = require('../shared/redis-client');
const { getApiEndpoint } = require('../shared/common-function');
const {
  OAUTH_AUTHENTICATION_TYPE,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_TOKEN_URL,
  OAUTH_USER_ALIAS,
  OAUTH_USER_PASSWORD,
  API_SERVICE_DIRECTORY_MAP,
} = require('../shared/oauth-common-function');

const LOGGER_TAG_ID = '[LANDING_CONTROLLER] :::';
const REDIS_CACHE_KEY = 'landing:data';
const REDIS_CACHE_TTL = 300; // 5 minutos

const DIRECTORY_PROXY_CONFIG = appConfig.getDirectoryProxyConfig();

const directoryOauthClientConfig = {
  authenticationType: OAUTH_AUTHENTICATION_TYPE,
  clientId: OAUTH_CLIENT_ID,
  clientSecret: OAUTH_CLIENT_SECRET,
  grantType: OAUTH_GRANT_TYPE,
  tokenUrl: OAUTH_TOKEN_URL,
  username: OAUTH_USER_ALIAS,
  password: OAUTH_USER_PASSWORD,
};

/**
 * Executa una llamada al backend Java de forma resiliente.
 * Si falla, devuelve null sin propagar el error.
 *
 * @param {string} url - URL completa del endpoint del backend.
 * @param {string} token - Bearer token OAuth.
 * @param {string} label - Etiqueta para el log.
 * @returns {Promise<any|null>}
 */
async function fetchSafe(url, token, label) {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response ? error.response.status : 'N/A';
    logger.error(
      `${LOGGER_TAG_ID} Error fetching ${label} (status: ${status}): ${error.message}`
    );
    return null;
  }
}

/**
 * Ensambla la respuesta de landing a partir de los datos del backend.
 *
 * @param {any[]|null} bannersRaw
 * @param {any[]|null} editorialCampaigns
 * @param {any[]|null} offerCampaigns
 * @param {any[]|null} businesses
 * @param {any[]|null} featuredProductsRaw
 * @returns {Object}
 */
function assembleLandingResponse(
  bannersRaw,
  editorialCampaigns,
  offerCampaigns,
  businesses,
  featuredProductsRaw
) {
  // Agrupar banners por posición
  let banners = { top: null, mid: null };
  let slides = [];

  if (Array.isArray(bannersRaw)) {
    bannersRaw.forEach((banner) => {
      const position = (banner.position || '').toUpperCase();
      if (position === 'TOP') {
        banners.top = banner;
      } else if (position === 'MID') {
        banners.mid = banner;
      } else if (position === 'CAROUSEL') {
        slides.push(banner);
      }
    });
  } else if (bannersRaw !== null) {
    // El backend puede devolver un objeto con la lista anidada
    logger.warn(`${LOGGER_TAG_ID} Unexpected banners format, skipping grouping`);
  }

  return {
    banners,
    slides,
    cards: Array.isArray(editorialCampaigns) ? editorialCampaigns : [],
    partnerLogos: Array.isArray(businesses) ? businesses : [],
    featuredProducts: Array.isArray(featuredProductsRaw) ? featuredProductsRaw : [],
    offers: Array.isArray(offerCampaigns) ? offerCampaigns : [],
  };
}

/**
 * GET /api/landing
 * Agrega datos de múltiples endpoints del backend Java en una única respuesta.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getLanding(req, res) {
  // Intentar servir desde caché Redis
  let redisClient = null;
  try {
    redisClient = await getRedisClient();
    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(REDIS_CACHE_KEY);
      if (cached) {
        logger.info(`${LOGGER_TAG_ID} Serving landing from Redis cache`);
        return res.json(JSON.parse(cached));
      }
    }
  } catch (cacheError) {
    logger.warn(
      `${LOGGER_TAG_ID} Redis read error, proceeding without cache: ${cacheError.message}`
    );
  }

  // Obtener token OAuth
  let token;
  try {
    token = await getOAuthClient(directoryOauthClientConfig).getBearerToken();
  } catch (tokenError) {
    logger.error(`${LOGGER_TAG_ID} Failed to obtain OAuth token: ${tokenError.message}`);
    return res.status(502).json({ status: 502, title: 'Bad Gateway', detail: 'Authentication service unavailable' });
  }

  // 5 llamadas paralelas al backend — fallos individuales devuelven null
  const [bannersRaw, editorialCampaigns, offerCampaigns, businesses, featuredProductsRaw] =
    await Promise.all([
      fetchSafe(
        getApiEndpoint('/drb/api/v1/general/banners', DIRECTORY_PROXY_CONFIG, API_SERVICE_DIRECTORY_MAP),
        token,
        'banners'
      ),
      fetchSafe(
        getApiEndpoint('/drb/api/v1/general/campaigns', DIRECTORY_PROXY_CONFIG, API_SERVICE_DIRECTORY_MAP) + '?type=EDITORIAL&active=true&limit=3',
        token,
        'editorial campaigns'
      ),
      fetchSafe(
        getApiEndpoint('/drb/api/v1/general/campaigns', DIRECTORY_PROXY_CONFIG, API_SERVICE_DIRECTORY_MAP) + '?type=OFFER&active=true&limit=10',
        token,
        'offer campaigns'
      ),
      fetchSafe(
        getApiEndpoint('/drb/api/v1/general/businesses', DIRECTORY_PROXY_CONFIG, API_SERVICE_DIRECTORY_MAP) + '?featured=true&limit=20',
        token,
        'businesses'
      ),
      fetchSafe(
        getApiEndpoint('/drb/api/v1/general/products', DIRECTORY_PROXY_CONFIG, API_SERVICE_DIRECTORY_MAP) + '/featured?limit=3',
        token,
        'featured products'
      ),
    ]);

  const landingData = assembleLandingResponse(
    bannersRaw,
    editorialCampaigns,
    offerCampaigns,
    businesses,
    featuredProductsRaw
  );

  // Guardar en Redis con TTL (fallo silencioso)
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(REDIS_CACHE_KEY, REDIS_CACHE_TTL, JSON.stringify(landingData));
      logger.info(`${LOGGER_TAG_ID} Landing data cached in Redis (TTL: ${REDIS_CACHE_TTL}s)`);
    }
  } catch (cacheWriteError) {
    logger.warn(
      `${LOGGER_TAG_ID} Redis write error, response not cached: ${cacheWriteError.message}`
    );
  }

  logger.info(`${LOGGER_TAG_ID} Landing aggregated successfully`);
  return res.json(landingData);
}

module.exports = { getLanding };
