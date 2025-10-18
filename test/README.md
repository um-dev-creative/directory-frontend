# Redis Integration Test

This directory contains integration tests for the Redis-based token and session management implementation.

## Test File

**redis-integration.test.js** - Automated integration test for Redis functionality

## Running the Test

### Prerequisites

1. Redis server must be running
2. Node.js installed (v18+)
3. Dependencies installed (`npm install`)

### Quick Start

```bash
# Start Redis (if not already running)
docker run -d -p 6379:6379 redis:7-alpine

# Run the test
node test/redis-integration.test.js
```

### Expected Output

```
=== Redis Integration Test ===

Test 1: Redis Connection
Connecting to: redis://localhost:6379
✓ Redis connection successful

Test 2: Set and Get with TTL
✓ Set/Get with TTL working correctly
  TTL: 30 seconds

Test 3: Distributed Lock (SET NX PX)
✓ Distributed lock working correctly

Test 4: Session Storage
✓ Session storage working correctly
  TTL: 3600 seconds

Test 5: Cleanup
✓ Cleanup successful

=== Test Summary ===
Total tests: 5
Passed: 5
Failed: 0

✓ All tests passed!
```

## Test Coverage

The integration test validates:

1. **Redis Connection**
   - Connects to Redis server
   - Validates PING response
   - Handles connection failures gracefully

2. **Set/Get with TTL**
   - Stores data with expiration time
   - Retrieves stored data correctly
   - TTL management works properly

3. **Distributed Locks**
   - Acquires lock using SET NX PX
   - Prevents duplicate lock acquisition
   - Releases lock safely with Lua script

4. **Session Storage**
   - Stores session data with TTL
   - Retrieves session correctly
   - TTL calculated from expiration time

5. **Cleanup**
   - Removes test data
   - Validates cleanup completed

## Configuration

The test uses the following environment variable:

```bash
REDIS_URL=redis://localhost:6379  # Default if not set
```

To use a different Redis server:

```bash
export REDIS_URL=redis://your-redis-host:6379
node test/redis-integration.test.js
```

## Troubleshooting

### Test Fails: Connection Error

**Problem:** Cannot connect to Redis

**Solutions:**
1. Check if Redis is running: `redis-cli PING`
2. Verify Redis URL is correct
3. Check network connectivity
4. Start Redis: `docker run -d -p 6379:6379 redis:7-alpine`

### Test Fails: Lock or Session Tests

**Problem:** Redis operations failing

**Solutions:**
1. Check Redis logs: `redis-cli CLIENT LIST`
2. Verify Redis version (v4+ required)
3. Clear Redis data: `redis-cli FLUSHDB`
4. Restart Redis

### Test Hangs

**Problem:** Test doesn't complete

**Solutions:**
1. Check Redis connection
2. Force kill: `Ctrl+C`
3. Clear Redis: `redis-cli FLUSHDB`
4. Restart test

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed

## Related Documentation

- **../TESTING_REDIS.md** - Comprehensive testing guide with 6 scenarios
- **../QUICK_REFERENCE.md** - Quick commands and troubleshooting
- **../REDIS_IMPLEMENTATION.md** - Full implementation details

## Adding More Tests

To add additional test scenarios:

1. Add a new test block in `redis-integration.test.js`
2. Follow the existing pattern (try/catch with testsPassed/testsFailed)
3. Clean up test data in the cleanup phase
4. Update this README with the new test description

Example:

```javascript
try {
  // Test 6: New Feature
  console.log('Test 6: New Feature');
  // Your test code here
  testsPassed++;
} catch (error) {
  console.log(`✗ New feature test failed: ${error.message}\n`);
  testsFailed++;
}
```

## Continuous Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions
- name: Start Redis
  run: docker run -d -p 6379:6379 redis:7-alpine

- name: Run Integration Tests
  run: node test/redis-integration.test.js
  env:
    REDIS_URL: redis://localhost:6379
```

## Manual Testing

For manual/exploratory testing, see:
- **../TESTING_REDIS.md** - 6 detailed manual test scenarios

## Support

For issues or questions:
1. Check this README
2. Review test output for specific errors
3. Check ../TESTING_REDIS.md for troubleshooting
4. Verify Redis is running and accessible
