# Sub-Agent: Session Handler

**Parent Agent:** BFF Developer Agent  
**Trigger:** When a controller needs to interact with user sessions, tokens, or distributed locks

## Purpose

Provide correct patterns for reading, writing, and managing user sessions and OAuth tokens in BFF controllers using `redis-session-store.js`, `oauth-client.js`, `backbone-client.js`, and `redis-lock.js`.

## Session Operations

### Read a Session

```javascript
const { getUserSession } = require('../shared/redis-session-store');

// In a controller:
const session = await getUserSession(userId);
if (!session || !session.backboneSession) {
  return res.status(401).json({ message: 'Session not found.' });
}

// Session shape:
// {
//   backboneSession: string,
//   backboneBearerToken: string,
//   backboneSessionExpiresAt: number,
//   directorySession: string,
//   directoryBearerToken: string,
//   directorySessionExpiresAt: number
// }
```

### Write a Session

```javascript
const { setUserSession } = require('../shared/redis-session-store');

await setUserSession(userId, {
  backboneSession: backboneJwt,
  backboneBearerToken: bearerToken,
  backboneSessionExpiresAt: expiresAt,
  directorySession: directoryToken,
  directoryBearerToken: directoryBearer,
  directorySessionExpiresAt: directoryExpiresAt
});
// TTL is calculated automatically from backboneSessionExpiresAt
```

### Remove a Session

```javascript
const { removeUserSession } = require('../shared/redis-session-store');

await removeUserSession(userId);
// Removes from Redis AND memory fallback
```

## OAuth Token Operations

### Get Directory Backend Token

```javascript
const { getDirectorySessionToken } = require('../proxy/oauth-client');

const token = await getDirectorySessionToken();
// Cached in Redis with TTL=expires_in
// Uses distributed lock to prevent concurrent OAuth calls
```

### Get Backbone Bearer Token

```javascript
const { getBearerToken } = require('../proxy/backbone-client');

const token = await getBearerToken();
// Cached in Redis with TTL=expires_in
```

## Distributed Lock Usage

```javascript
const { withLock } = require('../shared/redis-lock');
const { getRedisClient } = require('../shared/redis-client');

// Use withLock for operations that must not run concurrently
const result = await withLock(
  getRedisClient(),
  `lock:renew_token:${userId}`,
  5000,  // TTL in ms
  async () => {
    // Critical section — only one process runs this at a time
    const newToken = await renewTokenFromBackbone(userId);
    await setUserSession(userId, newToken);
    return newToken;
  }
);
```

## Session Key Namespaces

| Key Pattern | Value | TTL |
|---|---|---|
| `session:{userId}` | `SessionData` JSON | `backboneSessionExpiresAt` - now |
| `oauth_token:{clientId}` | `TokenCache` JSON | `expires_in` from OAuth response |
| `lock:oauth_token:{clientId}` | UUID string | 5000ms |
| `lock:renew_token:{userId}` | UUID string | 5000ms |

## Redis Fallback Behavior

The session store handles Redis unavailability transparently:

```javascript
// redis-session-store.js behavior:
// 1. Try Redis SET/GET
// 2. On Redis failure → fall back to in-memory Map
// 3. Log warning but continue
// Result: zero downtime on Redis failure
```

## Decoding JWT for userId

```javascript
const jwt = require('jsonwebtoken');

// Decode backbone JWT (header: session-token-bkd)
const decoded = jwt.decode(req.headers['session-token-bkd']);
const userId = decoded?.uid;

// Decode directory JWT (header: session-token)
const dirDecoded = jwt.decode(req.headers['session-token']);
const dirUserId = dirDecoded?.uid;
```

> ⚠️ `jwt.decode()` does NOT verify signature — it only decodes. Signature verification is the responsibility of Java backends.

## Session Validation Pattern

```javascript
const isSessionValid = (session) => {
  if (!session) return false;
  const now = Date.now();
  return (
    session.backboneSessionExpiresAt > now &&
    session.directorySessionExpiresAt > now
  );
};
```

