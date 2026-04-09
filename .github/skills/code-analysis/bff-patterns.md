# Skill: BFF Code Analysis

## Purpose

Analyze Express.js BFF code in the Directory Frontend project for security vulnerabilities, URL validation, token handling, and architectural compliance.

## When to Use

- Reviewing BFF controllers and routes
- Validating new endpoint implementations
- Auditing existing BFF code for security gaps

## Analysis Dimensions

### 1. URL Domain Validation (SSRF Prevention)

Every controller that builds an upstream URL **MUST** validate it before proxying:

```javascript
// ❌ Flag — missing URL validation:
const apiURL = `${process.env.API_URL}/api/v1/resource`;
const response = await fetch(apiURL, { ... });  // No validation!

// ✅ Correct — full domain validation:
const schemesList = ['http:', 'https:'];
const domainsList = [
  'directory-backend',
  'backbone-rest',
  'prx-qa.backbone.tst',
  'prx-qa.manager.tst',
  'localhost'
];

const isValidUrl = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return schemesList.includes(protocol) && domainsList.includes(hostname);
  } catch { return false; }
};

if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });
const response = await fetch(apiURL, options);
```

### 2. OAuth Token Acquisition

```javascript
// ❌ Flag — hardcoded token:
const token = 'Bearer eyJhbGci...';

// ❌ Flag — using Vault token as auth:
const token = process.env.VAULT_TOKEN;

// ❌ Flag — using wrong token source for route type:
// Directory Backend route using Backbone token (or vice versa)

// ✅ Correct — Directory Backend routes:
const { getDirectorySessionToken } = require('../proxy/oauth-client');
const token = await getDirectorySessionToken();

// ✅ Correct — Backbone routes:
const { getBearerToken } = require('../proxy/backbone-client');
const token = await getBearerToken();
```

### 3. Secret Exposure Check

```javascript
// 🔒 Flag ANY of these referenced in controller code or logged:
process.env.VAULT_TOKEN
process.env.ENCRYPT_KEY
process.env.ENCRYPT_IV
process.env.BACKBONE_AUTH_CLIENT_SECRET
process.env.AUTH_CLIENT_SECRET

// 🔒 Flag logging of tokens or sessions:
console.log('Token:', bearerToken);
console.log('Session:', JSON.stringify(session));
console.log('Headers:', JSON.stringify(req.headers));
```

### 4. Protected File Check

```
🔒 BLOCKED — Never modify:
  server/config/app.config.js  ← Vault bootstrap
  ssl/backbone.key
  ssl/backbone.crt
  ssl/prx-qa.key
  ssl/prx-qa.crt
  Dockerfile
  docker-entrypoint.sh
```

### 5. Use Strict Enforcement

```javascript
// ❌ Flag — missing 'use strict':
const express = require('express');

// ✅ Correct:
'use strict';
const express = require('express');
```

### 6. Error Handling

```javascript
// ❌ Flag — no try/catch:
const proxyApi = async (req, res) => {
  const response = await fetch(apiURL);  // Unhandled rejection!
  res.json(await response.json());
};

// ❌ Flag — catch without proper response:
catch (error) {
  console.log(error);  // Missing res.status() response
}

// ✅ Correct:
const proxyApi = async (req, res) => {
  try {
    const response = await fetch(apiURL, options);
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data ?? {});
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[CTRL] Error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
```

### 7. Forbidden Package Detection

```javascript
// 🔒 Flag — forbidden packages:
const request = require('request');          // PROHIBITED — abandoned
const request = require('request-promise');  // PROHIBITED — depends on request

// ✅ Correct:
const response = await fetch(url, options);  // Native fetch (Node.js 18+)
```

### 8. Response Safety

```javascript
// ❌ Flag — leaking internal URLs:
return res.json({ url: apiURL, data: response });

// ❌ Flag — forwarding raw error objects:
return res.status(500).json({ error: error });

// ✅ Correct — sanitized response:
return res.status(response.status).json(data ?? {});
return res.status(500).json({ message: 'Internal server error.' });
```

## Output Format

```
BFF ANALYSIS for {file}

✅ PASS: 'use strict' present
✅ PASS: URL domain validation before fetch
✅ PASS: OAuth from oauth-client.js
✅ PASS: try/catch on all async handlers
⚠️ WARNING: Missing DEBUG_MODE check before console.error on line 34
❌ VIOLATION: No try/catch block in proxyApi handler
❌ VIOLATION: Missing isValidUrl() call before fetch on line 56
🔒 SECURITY: process.env.VAULT_TOKEN referenced on line 12 — BLOCKED
🔒 SECURITY: Bearer token logged on line 56 — remove immediately
🔒 SECURITY: Internal URL exposed in response on line 78
```

