# Redis Integration for Token and Session Management

## Overview

This implementation adds Redis-based caching and session persistence with distributed locks to improve token and session management in the directory-frontend backend.

## Architecture

### Components

1. **server/shared/redis-client.js**
   - Singleton Redis client with auto-reconnection
   - Graceful fallback when Redis is not available
   - Connection management and error handling

2. **server/shared/redis-lock.js**
   - Distributed lock implementation using SET NX PX
   - Safe lock release using Lua compare-and-delete
   - Prevents race conditions in concurrent scenarios

3. **server/shared/redis-session-store.js**
   - Redis-backed session storage with TTL
   - Automatic fallback to in-memory storage
   - TTL calculated from session expiration times

4. **server/proxy/oauth-client.js** (Modified)
   - OAuth token caching in Redis
   - Distributed locks for token renewal
   - Uses URLSearchParams for all OAuth requests
   - Token TTL based on expires_in from OAuth response

5. **server/controller/backbone.controller.js** (Modified)
   - Uses redis-session-store for session management
   - Distributed locks for session token renewal
   - Updates session TTL using expires_in from backbone

## Key Features

### Redis Caching
- OAuth tokens cached with TTL from `expires_in`
- Sessions persisted with TTL from `backboneSessionExpiresAt`
- Automatic cache invalidation on expiration

### Distributed Locks
- Prevents concurrent OAuth token requests
- Prevents concurrent session renewals
- Uses SET NX PX for lock acquisition
- Lua script for atomic compare-and-delete release

### Graceful Fallback
- Works without Redis (uses memory cache)
- No breaking changes to existing functionality
- Logs warnings when Redis unavailable

### Security
- Tokens redacted in logs
- Lock tokens use UUID v4 for uniqueness
- No sensitive data exposed

## Environment Variables

### Required (if using Redis)
```env
REDIS_URL=redis://localhost:6379
```

### Existing Variables (unchanged)
```env
ENCRYPT_KEY=your_32_char_key
ENCRYPT_IV=your_16_char_iv
APPLICATION_ID=your_app_id
BACKBONE_AUTH_AUTHENTICATION_TYPE=OPAQUE
BACKBONE_AUTH_CLIENT_ID=client_id
BACKBONE_AUTH_CLIENT_SECRET=client_secret
BACKBONE_AUTH_GRANT_TYPE=password
BACKBONE_AUTH_SERVER_URI=https://keycloak/auth/realms/realm/protocol/openid-connect/token
BACKBONE_AUTH_USER_ALIAS=service_user
BACKBONE_AUTH_USER_PASSWORD=service_password
```

## Usage

### With Redis

1. Start Redis:
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

2. Set environment variable:
   ```bash
   export REDIS_URL=redis://localhost:6379
   ```

3. Start application:
   ```bash
   npm start
   ```

### Without Redis

Simply don't set `REDIS_URL` or ensure Redis is not accessible. The application will:
- Log warning: "REDIS_URL not configured, Redis features disabled"
- Use in-memory cache for tokens and sessions
- Function normally but without persistence

## Benefits

### Performance
- Reduced OAuth token requests (cached in Redis)
- Reduced session creation overhead
- Faster authentication flows

### Scalability
- Sessions shared across multiple instances
- Distributed locks prevent race conditions
- Horizontal scaling support

### Reliability
- Sessions survive instance restarts
- Automatic token renewal with locks
- Graceful degradation without Redis

## Monitoring

### Redis Keys

Check cached tokens:
```bash
redis-cli KEYS "oauth_token:*"
redis-cli GET "oauth_token:client_id"
redis-cli TTL "oauth_token:client_id"
```

Check sessions:
```bash
redis-cli KEYS "session:*"
redis-cli GET "session:user_id"
redis-cli TTL "session:user_id"
```

Check locks:
```bash
redis-cli KEYS "lock:*"
```

### Application Logs

Look for these patterns:
- `[REDIS_CLIENT] ::: Successfully connected to Redis`
- `[REDIS_LOCK] ::: Lock acquired:`
- `[REDIS_LOCK] ::: Lock released:`
- `[REDIS_SESSION_STORE] ::: Session stored in Redis`
- `[OAUTH_CLIENT] ::: Token cached in Redis`

## Testing

### Basic Integration Test

```bash
# Ensure Redis is running
docker run -d -p 6379:6379 redis:7-alpine

# Run test
node test/redis-integration.test.js
```

### Manual Testing

See `TESTING_REDIS.md` for comprehensive testing scenarios including:
- Token caching verification
- Distributed lock testing
- Session persistence testing
- Concurrent request testing
- Fallback testing

## Migration from In-Memory Store

The implementation is backwards compatible:

1. **No code changes required** in consuming code
2. **Same function signatures** for session operations
3. **Transparent fallback** to memory when Redis unavailable
4. **No database migrations** needed

### Gradual Rollout

1. Deploy with `REDIS_URL` not set (uses memory)
2. Monitor for any issues
3. Set `REDIS_URL` to enable Redis
4. Monitor Redis metrics
5. Full rollout

## Performance Considerations

### Memory Usage
- Redis: Minimal (only active sessions and tokens)
- Memory fallback: Grows with active sessions

### Network Latency
- Redis: ~1ms local, ~2-5ms same datacenter
- Memory: No network overhead

### Recommendations
- Use Redis in same datacenter as application
- Monitor Redis memory with: `redis-cli INFO memory`
- Set Redis maxmemory policy: `maxmemory-policy allkeys-lru`

## Production Deployment

### High Availability

Option 1: Redis Sentinel
```bash
# 3 sentinels for failover
redis-sentinel sentinel.conf
```

Option 2: Redis Cluster
```bash
# 3 master + 3 replica cluster
redis-cli --cluster create ...
```

### Configuration

```env
# Redis Sentinel
REDIS_URL=redis://sentinel1:26379,sentinel2:26379,sentinel3:26379/mymaster

# Redis Cluster
REDIS_URL=redis://node1:6379,node2:6379,node3:6379
```

### Monitoring

- Enable Redis persistence (AOF or RDB)
- Monitor memory usage
- Set up alerts for connection failures
- Monitor lock contention

## Troubleshooting

### Redis Connection Issues

1. Check Redis is running: `redis-cli PING`
2. Verify REDIS_URL is correct
3. Check network connectivity
4. Review Redis logs

### Lock Contention

If you see frequent lock acquisition failures:
1. Check lock TTL (default 5000ms for tokens, 10000ms default)
2. Monitor concurrent request patterns
3. Consider increasing lock timeout

### Memory Issues

If Redis memory grows:
1. Check TTL on keys: `redis-cli TTL key`
2. Monitor with: `redis-cli INFO memory`
3. Set maxmemory policy
4. Review session expiration logic

## Future Enhancements

Potential improvements:
1. Add Redis Pub/Sub for session invalidation across instances
2. Implement session refresh strategy
3. Add metrics for cache hit/miss rates
4. Support Redis Cluster mode
5. Add circuit breaker for Redis failures

## Support

For issues or questions:
1. Check application logs
2. Review `TESTING_REDIS.md`
3. Check Redis logs
4. Consult Redis documentation

## License

Same as parent project.
