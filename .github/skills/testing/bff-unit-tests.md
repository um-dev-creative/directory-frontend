# Skill: BFF Controller Unit Tests

## Purpose

Generate unit-test patterns and validation strategies for Express.js BFF controllers in the Directory Frontend project.

## When to Use

- Validating BFF controller logic
- Testing URL domain validation behavior
- Verifying error handling and response formatting
- Ensuring security compliance in controller code

## Controller Validation Checklist

Since BFF controllers are plain JavaScript and tested via integration/manual checks, use this structural test approach:

### 1. Syntax Validation

```bash
# Verify controller loads without syntax errors
node -e "require('./server/controller/{resource}.controller')" && echo "✅ controller OK"

# Verify routes load without syntax errors
node -e "require('./server/routes/{resource}.routes')" && echo "✅ routes OK"

# Verify config.json is valid JSON
node -e "JSON.parse(require('fs').readFileSync('./server/config/config.json', 'utf8'))" && echo "✅ JSON valid"
```

### 2. Module Export Verification

```bash
# Verify the controller exports expected functions
node -e "
  const ctrl = require('./server/controller/{resource}.controller');
  const expected = ['proxyApi'];
  const missing = expected.filter(fn => typeof ctrl[fn] !== 'function');
  if (missing.length) { console.error('Missing exports:', missing); process.exit(1); }
  console.log('✅ All exports present:', Object.keys(ctrl));
"
```

### 3. URL Validation Unit Test Pattern

```javascript
// test/{resource}-controller.test.js
'use strict';

describe('{Resource} Controller', () => {
  const schemesList = ['http:', 'https:'];
  const domainsList = ['directory-backend', 'backbone-rest', 'prx-qa.backbone.tst', 'prx-qa.manager.tst', 'localhost'];

  const isValidUrl = (url) => {
    try {
      const { protocol, hostname } = new URL(url);
      return schemesList.includes(protocol) && domainsList.includes(hostname);
    } catch { return false; }
  };

  it('should accept valid directory-backend URL', () => {
    expect(isValidUrl('https://directory-backend/api/v1/resource')).toBe(true);
  });

  it('should accept valid backbone URL', () => {
    expect(isValidUrl('https://backbone-rest/api/v1/resource')).toBe(true);
  });

  it('should reject unknown domains', () => {
    expect(isValidUrl('https://evil-server.com/api/v1/resource')).toBe(false);
  });

  it('should reject invalid URL format', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  it('should reject FTP scheme', () => {
    expect(isValidUrl('ftp://directory-backend/api/v1/resource')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });
});
```

### 4. Security Scan Commands

```bash
# Verify no secrets are exposed in controller files
grep -rn "VAULT_TOKEN" server/controller/     # Should return nothing
grep -rn "ENCRYPT_KEY" server/controller/     # Should return nothing
grep -rn "ENCRYPT_IV" server/controller/      # Should return nothing

# Verify no forbidden packages
grep -rn "require('request')" server/         # Should return nothing
grep -rn "require('request-promise')" server/ # Should return nothing

# Verify 'use strict' in all controller files
for f in server/controller/*.js; do
  head -1 "$f" | grep -q "use strict" || echo "❌ Missing 'use strict' in $f"
done
echo "✅ use strict check complete"
```

### 5. Integration Test Pattern (Redis)

```javascript
// test/redis-integration.test.js — for session-related controllers
'use strict';

const { describe, it, expect } = require('@jest/globals');

describe('Redis Session Integration', () => {
  it('should store and retrieve session data', async () => {
    // Test Redis session store behavior
  });

  it('should fall back to in-memory when Redis is unavailable', async () => {
    // Test fallback behavior
  });
});
```

## File Placement

```
test/{resource}-controller.test.js    ← integration tests
server/controller/{resource}.controller.js  ← source
```

## Full Validation Script

```bash
#!/bin/bash
echo "=== BFF Validation ==="

# Syntax checks
for f in server/controller/*.js; do
  node -e "require('./$f')" 2>/dev/null && echo "✅ $f" || echo "❌ $f"
done

for f in server/routes/*.js; do
  node -e "require('./$f')" 2>/dev/null && echo "✅ $f" || echo "❌ $f"
done

# Security checks
echo "--- Security ---"
grep -rn "VAULT_TOKEN\|ENCRYPT_KEY\|ENCRYPT_IV" server/controller/ && echo "🔒 SECRETS FOUND" || echo "✅ No secrets"
grep -rn "require('request')" server/ && echo "🔒 FORBIDDEN PACKAGE" || echo "✅ No forbidden packages"

echo "=== Done ==="
```

