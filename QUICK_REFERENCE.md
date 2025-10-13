# Quick Reference - Redis Token & Session Management

## 🚀 Quick Start

### Without Redis (Memory Mode)
```bash
npm start
```
✅ Works immediately, uses in-memory cache

### With Redis (Recommended for Production)
```bash
# Start Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Set environment variable
export REDIS_URL=redis://localhost:6379

# Start application
npm start
```
✅ Sessions persist, distributed locks active

## 📋 Quick Commands

### Check Redis Connection
```bash
redis-cli PING
# Expected: PONG
```

### View Cached Tokens
```bash
redis-cli KEYS "oauth_token:*"
redis-cli GET "oauth_token:your_client_id"
redis-cli TTL "oauth_token:your_client_id"
```

### View Sessions
```bash
redis-cli KEYS "session:*"
redis-cli GET "session:user_id"
redis-cli TTL "session:user_id"
```

### View Active Locks
```bash
redis-cli KEYS "lock:*"
```

### Monitor All Operations
```bash
redis-cli MONITOR
```

### Clear All Data
```bash
redis-cli FLUSHDB
```

## 🧪 Quick Test

### Run Integration Test
```bash
node test/redis-integration.test.js
```

### Test Concurrent Requests
```bash
# Make 10 concurrent requests (should only trigger 1 OAuth call)
for i in {1..10}; do
  curl -X POST http://localhost:3000/your-endpoint \
    -H "Content-Type: application/json" \
    -d '{"alias": "testuser"}' &
done
wait

# Check logs - should see only 1 token fetch
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server/shared/redis-client.js` | Redis connection management |
| `server/shared/redis-lock.js` | Distributed locks |
| `server/shared/redis-session-store.js` | Session persistence |
| `server/proxy/oauth-client.js` | Token caching |
| `server/controller/backbone.controller.js` | Session management |

## 📖 Documentation

| Document | Description |
|----------|-------------|
| `ARCHITECTURE.md` | Visual diagrams and data flow |
| `REDIS_IMPLEMENTATION.md` | Complete implementation guide |
| `TESTING_REDIS.md` | Testing scenarios (6 tests) |
| `IMPLEMENTATION_SUMMARY.md` | Full implementation details |
| This file | Quick reference |

## 🔍 Troubleshooting

### Redis Connection Failed
```bash
# Check if Redis is running
redis-cli PING

# Check connection string
echo $REDIS_URL

# View application logs
# Look for: "[REDIS_CLIENT] ::: Successfully connected to Redis"
```

### Locks Not Working
```bash
# Check for active locks
redis-cli KEYS "lock:*"

# Check lock TTL
redis-cli TTL "lock:oauth_token:client_id"

# Locks auto-expire, default 5000ms for tokens
```

### Sessions Not Persisting
```bash
# Check session exists
redis-cli GET "session:user_id"

# Check TTL
redis-cli TTL "session:user_id"

# Verify REDIS_URL is set
echo $REDIS_URL
```

## 🎯 Common Use Cases

### Deploy to Production
```bash
# 1. Set environment variable
export REDIS_URL=redis://your-redis-host:6379

# 2. Start application
npm start

# 3. Verify in logs
# Look for: "[REDIS_CLIENT] ::: Successfully connected to Redis"
```

### Scale Horizontally
```bash
# All instances use same Redis
# Sessions shared automatically
# Distributed locks coordinate between instances

# Instance 1
REDIS_URL=redis://shared-redis:6379 npm start

# Instance 2
REDIS_URL=redis://shared-redis:6379 npm start

# Instance 3
REDIS_URL=redis://shared-redis:6379 npm start
```

### High Availability Setup
```bash
# Use Redis Sentinel or Cluster
export REDIS_URL=redis://sentinel1:26379,sentinel2:26379/mymaster

# Or Redis Cluster
export REDIS_URL=redis://node1:6379,node2:6379,node3:6379
```

### Debug Mode
```bash
# Monitor all Redis operations
redis-cli MONITOR

# Check specific key details
redis-cli TYPE key_name
redis-cli TTL key_name
redis-cli GET key_name

# View all keys
redis-cli KEYS "*"
```

## 📊 Monitoring Checklist

- [ ] Redis connection status
- [ ] Token cache hit rate
- [ ] Session count
- [ ] Active locks count
- [ ] Redis memory usage
- [ ] Connection pool status
- [ ] Lock contention rate

### Get Redis Stats
```bash
redis-cli INFO stats
redis-cli INFO memory
redis-cli INFO clients
```

## ⚙️ Configuration

### Environment Variables

**Required for Redis:**
```env
REDIS_URL=redis://localhost:6379
```

**Optional (existing):**
```env
ENCRYPT_KEY=your_32_character_key_here
ENCRYPT_IV=your_16_character_iv
APPLICATION_ID=your_app_id
BACKBONE_AUTH_AUTHENTICATION_TYPE=OPAQUE
BACKBONE_AUTH_CLIENT_ID=client_id
BACKBONE_AUTH_CLIENT_SECRET=client_secret
BACKBONE_AUTH_GRANT_TYPE=password
BACKBONE_AUTH_SERVER_URI=https://keycloak-host/auth/...
BACKBONE_AUTH_USER_ALIAS=service_user
BACKBONE_AUTH_USER_PASSWORD=service_password
```

## 🎓 Key Concepts

### Token Caching
- Tokens cached with TTL from `expires_in`
- 90% threshold for validity check
- Distributed lock prevents concurrent OAuth calls
- Automatic fallback to memory

### Session Persistence
- Sessions stored with TTL from expiration time
- Survive application restarts
- Shared across instances
- Automatic cleanup on expiration

### Distributed Locks
- SET NX PX for atomic acquisition
- UUID tokens for security
- Lua script for safe release
- Auto-expiring (no deadlocks)

### Graceful Degradation
- Works without Redis
- Automatic fallback to memory
- No code changes needed
- Transparent to application

## 📞 Support

1. Check application logs
2. Check Redis logs: `redis-cli CLIENT LIST`
3. Review documentation
4. Check Redis status: `redis-cli INFO`

## ✅ Success Indicators

When everything is working:
- ✅ Logs show: "Successfully connected to Redis"
- ✅ Keys visible: `redis-cli KEYS "*"`
- ✅ TTL set on keys: `redis-cli TTL key`
- ✅ Concurrent requests don't trigger multiple OAuth calls
- ✅ Sessions persist across restarts

## 🚨 Emergency Procedures

### Redis Down
- Application continues with memory cache
- Sessions lost on restart
- Distributed locks disabled
- Fix Redis and restart application

### Clear All Cache
```bash
redis-cli FLUSHDB
# Application will repopulate cache
```

### Reset Specific User Session
```bash
redis-cli DEL "session:user_id"
# User will need to re-authenticate
```

### Force Token Refresh
```bash
redis-cli DEL "oauth_token:client_id"
# Next request will fetch new token
```

## 📝 Notes

- Redis is optional (memory fallback available)
- No breaking changes to existing code
- Zero downtime deployment possible
- All existing APIs unchanged
- Compatible with Node.js 18+

---

For detailed information, see:
- **ARCHITECTURE.md** - Visual diagrams
- **REDIS_IMPLEMENTATION.md** - Full implementation guide
- **TESTING_REDIS.md** - Test scenarios
- **IMPLEMENTATION_SUMMARY.md** - Complete details
