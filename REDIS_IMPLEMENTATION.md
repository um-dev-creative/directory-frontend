# Redis Session and Token Management - Implementation Details

## Overview

This implementation adds Redis-backed session storage and token caching to the directory-frontend project, with distributed lock support to prevent race conditions. The system maintains backward compatibility with in-memory storage when Redis is not available.

## Key Features

### 1. Redis-backed Token Caching (`server/proxy/oauth-client.js`)
- **Redis Integration**: Application tokens (from OAuth/Keycloak) are cached in Redis with TTL based on `expires_in` from the OAuth response
- **Distributed Locks**: Uses Redis `SET NX PX` for distributed locking to prevent multiple concurrent token requests
- **Memory Fallback**: Maintains in-memory cache when Redis is unavailable
- **No Secret Exposure**: Token values are never logged, OAuth responses are sanitized

### 2. Redis Session Store (`server/shared/redis-session-store.js`)
- **Persistent Sessions**: User sessions stored in Redis with automatic expiration based on `backboneSessionExpiresAt`
- **TTL Management**: Sessions automatically expire in Redis based on the earliest expiration time
- **Automatic Reconnection**: Redis client handles reconnection with exponential backoff
- **Memory Fallback**: Falls back to in-memory Map when Redis is unavailable
- **URL Sanitization**: Redis connection URLs are redacted in logs to hide credentials

### 3. Distributed Lock Utility (`server/shared/redis-lock.js`)
- **Lock Acquisition**: `acquireLock(redisClient, lockKey, ttlMs)` - Acquires lock with TTL
- **Lock Release**: `releaseLock(redisClient, lockKey, lockToken)` - Atomic compare-and-delete using Lua script
- **High-level API**: `withLock(redisClient, lockKey, fn)` - Execute function with automatic lock management
- **Retry Logic**: Configurable retry attempts with exponential backoff
- **Graceful Degradation**: Executes without lock if Redis is unavailable

### 4. Updated Backbone Controller (`server/controller/backbone.controller.js`)
- **Redis Session Integration**: Replaced `user-session-store` with `redis-session-store`
- **Distributed Locks**: Uses locks in `sessionToken()` and `renewToken()` to prevent race conditions
- **Expires_in Support**: Updates session expiration based on `expires_in` from backbone responses
- **Async/Await**: All session operations are now properly async

### 5. Auth Refresh Endpoint (`server/controller/auth-refresh.controller.js`)
- **Endpoint**: `POST /api/auth/refresh`
- **Multiple Auth Methods**: Supports userId from body, headers, cookies, or extracted from JWT token
- **Smart Refresh**: Only refreshes if session is within 5 minutes of expiration
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Environment Variables

Required environment variables:

```bash
# Redis Configuration
REDIS_URL=redis://[username:password@]host:port/[database]
# Example: redis://localhost:6379
# Example: redis://user:pass@redis-server:6379/0

# Existing variables (required)
BACKBONE_AUTH_CLIENT_ID=your-client-id
BACKBONE_AUTH_CLIENT_SECRET=your-client-secret
BACKBONE_AUTH_SERVER_URI=https://your-keycloak/token
APPLICATION_ID=your-app-id
ENCRYPT_KEY=your-encryption-key
ENCRYPT_IV=your-encryption-iv
```

## Redis Key Patterns

The implementation uses the following Redis key patterns:

- `oauth_token:{clientId}` - Application OAuth tokens
- `session:{userId}` - User sessions
- `lock:oauth_token:{clientId}` - Locks for token refresh
- `lock:session:{alias}` - Locks for session creation
- `lock:renew:{userId}` - Locks for token renewal

## Dependencies Added

```json
{
  "dependencies": {
    "redis": "^4.7.0",
    "uuid": "^11.0.5"
  }
}
```

## Usage Examples

### Frontend Integration (Angular)

The auth-refresh endpoint can be integrated into the Angular frontend's auth service:

```typescript
// src/app/core/services/auth.service.ts

/**
 * Refresh the user's session token
 */
refreshToken(): Observable<any> {
  const userId = this.getCurrentUserId();
  return this.httpService.post('/api/auth/refresh', { userId }).pipe(
    tap(response => {
      this.logger.info('Token refreshed successfully');
      // Update local storage with new token if needed
      if (response.token) {
        this.storageService.setLocal('auth_token', response.token);
      }
    }),
    catchError(error => {
      this.logger.error('Token refresh failed', error);
      return throwError(() => error);
    })
  );
}

/**
 * Automatically refresh token when close to expiration
 */
setupAutoRefresh(): void {
  // Check every minute if token needs refresh
  interval(60000).pipe(
    switchMap(() => this.refreshToken())
  ).subscribe();
}
```

### Testing Concurrency

To test that distributed locks prevent race conditions:

```javascript
// Test concurrent token requests
const requests = Array(10).fill(null).map(() => 
  getOAuthClient(config).getBearerToken()
);

const results = await Promise.all(requests);
// All results should have the same token
// Only 1 request to Keycloak should have occurred (check logs)
```

### Session Persistence Testing

```bash
# 1. Start application with Redis
REDIS_URL=redis://localhost:6379 node server.js

# 2. Login (creates session in Redis)
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"alias": "user@example.com", "password": "secret"}'

# 3. Restart Node.js (without clearing Redis)
# Stop server and restart

# 4. Verify session persists
curl -X POST https://localhost:7001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-from-step-2"}'
```

## Backward Compatibility

The implementation maintains full backward compatibility:

1. **No Redis**: Falls back to in-memory storage automatically
2. **Existing Endpoints**: All existing endpoints continue to work unchanged
3. **No Breaking Changes**: Session store interface remains compatible

## Migration Notes

- **Other Controllers**: `directory-backend-auth.controller.js` and other controllers still use `user-session-store`
- **Future PRs**: Additional controllers should be migrated in separate PRs
- **Testing**: Test in non-production environments first

## Security Considerations

1. **No Token Logging**: OAuth tokens are never logged in plain text
2. **URL Sanitization**: Redis URLs are redacted in logs (credentials hidden)
3. **Secure Locks**: Lock tokens are UUIDs, preventing lock hijacking
4. **TTL Safety**: Tokens cached with buffer (10s before actual expiration)

## Performance Benefits

1. **Reduced API Calls**: Redis caching reduces calls to OAuth/Keycloak servers
2. **Race Condition Prevention**: Distributed locks prevent duplicate token requests
3. **Session Persistence**: Sessions survive server restarts
4. **Scalability**: Multiple Node.js instances can share sessions via Redis

## Troubleshooting

### Redis Connection Issues

If Redis is unavailable, check logs for:
```
[REDIS_SESSION_STORE] ::: REDIS_URL not configured, using in-memory fallback
```

This is normal and the application will continue working with in-memory storage.

### Lock Timeouts

If operations are slow, increase lock TTL:
```javascript
// In withLock calls, increase TTL from 15000ms to higher value
await withLock(redisClient, lockKey, fn, 30000);
```

### Session Not Persisting

Verify Redis is running and REDIS_URL is correct:
```bash
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

Check session keys in Redis:
```bash
redis-cli -u $REDIS_URL KEYS "session:*"
```

## Files Modified/Created

### Created
- `server/shared/redis-lock.js` - Distributed lock utility
- `server/shared/redis-session-store.js` - Redis session store
- `server/controller/auth-refresh.controller.js` - Token refresh endpoint
- `server/routes/auth-refresh.routes.js` - Routes for auth refresh

### Modified
- `package.json` - Added redis dependency
- `server/proxy/oauth-client.js` - Redis caching with distributed locks
- `server/controller/backbone.controller.js` - Redis session integration
- `server.js` - Registered auth-refresh routes

## Next Steps

Future enhancements could include:

1. Migrate remaining controllers to use `redis-session-store`
2. Add Redis Cluster support for high availability
3. Implement session cleanup background job
4. Add metrics/monitoring for cache hit rates
5. Add Redis health check endpoint
6. Implement refresh token rotation
7. Add session invalidation endpoint
