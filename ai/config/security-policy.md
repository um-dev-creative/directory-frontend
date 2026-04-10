# Security Policy

## Overview

All agents operating on the Directory Frontend project must adhere to this security policy. Violations are blockers — no generated code that breaks these rules may be committed.

## Tier 1 — Critical (Zero Tolerance)

The following are **absolute hard blocks**. Any generated code violating these rules must be rejected immediately:

| Rule | Details |
|---|---|
| **No secret exposure** | `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV`, `AUTH_CLIENT_SECRET`, `BACKBONE_AUTH_CLIENT_SECRET` must NEVER appear in any generated code, response, or log |
| **No direct backend calls from Angular** | Angular code MUST NOT call Java services; all HTTP goes through BFF (`/drb/*` or `/bkd/*`) |
| **No protected file modification** | `ssl/`, `dist/`, `Dockerfile`, `docker-entrypoint.sh`, `server/config/app.config.js` are immutable |
| **No SSRF** | Every BFF controller must validate upstream URL against `schemesList` + `domainsList` before fetching |
| **No password logging** | Passwords must NEVER appear in logs, responses, or state |

## Tier 2 — High (Must Fix Before Merge)

| Rule | Details |
|---|---|
| **npm audit** | `npm audit --audit-level=high` must pass. Zero `high` or `critical` CVEs |
| **No `request` package** | The `request` package is PROHIBITED — use native `fetch` or `axios` |
| **SSR guards** | `window`/`localStorage`/`document` must be guarded with `isPlatformBrowser()` |
| **HTTPS only** | BFF starts with `https.createServer()`. Plain HTTP binding is forbidden |
| **Rate limit** | Do not bypass or remove `express-rate-limit` configuration |

## Tier 3 — Medium (Should Fix)

| Rule | Details |
|---|---|
| **Token logging** | OAuth access tokens should not appear in logs even with DEBUG_MODE=true |
| **Internal URL exposure** | `API_SERVICE_DIRECTORY_MAP` values (internal hostnames) must not appear in HTTP responses |
| **Session data in responses** | `backboneSession`, `directorySession` fields must not be returned to Angular clients |

## Dependency Security Policy

```
Before any PR touching package.json or pnpm-lock.yaml:
  1. pnpm install
  2. npm audit --audit-level=high
  3. Fix all high/critical before merge

Accepted risks (see CLAUDE.md):
  - request + transitives (via node-vault-client in app.config.js)
  - Documented in CLAUDE.md with expiry 2026-03-31

Forbidden packages:
  - request
  - request-promise
  - Any package > 12 months without release (unless justified)
```

## JWT Policy

| Layer | Operation | Allowed |
|---|---|---|
| Angular | `jwt.decode()` (base64 split) | ✅ Yes |
| Angular | `jwt.verify()` | ❌ No — no public key in browser |
| BFF | `jwt.decode()` | ✅ Yes |
| BFF | `jwt.verify()` | ❌ No — trust Java backends |
| Java backends | Full signature verification | ✅ Required |

## AES Encryption Policy

```
ENCRYPT_KEY and ENCRYPT_IV are used ONLY in:
  - server/controller/directory-backend-auth.controller.js  (login)
  - server/controller/directory-backend-create-user.controller.js  (register)
  - server/controller/directory-backend-register.controller.js  (verify-code)

Never add AES encryption to new controllers without explicit security review.
AES keys must never appear outside the BFF layer.
```

## Incident Response

If a secret is accidentally included in generated code:
1. Immediately remove from all files
2. Rotate the secret in HashiCorp Vault
3. Invalidate any active sessions that used the compromised secret
4. Document the incident

