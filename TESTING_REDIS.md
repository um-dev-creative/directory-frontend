# Redis Token and Session Management - Testing Guide

## Overview

This document provides instructions for testing the Redis-based token and session management implementation.

## Prerequisites

1. Node.js v18+ installed
2. Redis server running (or use Docker)
3. Environment variables configured

## Setup Redis

### Option 1: Using Docker (Recommended)

```bash
docker run --name redis-test -p 6379:6379 -d redis:7-alpine
```

### Option 2: Using Local Redis

```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
```

## Environment Configuration

Add the following to your environment variables or `.env` file:

```env
REDIS_URL=redis://localhost:6379

# Existing required variables
ENCRYPT_KEY=your_encrypt_key_here
ENCRYPT_IV=your_encrypt_iv_here
APPLICATION_ID=your_app_id
BACKBONE_AUTH_AUTHENTICATION_TYPE=OPAQUE
BACKBONE_AUTH_CLIENT_ID=your_client_id
BACKBONE_AUTH_CLIENT_SECRET=your_client_secret
BACKBONE_AUTH_GRANT_TYPE=password
BACKBONE_AUTH_SERVER_URI=https://your-keycloak-server/auth/realms/your-realm/protocol/openid-connect/token
BACKBONE_AUTH_USER_ALIAS=your_service_user
BACKBONE_AUTH_USER_PASSWORD=your_service_password
```

## Test Scenarios

### Test 1: Basic Token Caching in Redis

**Objective**: Verify that OAuth tokens are cached in Redis with proper TTL.

**Steps**:
1. Start the application
2. Monitor Redis keys:
   ```bash
   redis-cli MONITOR
   ```
3. Make an API request that requires authentication
4. Check Redis for cached token:
   ```bash
   redis-cli KEYS "oauth_token:*"
   redis-cli GET "oauth_token:your_client_id"
   redis-cli TTL "oauth_token:your_client_id"
   ```

**Expected Result**:
- Token is stored in Redis with key pattern `oauth_token:client_id`
- TTL is set based on `expires_in` from OAuth response
- Subsequent requests use cached token (no new OAuth calls)

### Test 2: Distributed Lock for Token Renewal

**Objective**: Verify that concurrent token requests don't cause multiple OAuth calls.

**Steps**:
1. Start application
2. Clear Redis cache:
   ```bash
   redis-cli FLUSHDB
   ```
3. Make 10 concurrent API requests:
   ```bash
   # Using curl in parallel
   for i in {1..10}; do
     curl -X POST http://localhost:3000/your-api-endpoint \
       -H "Content-Type: application/json" \
       -d '{"alias": "testuser"}' &
   done
   wait
   ```
4. Check application logs for token fetch messages
5. Check Redis for lock keys:
   ```bash
   redis-cli KEYS "lock:oauth_token:*"
   ```

**Expected Result**:
- Only ONE OAuth token request is made (check logs)
- Lock is acquired by one process, others wait
- All requests succeed and use the same token

### Test 3: Session Persistence in Redis

**Objective**: Verify that user sessions are stored in Redis with proper TTL.

**Steps**:
1. Start application
2. Authenticate a user (login)
3. Check Redis for session:
   ```bash
   redis-cli KEYS "session:*"
   redis-cli GET "session:user_id_or_alias"
   redis-cli TTL "session:user_id_or_alias"
   ```
4. Make API calls with the session
5. Restart the application
6. Make another API call (session should still be valid)

**Expected Result**:
- Session is stored in Redis with key pattern `session:user_id`
- TTL matches session expiration time
- Session survives application restart
- User doesn't need to re-authenticate if session is still valid

### Test 4: Session Token Renewal with Lock

**Objective**: Verify that token renewal is protected by distributed lock.

**Steps**:
1. Start application
2. Create a session for a user
3. Wait until token is near expiration or manually expire it:
   ```bash
   redis-cli DEL "session:user_id"
   ```
4. Make 5 concurrent requests for the same user:
   ```bash
   for i in {1..5}; do
     curl -X POST http://localhost:3000/api/renew-token \
       -H "Content-Type: application/json" \
       -d '{"userId": "test_user_id"}' &
   done
   wait
   ```
5. Check logs for renewal attempts

**Expected Result**:
- Only ONE renewal request is made to backbone
- Lock prevents concurrent renewals
- All requests receive the renewed token
- Session TTL is updated

### Test 5: Fallback to Memory Cache

**Objective**: Verify that system works when Redis is unavailable.

**Steps**:
1. Stop Redis:
   ```bash
   docker stop redis-test
   # or
   sudo systemctl stop redis-server
   ```
2. Start/restart application
3. Make API requests
4. Check application logs

**Expected Result**:
- Application starts successfully
- Warning logged: "REDIS_URL not configured" or "Redis not available"
- Tokens and sessions are cached in memory
- All functionality works (without persistence)

### Test 6: TTL Based on expires_in

**Objective**: Verify that TTL is set based on OAuth response.

**Steps**:
1. Start application with Redis
2. Authenticate and check token cache:
   ```bash
   redis-cli TTL "oauth_token:your_client_id"
   ```
3. Create a session and check TTL:
   ```bash
   redis-cli TTL "session:user_id"
   ```

**Expected Result**:
- Token TTL matches `expires_in` from OAuth response (in seconds)
- Session TTL is calculated from `backboneSessionExpiresAt`
- TTL is updated when token is renewed

## Monitoring and Debugging

### Check Redis Connection

```bash
redis-cli PING
# Expected: PONG
```

### Monitor All Redis Operations

```bash
redis-cli MONITOR
```

### View All Keys

```bash
redis-cli KEYS "*"
```

### Get Key Details

```bash
redis-cli TYPE key_name
redis-cli TTL key_name
redis-cli GET key_name
```

### Check Application Logs

Look for these log patterns:
- `[REDIS_CLIENT] ::: Successfully connected to Redis`
- `[REDIS_LOCK] ::: Lock acquired:`
- `[REDIS_LOCK] ::: Lock released:`
- `[REDIS_SESSION_STORE] ::: Session stored in Redis`
- `[OAUTH_CLIENT] ::: Token cached in Redis`
- `[BACKBONE_CONTROLLER] ::: Session stored in Redis`

### Clear Redis Data

```bash
# Clear all keys
redis-cli FLUSHDB

# Clear specific keys
redis-cli DEL "oauth_token:client_id"
redis-cli DEL "session:user_id"
```

## Performance Testing

### Test Concurrent Requests

```bash
# Install Apache Bench if not available
sudo apt-get install apache2-utils

# Run 100 requests with 10 concurrent
ab -n 100 -c 10 -p request.json -T application/json http://localhost:3000/your-endpoint
```

### Monitor Lock Performance

Check lock acquisition time and conflicts:

```javascript
// Add to redis-lock.js temporarily for debugging
console.time('lock-acquire');
const lockToken = await acquireLock(redisClient, lockKey, ttlMs);
console.timeEnd('lock-acquire');
```

## Common Issues and Solutions

### Issue: Redis connection failed

**Solution**: 
- Check if Redis is running: `redis-cli PING`
- Verify REDIS_URL is correct
- Check network connectivity

### Issue: Locks not releasing

**Solution**:
- Check lock TTL (should auto-expire)
- Verify Lua script syntax
- Check Redis logs: `redis-cli CLIENT LIST`

### Issue: Sessions not persisting

**Solution**:
- Verify backboneSessionExpiresAt is set correctly
- Check Redis memory limits
- Monitor Redis with: `redis-cli INFO memory`

### Issue: Memory fallback not working

**Solution**:
- Check logs for Redis errors
- Verify fallback logic is triggered
- Test without REDIS_URL configured

## Success Criteria Checklist

- [ ] OAuth tokens cached in Redis with correct TTL
- [ ] Concurrent requests don't trigger multiple OAuth calls
- [ ] Distributed locks prevent race conditions
- [ ] Sessions persist in Redis and survive restarts
- [ ] Token renewal uses expires_in and updates TTL
- [ ] Fallback to memory cache works when Redis unavailable
- [ ] No tokens visible in logs (redacted)
- [ ] Application backwards compatible (no API changes)
- [ ] Performance improved (fewer OAuth calls)

## Additional Notes

- Redis is optional - system works without it
- Memory cache is used as fallback
- Distributed locks only work with Redis
- Session persistence requires Redis
- Monitor Redis memory usage in production
- Consider Redis cluster for high availability
- Use Redis Sentinel or Redis Cluster for production deployments

## Support

For issues or questions:
1. Check application logs
2. Check Redis logs
3. Review this testing guide
4. Check Redis documentation: https://redis.io/docs/
