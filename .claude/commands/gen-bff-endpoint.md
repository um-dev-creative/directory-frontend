# /gen-bff-endpoint — Generate Complete BFF Endpoint

Generates a complete BFF endpoint (route + controller) in Express.js plus the corresponding Angular client service.

## Usage

```
/gen-bff-endpoint <resource> [--method GET|POST|PUT|DELETE|ALL] [--prefix drb|bkd]
```

**Examples:**
- `/gen-bff-endpoint campaigns --method GET`
- `/gen-bff-endpoint notifications --method ALL --prefix drb`
- `/gen-bff-endpoint reports --method POST`

---

## What to generate

### 1. Entry in `server/config/config.json`

Add the URL rewrite from BFF to the Java backend:

```json
{
  "/drb/api/v1/general": "/directory-backend/api/v1",
  "/drb/api/v1/<resource>": "/directory-backend/api/v1/<resource>"
}
```

> For Backbone routes use `/bkd/api/v1/<resource>` → `/backbone/api/v1/<resource>`.

---

### 2. Route file — `server/routes/<resource>.routes.js`

```javascript
'use strict';

const express = require('express');
const router = express.Router();
const <resource>Controller = require('../controller/<resource>.controller');

// GET /drb/api/v1/<resource>
router.get('/', <resource>Controller.list);

// GET /drb/api/v1/<resource>/:id
router.get('/:id', <resource>Controller.getById);

// POST /drb/api/v1/<resource>
router.post('/', <resource>Controller.create);

// PUT /drb/api/v1/<resource>/:id
router.put('/:id', <resource>Controller.update);

// DELETE /drb/api/v1/<resource>/:id
router.delete('/:id', <resource>Controller.remove);

module.exports = router;
```

> Only include the HTTP methods requested. Remove any that are not needed.

---

### 3. Controller — `server/controller/<resource>.controller.js`

```javascript
'use strict';

const { logger } = require('../config/app.config');
const { handleError } = require('../shared/error-util');
const { getUserSession } = require('../shared/redis-session-store');
const { getCommonHeaders, getApiUrl } = require('../shared/common-function');
const axios = require('axios');

// SSRF prevention — mandatory allowlist
const ALLOWED_SCHEMES = ['http:', 'https:'];
const ALLOWED_DOMAINS = [
  'directory-backend',
  'backbone-rest',
  'prx-qa.backbone.tst',
  'prx-qa.manager.tst',
  'localhost'
];

function validateApiUrl(apiURL) {
  try {
    const { protocol, hostname } = new URL(apiURL);
    return ALLOWED_SCHEMES.includes(protocol) && ALLOWED_DOMAINS.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * GET /drb/api/v1/<resource>
 * List all <resource>
 */
async function list(req, res) {
  try {
    const sessionToken = req.headers['session-token'];
    if (!sessionToken) {
      return res.status(401).json({ message: 'Session token required.' });
    }

    const apiURL = getApiUrl(req, '/directory-backend/api/v1/<resource>');

    if (!validateApiUrl(apiURL)) {
      logger.warn('[<resource>] Blocked invalid URL', { apiURL });
      return res.status(400).json({ message: 'Invalid API request.' });
    }

    const headers = getCommonHeaders(req);
    const response = await axios.get(apiURL, { headers });

    logger.info('[<resource>] List successful');
    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error('[<resource>] Error listing', { error: error.message });
    handleError(res, error);
  }
}

/**
 * GET /drb/api/v1/<resource>/:id
 */
async function getById(req, res) {
  try {
    const { id } = req.params;
    const sessionToken = req.headers['session-token'];
    if (!sessionToken) {
      return res.status(401).json({ message: 'Session token required.' });
    }

    const apiURL = getApiUrl(req, `/directory-backend/api/v1/<resource>/${id}`);

    if (!validateApiUrl(apiURL)) {
      return res.status(400).json({ message: 'Invalid API request.' });
    }

    const headers = getCommonHeaders(req);
    const response = await axios.get(apiURL, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error('[<resource>] Error getting by id', { error: error.message });
    handleError(res, error);
  }
}

/**
 * POST /drb/api/v1/<resource>
 */
async function create(req, res) {
  try {
    const sessionToken = req.headers['session-token'];
    if (!sessionToken) {
      return res.status(401).json({ message: 'Session token required.' });
    }

    const apiURL = getApiUrl(req, '/directory-backend/api/v1/<resource>');

    if (!validateApiUrl(apiURL)) {
      return res.status(400).json({ message: 'Invalid API request.' });
    }

    const headers = getCommonHeaders(req);
    const response = await axios.post(apiURL, req.body, { headers });

    logger.info('[<resource>] Created successfully');
    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error('[<resource>] Error creating', { error: error.message });
    handleError(res, error);
  }
}

/**
 * PUT /drb/api/v1/<resource>/:id
 */
async function update(req, res) {
  try {
    const { id } = req.params;
    const sessionToken = req.headers['session-token'];
    if (!sessionToken) {
      return res.status(401).json({ message: 'Session token required.' });
    }

    const apiURL = getApiUrl(req, `/directory-backend/api/v1/<resource>/${id}`);

    if (!validateApiUrl(apiURL)) {
      return res.status(400).json({ message: 'Invalid API request.' });
    }

    const headers = getCommonHeaders(req);
    const response = await axios.put(apiURL, req.body, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error('[<resource>] Error updating', { error: error.message });
    handleError(res, error);
  }
}

/**
 * DELETE /drb/api/v1/<resource>/:id
 */
async function remove(req, res) {
  try {
    const { id } = req.params;
    const sessionToken = req.headers['session-token'];
    if (!sessionToken) {
      return res.status(401).json({ message: 'Session token required.' });
    }

    const apiURL = getApiUrl(req, `/directory-backend/api/v1/<resource>/${id}`);

    if (!validateApiUrl(apiURL)) {
      return res.status(400).json({ message: 'Invalid API request.' });
    }

    const headers = getCommonHeaders(req);
    const response = await axios.delete(apiURL, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error('[<resource>] Error deleting', { error: error.message });
    handleError(res, error);
  }
}

module.exports = { list, getById, create, update, remove };
```

---

### 4. Register in `server.js`

```javascript
const <resource>Routes = require('./routes/<resource>.routes');
app.use('/drb/api/v1/<resource>', <resource>Routes);
```

---

### 5. Angular client service — `src/app/core/services/<resource>/<resource>.client.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { DFC } from '@shared/constants';

// TODO: Define the model in src/app/shared/models/<resource>.model.ts
export interface <Resource>Model {
  id: string;
  // ... model fields
}

@Injectable({ providedIn: 'root' })
export class <Resource>Client {
  private readonly http = inject(HttpService);

  // IMPORTANT: Use DFC constants — never hardcode URLs
  private readonly BASE_PATH =
    DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL + DFC.RelativePath.GENERAL_PATH + '/<resource>';

  list(): Observable<<Resource>Model[]> {
    return this.http.get<<Resource>Model[]>(this.BASE_PATH);
  }

  getById(id: string): Observable<<Resource>Model> {
    return this.http.get<<Resource>Model>(`${this.BASE_PATH}/${id}`);
  }

  create(data: Partial<<Resource>Model>): Observable<<Resource>Model> {
    return this.http.post<<Resource>Model>(this.BASE_PATH, data);
  }

  update(id: string, data: Partial<<Resource>Model>): Observable<<Resource>Model> {
    return this.http.put<<Resource>Model>(`${this.BASE_PATH}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_PATH}/${id}`);
  }
}
```

---

## Checklist before delivering

### BFF (server/)
- [ ] `'use strict';` at the top of every `.js` file
- [ ] SSRF validation (`validateApiUrl`) in every controller method
- [ ] No hardcoded credentials, secrets, or URLs
- [ ] Errors handled with `handleError` + `logger.error`
- [ ] No `console.log` with sensitive data
- [ ] Route registered in `server.js`
- [ ] URL rewrite added in `config.json`

### Angular (src/)
- [ ] URLs built with `DFC` — never hardcoded
- [ ] Uses `HttpService`, not `HttpClient` directly
- [ ] `@Injectable({ providedIn: 'root' })` present
- [ ] Dependencies injected with `inject()`
- [ ] TypeScript model defined (or pending with TODO)

### Protected files — do not touch
- `server/config/app.config.js`
- `ssl/`, `dist/`, `Dockerfile`, `docker-entrypoint.sh`
