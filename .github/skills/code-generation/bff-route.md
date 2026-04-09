# Skill: BFF Route Generation

## Purpose

Generate Express.js route files for the BFF layer, including route registration in `server.js` and config.json updates.

## When to Use

- Adding a new BFF endpoint for Angular to consume
- Creating route files that wire controllers to URL paths
- Updating route configuration for new resources

## Route File Template

```javascript
'use strict';

const express  = require('express');
const router   = express.Router();
const { proxyApi } = require('../controller/{resource}.controller');

router.all('/drb/api/v1/{resource}*', proxyApi);

module.exports = router;
```

## Route Registration in server.js

Mount new routes in the correct order:

```javascript
// Mount order in server.js:
// 1. Static + SSR (Angular)
// 2. Specific auth routes first
app.use('/', require('./server/routes/directory-backend-auth.routes'));
// 3. General directory routes
app.use('/', require('./server/routes/directory-backend-std.routes'));
// 4. Multimedia
app.use('/', require('./server/routes/multimedia.routes'));
// 5. Backbone
app.use('/', require('./server/routes/backbone.routes'));
// 6. NEW ROUTES — add before backbone if Directory Backend, or last if Backbone
app.use('/', require('./server/routes/{resource}.routes'));
```

## Route Prefixes

| Angular calls | Route file | Downstream service |
|---|---|---|
| `/drb/api/v1/auth/*` | `directory-backend-auth.routes.js` | Directory Backend `/auth/*` |
| `/drb/api/v1/general/*` | `directory-backend-std.routes.js` | Directory Backend `/*` |
| `/drb/api/v1/d-image/*` | `multimedia.routes.js` | `/profile/image` |
| `/bkd/api/v1/*` | `backbone.routes.js` | Backbone API |
| `/drb/api/v1/{resource}/*` | `{resource}.routes.js` | Directory Backend `/{resource}/*` |

## Config.json Update

When adding a new proxy config, update `server/config/config.json`:

```json
{
  "directoryBackendProxyConfig": [
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

## 4-Step Delivery Checklist

For every new BFF endpoint, deliver all 4 artifacts:

```
Step 1: server/controller/{resource}.controller.js   ← controller with full security chain
Step 2: server/routes/{resource}.routes.js            ← Express router
Step 3: Mount in server.js                            ← app.use('/', require(...))
Step 4: Angular service: src/app/core/services/ or src/app/features/{feature}/
```

## Validation Commands

```bash
# Verify controller loads
node -e "require('./server/controller/{resource}.controller')" && echo "✅ controller OK"

# Verify routes load
node -e "require('./server/routes/{resource}.routes')" && echo "✅ routes OK"

# Verify config.json is valid JSON
node -e "JSON.parse(require('fs').readFileSync('./server/config/config.json', 'utf8'))" && echo "✅ JSON valid"

# Full Angular build
ng build --configuration development && echo "✅ Angular OK"
```

## File Placement

```
server/routes/{resource}.routes.js
```

