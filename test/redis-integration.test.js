// test/redis-integration.test.js
// Basic integration test for Redis functionality
// Run with: node test/redis-integration.test.js

const { createClient } = require('redis');

async function testRedisIntegration() {
  console.log('=== Redis Integration Test ===\n');
  
  let redisClient = null;
  let testsPassed = 0;
  let testsFailed = 0;
  
  try {
    // Test 1: Redis Connection
    console.log('Test 1: Redis Connection');
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    console.log(`Connecting to: ${redisUrl}`);
    
    redisClient = createClient({ url: redisUrl });
    await redisClient.connect();
    
    const pingResult = await redisClient.ping();
    if (pingResult === 'PONG') {
      console.log('✓ Redis connection successful\n');
      testsPassed++;
    } else {
      throw new Error('Redis ping failed');
    }
  } catch (error) {
    console.log(`✗ Redis connection failed: ${error.message}`);
    console.log('Skipping Redis tests (fallback to memory will be used)\n');
    testsFailed++;
    return;
  }
  
  try {
    // Test 2: Set and Get with TTL
    console.log('Test 2: Set and Get with TTL');
    const testKey = 'test:token:123';
    const testValue = JSON.stringify({
      access_token: 'test_token_value',
      cached_at: Date.now(),
      expires_in: 3600
    });
    
    await redisClient.setEx(testKey, 30, testValue);
    const retrieved = await redisClient.get(testKey);
    const ttl = await redisClient.ttl(testKey);
    
    if (retrieved === testValue && ttl > 0 && ttl <= 30) {
      console.log('✓ Set/Get with TTL working correctly');
      console.log(`  TTL: ${ttl} seconds\n`);
      testsPassed++;
    } else {
      throw new Error('Set/Get with TTL failed');
    }
  } catch (error) {
    console.log(`✗ Set/Get with TTL failed: ${error.message}\n`);
    testsFailed++;
  }
  
  try {
    // Test 3: Distributed Lock (SET NX PX)
    console.log('Test 3: Distributed Lock (SET NX PX)');
    const lockKey = 'lock:test:resource';
    const lockValue = 'lock_token_123';
    
    // Acquire lock
    const lockResult = await redisClient.set(lockKey, lockValue, {
      NX: true,
      PX: 5000
    });
    
    if (lockResult !== 'OK') {
      throw new Error('Lock acquisition failed');
    }
    
    // Try to acquire again (should fail)
    const lockResult2 = await redisClient.set(lockKey, 'another_token', {
      NX: true,
      PX: 5000
    });
    
    if (lockResult2 !== null) {
      throw new Error('Lock should not be acquired twice');
    }
    
    // Release lock with Lua script
    const releaseScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    
    const released = await redisClient.eval(releaseScript, {
      keys: [lockKey],
      arguments: [lockValue]
    });
    
    if (released === 1) {
      console.log('✓ Distributed lock working correctly\n');
      testsPassed++;
    } else {
      throw new Error('Lock release failed');
    }
  } catch (error) {
    console.log(`✗ Distributed lock failed: ${error.message}\n`);
    testsFailed++;
  }
  
  try {
    // Test 4: Session Storage
    console.log('Test 4: Session Storage');
    const sessionKey = 'session:test_user_123';
    const sessionData = JSON.stringify({
      backboneSession: 'session_token_xyz',
      backboneBearerToken: 'bearer_token_abc',
      backboneSessionExpiresAt: Date.now() + 3600000,
      directorySessionExpiresAt: Date.now() + 3600000
    });
    
    await redisClient.setEx(sessionKey, 3600, sessionData);
    const retrievedSession = await redisClient.get(sessionKey);
    const sessionTTL = await redisClient.ttl(sessionKey);
    
    if (retrievedSession === sessionData && sessionTTL > 0) {
      console.log('✓ Session storage working correctly');
      console.log(`  TTL: ${sessionTTL} seconds\n`);
      testsPassed++;
    } else {
      throw new Error('Session storage failed');
    }
  } catch (error) {
    console.log(`✗ Session storage failed: ${error.message}\n`);
    testsFailed++;
  }
  
  try {
    // Test 5: Cleanup
    console.log('Test 5: Cleanup');
    await redisClient.del('test:token:123');
    await redisClient.del('lock:test:resource');
    await redisClient.del('session:test_user_123');
    
    const keys = await redisClient.keys('test:*');
    if (keys.length === 0) {
      console.log('✓ Cleanup successful\n');
      testsPassed++;
    } else {
      throw new Error('Cleanup failed');
    }
  } catch (error) {
    console.log(`✗ Cleanup failed: ${error.message}\n`);
    testsFailed++;
  }
  
  // Close connection
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
  
  // Summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${testsPassed + testsFailed}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed');
    process.exit(1);
  }
}

// Run tests
testRedisIntegration().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
