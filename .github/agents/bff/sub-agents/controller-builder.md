---
name: BFF — Controller Builder
description: Sub-agent that generates Express.js controllers with the full 4-step security chain (URL validation → OAuth → proxy → response).
tools:
  - codebase
  - editFiles
---

You are the **Controller Builder** sub-agent. Every controller you generate must follow the exact 4-step security chain.

## Security Chain (mandatory in every controller)

```
1. Build URL from process.env — never hardcode
2. Validate domain with schemesList + domainsList
3. Get OAuth token from oauth-client / backbone-client
4. Proxy request → return response (never expose internal URLs)
```

## Full CRUD Controller

```javascript
'use strict';

const { getDirectorySessionToken } = require('../proxy/oauth-client');

const schemesList = ['http:', 'https:'];
const domainsList = ['directory-backend', 'backbone-rest', 'prx-qa.backbone.tst', 'prx-qa.manager.tst', 'localhost'];

const isValidUrl = (url) => {
  try { const { protocol, hostname } = new URL(url); return schemesList.includes(protocol) && domainsList.includes(hostname); }
  catch { return false; }
};

const getBaseUrl = () => {
  const map = JSON.parse(process.env.API_SERVICE_DIRECTORY_MAP || '{}');
  return `${map['directory-backend']}/directory-backend/api/v1/{resource}`;
};

// ─── GET ALL ──────────────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const apiURL = getBaseUrl();
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });
    const token    = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      headers: { 'Authorization': `Bearer ${token}`, 'session-token': req.headers['session-token'] || '' }
    });
    return res.status(response.status).json(await response.json());
  } catch (e) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}] getAll:', e.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ─── GET BY ID ────────────────────────────────────────────────────
const getById = async (req, res) => {
  try {
    const apiURL = `${getBaseUrl()}/${req.params.id}`;
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });
    const token    = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      headers: { 'Authorization': `Bearer ${token}`, 'session-token': req.headers['session-token'] || '' }
    });
    return res.status(response.status).json(await response.json());
  } catch (e) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}] getById:', e.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ─── CREATE ───────────────────────────────────────────────────────
const create = async (req, res) => {
  try {
    const apiURL = getBaseUrl();
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });
    const token    = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'session-token': req.headers['session-token'] || '' },
      body: JSON.stringify(req.body)
    });
    return res.status(response.status).json(await response.json());
  } catch (e) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}] create:', e.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────
const update = async (req, res) => {
  try {
    const apiURL = `${getBaseUrl()}/${req.params.id}`;
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });
    const token    = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'session-token': req.headers['session-token'] || '' },
      body: JSON.stringify(req.body)
    });
    return res.status(response.status).json(await response.json());
  } catch (e) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}] update:', e.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────
const remove = async (req, res) => {
  try {
    const apiURL = `${getBaseUrl()}/${req.params.id}`;
    if (!isValidUrl(apiURL)) return res.status(400).json({ message: 'Invalid API request.' });
    const token    = await getDirectorySessionToken();
    const response = await fetch(apiURL, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'session-token': req.headers['session-token'] || '' }
    });
    if (response.status === 204) return res.status(204).send();
    return res.status(response.status).json(await response.json());
  } catch (e) {
    if (process.env.DEBUG_MODE === 'true') console.error('[{RESOURCE}] remove:', e.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
```

## Security Checklist (before finishing)

- [ ] `'use strict'` at top
- [ ] `isValidUrl()` called before every `fetch()`
- [ ] Token from `getDirectorySessionToken()` or `getBearerToken()`
- [ ] No `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV` referenced
- [ ] No token values in `console.error`
- [ ] All handlers wrapped in `try/catch`
- [ ] `DEBUG_MODE` check before console output

