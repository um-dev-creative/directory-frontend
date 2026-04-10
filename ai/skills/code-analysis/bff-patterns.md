# Skill: BFF Code Analysis

## Purpose

Analyze Express.js BFF code in the Directory Frontend project for security vulnerabilities, URL validation, token handling, and architectural compliance.

## Analysis Dimensions

### 1. URL Domain Validation (SSRF Prevention)

Every controller that builds an upstream URL MUST validate it:

```javascript
// ❌ Flag — missing URL validation:
const apiURL = `${process.env.API_URL}/api/v1/resource`;
const response = await fetch(apiURL, { ... });  // No validation!

// ✅ Correct:
const parsed = new URL(apiURL);
if (!schemesList.includes(parsed.protocol) || !domainsList.includes(parsed.hostname)) {
  return res.status(400).json({ message: 'Invalid API request.' });
}
const response = await fetch(apiURL, { ... });
```

### 2. OAuth Token Acquisition

```javascript
// ❌ Flag — hardcoded token:
const token = 'Bearer eyJhbGci...';

// ❌ Flag — wrong token source:
const token = process.env.VAULT_TOKEN;  // NEVER use Vault token as auth

// ✅ Correct:
const token = await getDirectorySessionToken();  // oauth-client.js
// or
const token = await getBearerToken();            // backbone-client.js
```

### 3. Secret Exposure Check

```javascript
// 🔒 Flag any of these in controller code:
process.env.VAULT_TOKEN
process.env.ENCRYPT_KEY
process.env.ENCRYPT_IV
process.env.BACKBONE_AUTH_CLIENT_SECRET
process.env.AUTH_CLIENT_SECRET

// 🔒 Flag logging of tokens:
console.log('Token:', bearerToken);
console.log('Session:', JSON.stringify(session));
```

### 4. Protected File Check

```
🔒 BLOCKED — Never modify:
  server/config/app.config.js
  ssl/backbone.key
  ssl/backbone.crt
  Dockerfile
  docker-entrypoint.sh
```

### 5. Use Strict

```javascript
// ❌ Flag — missing 'use strict':
const express = require('express');  // No 'use strict'!

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

// ✅ Correct:
const proxyApi = async (req, res) => {
  try {
    const response = await fetch(apiURL);
    return res.status(response.status).json(data);
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[CTRL] Error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
```

### 7. Forbidden Package

```javascript
// 🔒 Flag — forbidden package:
const request = require('request');        // PROHIBITED
const request = require('request-promise'); // PROHIBITED

// ✅ Correct:
const response = await fetch(url, options);  // Native fetch
```

## Output Format

```
BFF ANALYSIS for {file}

✅ PASS: 'use strict' present
✅ PASS: URL domain validation before fetch
⚠️ WARNING: Missing DEBUG_MODE check before console.error on line 34
❌ VIOLATION: No try/catch block in proxyApi handler
🔒 SECURITY: process.env.VAULT_TOKEN referenced on line 12 — BLOCKED
🔒 SECURITY: Bearer token logged on line 56 — remove immediately
```

