const test = require('node:test');
const assert = require('node:assert/strict');
const {M2MClient, readM2MConfig, getM2MClient, resetM2MClient} = require('../server/proxy/m2m-client');

const config = {clientId: '11111111-1111-1111-1111-111111111111', clientSecret: 's3cret', tokenUrl: 'https://backbone.test/api/v1/managed-clients/token', scopes: ['a', 'b']};
const logger = {debug() {}, warn() {}, error() {}};
const noLocks = {acquireLock: async () => null, releaseLock: async () => true};

function fakeRedis(store = new Map()) {
  return {
    isOpen: true,
    store,
    get: async key => store.get(key) ?? null,
    setEx: async (key, ttl, value) => store.set(key, value),
    del: async key => store.delete(key)
  };
}

function build({http, redis = null, now = () => 1_000_000, locks = noLocks, getRedis} = {}) {
  return new M2MClient(config, {http, logger, getRedis: getRedis || (async () => redis), locks, now});
}

test('requires the client id, secret and token url', () => {
  assert.throws(() => new M2MClient(null, {logger}));
  assert.throws(() => new M2MClient({...config, clientId: ''}, {logger}));
  assert.throws(() => new M2MClient({...config, clientSecret: ''}, {logger}));
  assert.throws(() => new M2MClient({...config, tokenUrl: ''}, {logger}));
});

test('asks Backbone with the client credentials as JSON and returns the token', async () => {
  const calls = [];
  const client = build({http: async options => (calls.push(options), {data: {accessToken: 'tok-1', expiresIn: 3600}})});
  assert.equal(await client.getBearerToken(), 'tok-1');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].url, config.tokenUrl);
  assert.equal(calls[0].headers['Content-Type'], 'application/json');
  assert.deepEqual(calls[0].data, {clientId: config.clientId, clientSecret: config.clientSecret, scopes: ['a', 'b']});
});

test('accepts snake_case answers and falls back to five minutes of life', async () => {
  let time = 0;
  let calls = 0;
  const client = build({http: async () => (calls++, {data: {access_token: 'tok-s'}}), now: () => time});
  assert.equal(await client.getBearerToken(), 'tok-s');
  time = 239_000; // 300 s - 60 s margin = 240 s of cache
  await client.getBearerToken();
  assert.equal(calls, 1);
  time = 241_000;
  await client.getBearerToken();
  assert.equal(calls, 2);
});

test('fails when the answer carries no token', async () => {
  const client = build({http: async () => ({data: {}})});
  await assert.rejects(client.getBearerToken(), /without a token/);
  const empty = build({http: async () => ({})});
  await assert.rejects(empty.getBearerToken(), /without a token/);
});

test('serves the cached token until a minute before it expires', async () => {
  let time = 0;
  let calls = 0;
  const client = build({http: async () => (calls++, {data: {accessToken: `tok-${calls}`, expiresIn: 120}}), now: () => time});
  assert.equal(await client.getBearerToken(), 'tok-1');
  time = 59_000;
  assert.equal(await client.getBearerToken(), 'tok-1');
  time = 61_000;
  assert.equal(await client.getBearerToken(), 'tok-2');
});

test('parallel calls share one request', async () => {
  let calls = 0;
  const client = build({http: async () => (calls++, await new Promise(r => setTimeout(r, 10)), {data: {accessToken: 'tok', expiresIn: 3600}})});
  const tokens = await Promise.all([client.getBearerToken(), client.getBearerToken(), client.getBearerToken()]);
  assert.deepEqual(tokens, ['tok', 'tok', 'tok']);
  assert.equal(calls, 1);
});

test('caches in Redis keyed by client and scopes, and another instance reuses it', async () => {
  const redis = fakeRedis();
  let calls = 0;
  const http = async () => (calls++, {data: {accessToken: 'tok-r', expiresIn: 3600}});
  assert.equal(await build({http, redis}).getBearerToken(), 'tok-r');
  assert.ok(redis.store.has(`m2m_token:${config.clientId}:a,b`));
  assert.equal(await build({http, redis}).getBearerToken(), 'tok-r');
  assert.equal(calls, 1);
});

test('takes and releases the distributed lock', async () => {
  const redis = fakeRedis();
  const events = [];
  const locks = {acquireLock: async (r, key) => (events.push(['acquire', key]), 'lock-token'), releaseLock: async (r, key, token) => (events.push(['release', key, token]), true)};
  const client = build({http: async () => ({data: {accessToken: 'tok', expiresIn: 3600}}), redis, locks});
  await client.getBearerToken();
  assert.deepEqual(events.map(e => e[0]), ['acquire', 'release']);
  assert.equal(events[1][2], 'lock-token');
});

test('when another instance holds the lock, uses the token it cached', async () => {
  const redis = fakeRedis();
  let calls = 0;
  const locks = {
    acquireLock: async () => null,
    releaseLock: async () => true
  };
  const client = build({http: async () => (calls++, {data: {accessToken: 'mine', expiresIn: 3600}}), redis, locks});
  // The other instance stores its token while this one waits.
  setTimeout(() => redis.store.set(client.cacheKey(), JSON.stringify({accessToken: 'theirs', validUntil: 9_999_999})), 20);
  assert.equal(await client.getBearerToken(), 'theirs');
  assert.equal(calls, 0);
});

test('when the lock holder leaves nothing, it fetches the token itself', async () => {
  const redis = fakeRedis();
  const locks = {acquireLock: async () => null, releaseLock: async () => true};
  const client = build({http: async () => ({data: {accessToken: 'mine', expiresIn: 3600}}), redis, locks});
  assert.equal(await client.getBearerToken(), 'mine');
});

test('survives Redis failures by using memory', async () => {
  const broken = {isOpen: true, get: async () => { throw new Error('boom'); }, setEx: async () => { throw new Error('boom'); }, del: async () => { throw new Error('boom'); }};
  let calls = 0;
  const client = build({http: async () => (calls++, {data: {accessToken: 'tok', expiresIn: 3600}}), redis: broken});
  assert.equal(await client.getBearerToken(), 'tok');
  assert.equal(await client.getBearerToken(), 'tok');
  assert.equal(calls, 1);
  await client.invalidate();
  await client.getBearerToken();
  assert.equal(calls, 2);
});

test('survives Redis being unreachable or closed', async () => {
  const unreachable = build({http: async () => ({data: {accessToken: 'tok', expiresIn: 3600}}), getRedis: async () => { throw new Error('down'); }});
  assert.equal(await unreachable.getBearerToken(), 'tok');
  const closed = build({http: async () => ({data: {accessToken: 'tok2', expiresIn: 3600}}), redis: {isOpen: false}});
  assert.equal(await closed.getBearerToken(), 'tok2');
});

test('ignores an expired entry in Redis', async () => {
  const redis = fakeRedis();
  const client = build({http: async () => ({data: {accessToken: 'fresh', expiresIn: 3600}}), redis});
  redis.store.set(client.cacheKey(), JSON.stringify({accessToken: 'stale', validUntil: 1}));
  assert.equal(await client.getBearerToken(), 'fresh');
});

test('invalidate drops memory and Redis so the next call asks again', async () => {
  const redis = fakeRedis();
  let calls = 0;
  const client = build({http: async () => (calls++, {data: {accessToken: `tok-${calls}`, expiresIn: 3600}}), redis});
  assert.equal(await client.getBearerToken(), 'tok-1');
  await client.invalidate();
  assert.equal(redis.store.size, 0);
  assert.equal(await client.getBearerToken(), 'tok-2');
});

test('a failing endpoint rejects and the next call tries again', async () => {
  let calls = 0;
  const client = build({http: async () => { calls++; if (calls === 1) { throw new Error('503'); } return {data: {accessToken: 'ok', expiresIn: 3600}}; }});
  await assert.rejects(client.getBearerToken(), /503/);
  assert.equal(await client.getBearerToken(), 'ok');
});

test('readM2MConfig needs id, secret and url, and splits the scopes', () => {
  assert.equal(readM2MConfig({}), null);
  assert.equal(readM2MConfig({M2M_CLIENT_ID: 'x', M2M_CLIENT_SECRET: 'y'}), null);
  assert.deepEqual(readM2MConfig({M2M_CLIENT_ID: 'x', M2M_CLIENT_SECRET: 'y', M2M_TOKEN_URL: 'u', M2M_SCOPES: ' a, b ,,c '}),
    {clientId: 'x', clientSecret: 'y', tokenUrl: 'u', scopes: ['a', 'b', 'c']});
  assert.deepEqual(readM2MConfig({M2M_CLIENT_ID: 'x', M2M_CLIENT_SECRET: 'y', M2M_TOKEN_URL: 'u'}).scopes, []);
});

test('getM2MClient is null without configuration and a shared instance with it; getOAuthClient follows it', () => {
  const saved = {...process.env};
  try {
    for (const key of ['M2M_CLIENT_ID', 'M2M_CLIENT_SECRET', 'M2M_TOKEN_URL', 'M2M_SCOPES']) { delete process.env[key]; }
    resetM2MClient();
    assert.equal(getM2MClient(), null);
    Object.assign(process.env, {M2M_CLIENT_ID: config.clientId, M2M_CLIENT_SECRET: 's', M2M_TOKEN_URL: config.tokenUrl});
    const first = getM2MClient();
    assert.ok(first instanceof M2MClient);
    assert.equal(getM2MClient(), first);
    const {getOAuthClient} = require('../server/proxy/oauth-client');
    assert.equal(getOAuthClient({}), first);
  } finally {
    resetM2MClient();
    for (const key of ['M2M_CLIENT_ID', 'M2M_CLIENT_SECRET', 'M2M_TOKEN_URL', 'M2M_SCOPES']) {
      if (saved[key] === undefined) { delete process.env[key]; } else { process.env[key] = saved[key]; }
    }
  }
});
