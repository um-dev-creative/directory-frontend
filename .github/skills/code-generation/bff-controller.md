# Skill: BFF Controller Generation

## Purpose

Generate Express.js BFF controllers with full security chain: URL domain validation, OAuth token acquisition, try/catch error handling, and secret protection.

## When to Use

- Creating a new BFF proxy controller for a downstream service
- Adding CRUD operations for a new resource
- Proxying requests to Directory Backend or Backbone APIs

## Controller Template — Directory Backend

```javascript
'use strict';

const { getDirectorySessionToken } = require('../proxy/oauth-client');

const schemesList = ['http:', 'https:'];
const domainsList = ['directory-backend', 'backbone-rest', 'prx-qa.backbone.tst', 'prx-qa.manager.tst', 'localhost'];

const isValidUrl = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return schemesList.includes(protocol) && domainsList.includes(hostname);
  } catch { return false; }
};

const getBaseUrl = () => {
  const map = JSON.parse(process.env.API_SERVICE_DIRECTORY_MAP || '{}');
  return `${map['directory-backend']}/directory-backend/api/v1/{resource}`;
};

const proxyApi = async (req, res) => {
  try {
    const path  = req.path.replace('/drb/api/v1/{resource}', '');
    const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
    const apiURL = `${getBaseUrl()}${path}${query}`;

    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token   = await getDirectorySessionToken();
    const options = {
      method:  req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
        'session-token': req.headers['session-token'] || ''
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(apiURL, options);
    const data     = await response.json().catch(() => null);
    return res.status(response.status).json(data ?? {});
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] Error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { proxyApi };
```

## Controller Template — Backbone

```javascript
'use strict';

const { getBearerToken } = require('../proxy/backbone-client');

const schemesList = ['http:', 'https:'];
const domainsList = ['directory-backend', 'backbone-rest', 'prx-qa.backbone.tst', 'prx-qa.manager.tst', 'localhost'];

const isValidUrl = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return schemesList.includes(protocol) && domainsList.includes(hostname);
  } catch { return false; }
};

const getBaseUrl = () => {
  const map = JSON.parse(process.env.BACKBONE_API_SERVICE_MAP || '{}');
  return `${map['backbone']}/backbone/api/v1/{resource}`;
};

const proxyApi = async (req, res) => {
  try {
    const path  = req.path.replace('/bkd/api/v1/{resource}', '');
    const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
    const apiURL = `${getBaseUrl()}${path}${query}`;

    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token   = await getBearerToken();
    const options = {
      method:  req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
        'session-token-bkd': req.headers['session-token-bkd'] || '',
        'x-application-id': process.env.APPLICATION_ID
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(apiURL, options);
    const data     = await response.json().catch(() => null);
    return res.status(response.status).json(data ?? {});
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_BKD_CTRL] Error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { proxyApi };
```

## Security Checklist for Every Controller

```
[ ] 'use strict' at top of file
[ ] isValidUrl() called before every fetch()
[ ] OAuth token from getDirectorySessionToken() or getBearerToken()
[ ] try/catch wrapping entire handler
[ ] DEBUG_MODE check before console.error
[ ] No VAULT_TOKEN / ENCRYPT_KEY / ENCRYPT_IV references
[ ] No internal URLs in response bodies
[ ] No logging of tokens or session data
[ ] app.config.js NOT modified
```

## File Placement

```
server/controller/{resource}.controller.js
```

## Validation Command

```bash
node -e "require('./server/controller/{resource}.controller')" && echo "✅ controller OK"
```

