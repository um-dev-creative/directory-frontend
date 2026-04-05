# Architecture Diagram - Redis Token & Session Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Directory Frontend Backend                          │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      backbone.controller.js                             │ │
│  │                                                                          │ │
│  │  ┌──────────────────┐         ┌──────────────────┐                     │ │
│  │  │  sessionToken()  │         │   renewToken()   │                     │ │
│  │  │                  │         │                  │                     │ │
│  │  │  - Check cache   │         │  - Acquire lock  │                     │ │
│  │  │  - Create if new │         │  - Renew token   │                     │ │
│  │  │  - Use locks     │         │  - Update TTL    │                     │ │
│  │  └────────┬─────────┘         └─────────┬────────┘                     │ │
│  │           │                             │                               │ │
│  │           └──────────────┬──────────────┘                               │ │
│  │                          │                                               │ │
│  └──────────────────────────┼───────────────────────────────────────────────┘ │
│                             │                                                 │
│  ┌──────────────────────────┼───────────────────────────────────────────────┐ │
│  │                          ▼       redis-session-store.js                  │ │
│  │                                                                           │ │
│  │   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐         │ │
│  │   │ getUserSession │   │ setUserSession │   │removeUserSession│         │ │
│  │   │                │   │                │   │                 │         │ │
│  │   │ - Redis first  │   │ - TTL from exp │   │ - Both stores  │         │ │
│  │   │ - Memory fallback  │   │ - Redis + memory│   │                 │         │ │
│  │   └───────┬────────┘   └────────┬───────┘   └────────┬────────┘         │ │
│  │           │                     │                     │                  │ │
│  └───────────┼─────────────────────┼─────────────────────┼──────────────────┘ │
│              │                     │                     │                    │
│  ┌───────────┼─────────────────────┼─────────────────────┼──────────────────┐ │
│  │           ▼                     ▼                     ▼  redis-lock.js   │ │
│  │                                                                           │ │
│  │   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐                │ │
│  │   │acquireLock()│   │releaseLock() │   │  withLock()  │                │ │
│  │   │             │   │              │   │              │                │ │
│  │   │ SET NX PX   │   │  Lua script  │   │ Execute fn   │                │ │
│  │   └──────┬──────┘   └──────┬───────┘   └──────┬───────┘                │ │
│  │          │                 │                   │                        │ │
│  └──────────┼─────────────────┼───────────────────┼────────────────────────┘ │
│             │                 │                   │                          │
│  ┌──────────┼─────────────────┼───────────────────┼────────────────────────┐ │
│  │          │                 │                   │    oauth-client.js     │ │
│  │          │                 │                   │                        │ │
│  │   ┌──────▼──────────┐   ┌──────────────────────────────────┐           │ │
│  │   │ getBearerToken()│   │         Token Cache               │           │ │
│  │   │                 │   │                                   │           │ │
│  │   │ - Check cache   │───▶│  getCachedToken()                │           │ │
│  │   │ - Acquire lock  │   │  setCachedToken()                │           │ │
│  │   │ - Fetch if needed│   │  isTokenValid()                  │           │ │
│  │   │ - Cache with TTL│   │                                   │           │ │
│  │   └─────────────────┘   └───────────────────────────────────┘           │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                        redis-client.js                                   │ │
│  │                                                                           │ │
│  │   ┌──────────────────────────────────────────────────────────────┐      │ │
│  │   │                   getRedisClient()                            │      │ │
│  │   │                                                               │      │ │
│  │   │  - Singleton pattern                                          │      │ │
│  │   │  - Lazy initialization                                        │      │ │
│  │   │  - Auto-reconnect with backoff                                │      │ │
│  │   │  - Connection pooling                                         │      │ │
│  │   └───────────────────────────┬───────────────────────────────────┘      │ │
│  │                               │                                          │ │
│  └───────────────────────────────┼──────────────────────────────────────────┘ │
│                                  │                                            │
└──────────────────────────────────┼────────────────────────────────────────────┘
                                   │
                   ┌───────────────┴────────────────┐
                   │                                │
         ┌─────────▼─────────┐          ┌─────────▼──────────┐
         │                   │          │                    │
         │  Redis Server     │          │  Memory Fallback   │
         │                   │          │                    │
         │  - Token cache    │          │  - Map for tokens  │
         │  - Session store  │          │  - Map for sessions│
         │  - Distributed    │          │  - No persistence  │
         │    locks          │          │  - No locks        │
         │  - TTL management │          │                    │
         │  - Persistence    │          │                    │
         │                   │          │                    │
         └───────────────────┘          └────────────────────┘
         
         (Optional - with REDIS_URL)    (Always available)


Key Features:
═════════════

1. Distributed Locks
   • SET NX PX for atomic acquisition
   • UUID tokens for security
   • Lua script for safe release
   • Auto-expiring (TTL-based)

2. Token Caching
   • Redis with TTL from expires_in
   • Memory fallback
   • 90% validity threshold
   • Prevents concurrent OAuth calls

3. Session Persistence
   • TTL from backboneSessionExpiresAt
   • Survives restarts
   • Shared across instances
   • Automatic expiration

4. High Availability
   • Graceful Redis failure handling
   • Automatic memory fallback
   • No single point of failure
   • Backwards compatible

Data Flow Example:
═════════════════

1. Token Request:
   Client → backbone.controller → redis-session-store → redis-client → Redis
                                                      ↓
                                              (if no session)
                                                      ↓
                                   oauth-client → redis-lock → Redis (lock)
                                        ↓
                                   Keycloak/OAuth
                                        ↓
                                   Cache token in Redis with TTL

2. Concurrent Requests:
   Request 1 → Acquires lock → Fetches token → Releases lock
   Request 2 → Waits for lock → Uses cached token
   Request 3 → Waits for lock → Uses cached token
   
   Result: Only 1 OAuth call instead of 3!

3. Session Renewal:
   Client → renewToken() → redis-lock (acquire)
                        ↓
                   Check session exists
                        ↓
                   Call backbone renew API
                        ↓
                   Update session with new token + TTL
                        ↓
                   redis-session-store → Redis
                        ↓
                   redis-lock (release)

Environment:
═══════════

Optional:
  REDIS_URL=redis://localhost:6379

If not set:
  • Uses in-memory cache
  • No distributed locks
  • No persistence
  • All other features work normally
```
