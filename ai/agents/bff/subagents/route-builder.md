# Sub-Agent: Route Builder

**Parent Agent:** BFF Developer Agent  
**Trigger:** When a new Express.js route file needs to be generated for a BFF endpoint

## Purpose

Generate Express route files and their corresponding `config.json` URL rewrite entries for new BFF endpoints.

## Step 1 — URL Rewrite Entry (`server/config/config.json`)

Add the new resource to the appropriate section:

```json
{
  "directoryBackendProxyConfig": [
    ...existing entries...,
    {
      "applicationName": "directory-backend",
      "matchOn": { "startWith": "/drb/api/v1/{resource}" },
      "urlRewrite": {
        "from": "/drb/api/v1/{resource}",
        "to": "/directory-backend/api/v1/{resource}"
      }
    }
  ]
}
```

## Step 2 — Route File (`server/routes/{resource}.routes.js`)

### Standard Resource Route (Directory Backend)

```javascript
'use strict';

const express = require('express');
const router = express.Router();
const {resource}Controller = require('../controller/{resource}.controller');

/**
 * {Resource} routes — proxies to Directory Backend
 * Angular path prefix: /drb/api/v1/{resource}
 * Downstream:          /directory-backend/api/v1/{resource}
 */
router.get('/drb/api/v1/{resource}', {resource}Controller.getAll);
router.get('/drb/api/v1/{resource}/:id', {resource}Controller.getById);
router.post('/drb/api/v1/{resource}', {resource}Controller.create);
router.put('/drb/api/v1/{resource}/:id', {resource}Controller.update);
router.delete('/drb/api/v1/{resource}/:id', {resource}Controller.remove);

module.exports = router;
```

### Catch-All Route (for pass-through APIs)

```javascript
'use strict';

const express = require('express');
const router = express.Router();
const { proxyApi } = require('../controller/{resource}.controller');

router.all('/drb/api/v1/{resource}*', proxyApi);

module.exports = router;
```

### Backbone Resource Route

```javascript
'use strict';

const express = require('express');
const router = express.Router();
const { proxyBackbone } = require('../controller/{resource}.controller');

router.all('/bkd/api/v1/{resource}*', proxyBackbone);

module.exports = router;
```

## Step 3 — Mount in `server.js`

Append in the route registration section:

```javascript
// {Resource} routes
app.use('/', require('./server/routes/{resource}.routes'));
```

> ⚠️ Mount order matters. More specific routes should be mounted before generic catch-alls.

## Route Naming Conventions

| Pattern | Use Case |
|---|---|
| `/drb/api/v1/{resource}` | Standard CRUD on Directory Backend |
| `/drb/api/v1/auth/{resource}` | Auth-specific Directory Backend routes |
| `/drb/api/v1/d-image/{resource}` | File upload routes |
| `/bkd/api/v1/{resource}` | Backbone API proxy routes |

## Middleware Applied Automatically

The following middleware runs on ALL routes (registered in `server.js` before route mounting):

| Middleware | Effect |
|---|---|
| `express-rate-limit` | 10,000 req / 15 min per IP |
| `express-http-context` | Request tracking ID |
| `compression` | Gzip response compression |
| `cors` | CORS headers |
| `express.json({ limit: '5mb' })` | JSON body parsing |

Do NOT add these again inside individual route files.

