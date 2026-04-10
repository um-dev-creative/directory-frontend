# Sub-Agent: Controller Builder

**Parent Agent:** BFF Developer Agent  
**Trigger:** When a new BFF controller needs to be generated for a resource

## Purpose

Generate Express.js controller files with the full security chain: URL domain validation → OAuth token acquisition → proxy request → response forwarding.

## Controller Architecture

Every BFF controller must follow this 4-step chain:

```
1. Build downstream URL (from process.env config)
2. Validate URL domain (SSRF prevention)
3. Acquire OAuth token
4. Proxy request → return response
```

## Full CRUD Controller Template

```javascript
'use strict';

const { getDirectorySessionToken } = require('../proxy/oauth-client');

const schemesList = ['http:', 'https:'];
const domainsList = [
  'directory-backend',
  'backbone-rest',
  'prx-qa.backbone.tst',
  'prx-qa.manager.tst',
  'localhost'
];

/**
 * Build the base downstream URL for this resource
 * @returns {string}
 */
const getBaseUrl = () => {
  const configMap = JSON.parse(process.env.API_SERVICE_DIRECTORY_MAP || '{}');
  return `${configMap['directory-backend']}/directory-backend/api/v1/{resource}`;
};

/**
 * Validate that a URL is in the allowed domain list
 * @param {string} url
 * @returns {boolean}
 */
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return schemesList.includes(parsed.protocol) && domainsList.includes(parsed.hostname);
  } catch {
    return false;
  }
};

/**
 * GET all {resource}s
 */
const getAll = async (req, res) => {
  try {
    const apiURL = getBaseUrl();
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'session-token': req.headers['session-token'] || '',
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] getAll error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET {resource} by ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const apiURL = `${getBaseUrl()}/${id}`;
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'session-token': req.headers['session-token'] || '',
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] getById error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * POST create {resource}
 */
const create = async (req, res) => {
  try {
    const apiURL = getBaseUrl();
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'session-token': req.headers['session-token'] || '',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] create error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * PUT update {resource}
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const apiURL = `${getBaseUrl()}/${id}`;
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'session-token': req.headers['session-token'] || '',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] update error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * DELETE {resource}
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const apiURL = `${getBaseUrl()}/${id}`;
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'session-token': req.headers['session-token'] || '',
      }
    });

    if (response.status === 204) return res.status(204).send();
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] remove error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Generic pass-through proxy (for ALL methods)
 */
const proxyApi = async (req, res) => {
  try {
    const configMap = JSON.parse(process.env.API_SERVICE_DIRECTORY_MAP || '{}');
    const base = configMap['directory-backend'];
    const path = req.path.replace('/drb/api/v1/{resource}', '/directory-backend/api/v1/{resource}');
    const apiURL = `${base}${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });

    const token = await getDirectorySessionToken();
    const fetchOptions = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'session-token': req.headers['session-token'] || '',
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(apiURL, fetchOptions);
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data ?? {});
  } catch (error) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}_CTRL] proxyApi error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove, proxyApi };
```

## Security Checklist

- [ ] `schemesList` and `domainsList` validation before any `fetch`
- [ ] Token from `getDirectorySessionToken()` or `getBearerToken()` — never hardcoded
- [ ] No secrets in response bodies
- [ ] `DEBUG_MODE` check before `console.error`
- [ ] `'use strict'` at file top
- [ ] No `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV` referenced

