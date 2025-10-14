# Quick Start Guide - Redis Session Management

## Environment Setup

### Option 1: With Redis (Production/Staging)

```bash
# Set Redis URL
export REDIS_URL="redis://localhost:6379"

# Or with authentication
export REDIS_URL="redis://username:password@redis-host:6379/0"

# Start the application
npm run start-dev:unix
```

### Option 2: Without Redis (Development)

```bash
# Simply don't set REDIS_URL
# Application will use in-memory fallback automatically
npm run start-dev:unix
```

## Testing the Implementation

### 1. Test Auth Refresh Endpoint

```bash
# Login first to get a session
curl -X POST https://localhost:7001/api/backbone/access-token \
  -H "Content-Type: application/json" \
  -d '{
    "alias": "user@example.com",
    "password": "your-password"
  }'

# Extract userId from the response token, then refresh:
curl -X POST https://localhost:7001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id-from-jwt"
  }'
```

### 2. Test Session Persistence (With Redis)

```bash
# Step 1: Login
# Step 2: Restart Node.js server
# Step 3: Call refresh endpoint
# Expected: Session should still exist
```

### 3. Test Concurrency (Race Condition Prevention)

```javascript
// Run multiple concurrent requests
const Promise = require('bluebird');

const requests = Array(10).fill(null).map((_, i) => 
  axios.post('https://localhost:7001/api/backbone/access-token', {
    alias: 'user@example.com',
    password: 'password'
  })
);

const results = await Promise.all(requests);
// Check logs: Should see only 1 token request to Keycloak
```

## Redis Key Inspection

```bash
# Connect to Redis
redis-cli -u $REDIS_URL

# List all session keys
KEYS session:*

# View a specific session
GET session:user-id-here

# List all token keys
KEYS oauth_token:*

# Check token TTL
TTL oauth_token:your-client-id

# List all locks (should be empty when no operations running)
KEYS lock:*
```

## Environment Variables Reference

```bash
# Required for Redis functionality
REDIS_URL=redis://localhost:6379

# Existing variables (still required)
BACKBONE_AUTH_CLIENT_ID=your-client-id
BACKBONE_AUTH_CLIENT_SECRET=your-secret
BACKBONE_AUTH_SERVER_URI=https://keycloak/token
BACKBONE_AUTH_GRANT_TYPE=password
BACKBONE_AUTH_AUTHENTICATION_TYPE=JWT
BACKBONE_AUTH_USER_ALIAS=service-account
BACKBONE_AUTH_USER_PASSWORD=service-password
APPLICATION_ID=your-app-id
ENCRYPT_KEY=32-char-encryption-key
ENCRYPT_IV=16-char-encryption-iv
```

## Troubleshooting

### Issue: "Redis client not available"
**Solution**: This is normal if REDIS_URL is not set. App uses memory fallback.

### Issue: Sessions not persisting after restart
**Cause**: Redis not configured or not running
**Solution**: 
```bash
# Check Redis is running
redis-cli -u $REDIS_URL ping
# Should return: PONG

# Check REDIS_URL is set
echo $REDIS_URL
```

### Issue: Seeing lock timeout errors
**Cause**: Operations taking longer than lock TTL (15s)
**Solution**: Increase lock TTL in code or check network latency to OAuth server

## Log Messages to Expect

### With Redis:
```
[REDIS_SESSION_STORE] ::: Initializing Redis client with URL: redis://***@localhost:6379
[REDIS_SESSION_STORE] ::: Redis client ready
[OAUTH_CLIENT] ::: Fetching token with distributed lock
[OAUTH_CLIENT] ::: Token cached in Redis with TTL: 1790s
```

### Without Redis:
```
[REDIS_SESSION_STORE] ::: REDIS_URL not configured, using in-memory fallback
[OAUTH_CLIENT] ::: Fetching token without distributed lock (Redis not available)
[REDIS_SESSION_STORE] ::: Using in-memory store for setUserSession
```

## Performance Monitoring

Monitor these metrics:
- OAuth token cache hit rate (check logs for "Returning cached token")
- Redis connection status (check for reconnection messages)
- Lock acquisition success rate
- Session creation time (should be faster with Redis)

## Migration Checklist for Production

- [ ] Install Redis server or use managed Redis service
- [ ] Set REDIS_URL environment variable
- [ ] Test in staging environment first
- [ ] Monitor logs for Redis connection issues
- [ ] Set up Redis persistence (RDB or AOF)
- [ ] Configure Redis memory limits
- [ ] Set up Redis monitoring (memory, connections, ops/sec)
- [ ] Test failover scenario (Redis goes down)
- [ ] Document Redis backup/restore procedures

## Common Redis Commands

```bash
# Monitor all Redis commands in real-time
redis-cli -u $REDIS_URL MONITOR

# Get Redis info
redis-cli -u $REDIS_URL INFO

# Count keys
redis-cli -u $REDIS_URL DBSIZE

# Clear all data (CAREFUL!)
redis-cli -u $REDIS_URL FLUSHDB

# Check memory usage
redis-cli -u $REDIS_URL INFO memory
```

## Support

For issues or questions:
1. Check REDIS_IMPLEMENTATION.md for detailed documentation
2. Review logs for error messages
3. Verify all environment variables are set
4. Test Redis connectivity independently
