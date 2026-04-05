---
name: BFF — Route Builder
description: Sub-agent that generates Express route files and config.json URL rewrite entries.
tools:
  - codebase
  - editFiles
---

You are the **Route Builder** sub-agent. Generate the route file and config.json entry for a new BFF endpoint.

## Step 1 — `server/config/config.json` entry

```json
{
  "directoryBackendProxyConfig": [
    {
      "applicationName": "directory-backend",
      "matchOn": { "startWith": "/drb/api/v1/{resource}" },
      "urlRewrite": {
        "from": "/drb/api/v1/{resource}",
        "to":   "/directory-backend/api/v1/{resource}"
      }
    }
  ]
}
```

## Step 2 — Route file (`server/routes/{resource}.routes.js`)

### Catch-all (recommended for most cases)
```javascript
'use strict';

const express  = require('express');
const router   = express.Router();
const { proxyApi } = require('../controller/{resource}.controller');

router.all('/drb/api/v1/{resource}*', proxyApi);

module.exports = router;
```

### Explicit CRUD routes
```javascript
'use strict';

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controller/{resource}.controller');

router.get   ('/drb/api/v1/{resource}',     ctrl.getAll);
router.get   ('/drb/api/v1/{resource}/:id', ctrl.getById);
router.post  ('/drb/api/v1/{resource}',     ctrl.create);
router.put   ('/drb/api/v1/{resource}/:id', ctrl.update);
router.delete('/drb/api/v1/{resource}/:id', ctrl.remove);

module.exports = router;
```

### Backbone route
```javascript
'use strict';

const express  = require('express');
const router   = express.Router();
const { proxyBackbone } = require('../controller/{resource}.controller');

router.all('/bkd/api/v1/{resource}*', proxyBackbone);

module.exports = router;
```

## Step 3 — Mount in `server.js`

```javascript
// Add before backbone routes if targeting Directory Backend:
app.use('/', require('./server/routes/{resource}.routes'));
```

## Mount Order (important)

```
1. Angular SSR
2. directory-backend-auth.routes
3. directory-backend-std.routes
4. multimedia.routes
5. NEW directory-backend resource routes  ← insert here
6. backbone.routes
```

## Middleware Already Applied (do NOT re-add)

`express-rate-limit` · `compression` · `cors` · `express.json({ limit: '5mb' })`

