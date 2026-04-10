# Environment Constraints

## Active Environment

| Variable | Value | Meaning |
|---|---|---|
| `DEBUG_MODE` | `true` | Verbose logging enabled in BFF and Angular |
| `ENVM` | `qa-cloud` | QA cloud environment — Vault path: `PRX/data/directory-frontend/qa-cloud` |
| `NODE_ENV` | `dev` | Local development mode — TLS bypass allowed |
| `VAULT_PATH` | `http://prx-qa.vault.tst` | Vault server endpoint |
| `VAULT_URL` | `http://prx-qa.vault.tst` | Vault server endpoint |

## Permissions by Environment

| Capability | `NODE_ENV=dev` | `NODE_ENV=production` |
|---|---|---|
| `console.log` / `console.error` in BFF | ✅ Allowed (DEBUG_MODE=true) | ❌ Use Winston logger only |
| `NODE_TLS_REJECT_UNAUTHORIZED=0` | ✅ Allowed | ❌ Forbidden |
| Self-signed SSL certificates | ✅ Allowed | ❌ Valid cert required |
| Verbose Angular logging | ✅ Allowed | ❌ `warn` / `error` only |

## Secret Variables (NEVER touch)

The following variables are injected by HashiCorp Vault at runtime via `server/config/app.config.js`.  
**Agents must NEVER reference, log, hardcode, or expose these:**

```
VAULT_TOKEN          ← Runtime only, never persisted
ENCRYPT_KEY          ← 32-char AES-256 key
ENCRYPT_IV           ← 16-char AES IV
AUTH_CLIENT_SECRET   ← Directory Backend OAuth secret
AUTH_CLIENT_ID       ← Directory Backend OAuth client ID
AUTH_USER_PASSWORD   ← Directory service account password
BACKBONE_AUTH_CLIENT_SECRET    ← Backbone OAuth secret
BACKBONE_AUTH_USER_PASSWORD    ← Backbone service account password
REDIS_PASSWORD       ← Redis credentials
```

## What Angular Code Is Allowed To Know

Angular (`src/app/`) is only allowed to know:
- BFF relative paths: `/drb/api/v1/*`, `/bkd/api/v1/*`
- Environment config: `environment.apiUrl` (empty string = same-origin)
- JWT payload fields (decoded only, no signature verification)
- Session tokens stored in `localStorage` (opaque to Angular)

## What Angular Code Must NEVER Contain

```typescript
// ❌ Forbidden in ANY Angular file:
process.env.VAULT_TOKEN
process.env.ENCRYPT_KEY
'https://directory-backend.internal/...'  // Internal service URLs
'https://backbone-rest.internal/...'      // Internal service URLs
new HttpClient(...)                        // Use HttpService only
```

## QA Cloud Testing Notes

- `ENVM=qa-cloud` means the BFF proxies to QA cloud Java backends
- TLS certificates in `ssl/` are for QA environment
- Redis may or may not be available → memory fallback is active
- Vault token is QA-specific and expires — do not reuse

