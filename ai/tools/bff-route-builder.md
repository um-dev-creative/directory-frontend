# Tool: BFF Route Builder

## Purpose

Reference for adding new BFF Express routes, including config.json entries, server.js mounting, and syntax verification.

## Syntax Check (verify JS files)

```bash
# Check a controller file
node -e "require('./server/controller/{resource}.controller')" && echo "✅ OK"

# Check a routes file
node -e "require('./server/routes/{resource}.routes')" && echo "✅ OK"

# Check config.json is valid JSON
node -e "JSON.parse(require('fs').readFileSync('./server/config/config.json', 'utf8'))" && echo "✅ JSON valid"
```

## Server.js Mount Order

Routes must be mounted in this order in `server.js`:

```javascript
// 1. Static + SSR (Angular)
app.use('/', angularApp);

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

## Config.json Structure

```json
{
  "directoryBackendProxyConfig": [
    {
      "applicationName": "directory-backend",
      "matchOn": { "startWith": "/drb/api/v1/general" },
      "urlRewrite": {
        "from": "/drb/api/v1/general",
        "to": "/directory-backend/api/v1"
      }
    }
  ],
  "backboneProxyConfig": [
    {
      "applicationName": "backbone",
      "matchOn": { "startWith": "/bkd/api/v1" },
      "urlRewrite": {
        "from": "/bkd/api/v1",
        "to": "/backbone/api/v1"
      }
    }
  ]
}
```

## Environment Variables Reference (BFF)

```javascript
// Service URL maps (from Vault → process.env)
const dirMap = JSON.parse(process.env.API_SERVICE_DIRECTORY_MAP || '{}');
const baseUrl = dirMap['directory-backend'];  // https://directory-backend.svc/

const bkdMap = JSON.parse(process.env.BACKBONE_API_SERVICE_MAP || '{}');
const bkdBase = bkdMap['backbone'];           // https://backbone-rest.svc/

// Application ID (for Backbone requests)
const appId = process.env.APPLICATION_ID;

// Debug flag
const isDebug = process.env.DEBUG_MODE === 'true';
```

## Required Headers for Downstream Calls

### Directory Backend calls:
```javascript
{
  'Authorization': `Bearer ${directoryBearerToken}`,
  'Content-Type': 'application/json',
  'session-token': req.headers['session-token'] || ''
}
```

### Backbone calls:
```javascript
{
  'Authorization': `Bearer ${backboneBearerToken}`,
  'Content-Type': 'application/json',
  'session-token-bkd': req.headers['session-token-bkd'] || '',
  'x-application-id': process.env.APPLICATION_ID
}
```

