---
mode: agent
description: Generate a new BFF Express.js route with controller and Angular-side service
tools:
  - codebase
  - editFiles
---

# Generate BFF Route

> This prompt activates the **BFF Developer Agent**.
> Full agent definition: [agent.md](../ai/agents/bff/agent.md)
> Sub-agents used:
> - [route-builder.md](../ai/agents/bff/subagents/route-builder.md)
> - [controller-builder.md](../ai/agents/bff/subagents/controller-builder.md)
> - [session-handler.md](../ai/agents/bff/subagents/session-handler.md)
>
> Skills applied:
> - [bff-patterns.md](../ai/skills/code-analysis/bff-patterns.md)
>
> Tools used:
> - [bff-route-builder.md](../ai/tools/bff-route-builder.md)
>
> Security constraints: [security-policy.md](../ai/config/security-policy.md)
> Environment constraints: [env-constraints.md](../ai/config/env-constraints.md)

---

## Instructions

Generate a complete BFF route: Express controller, route file, and the corresponding Angular service.

> ⚠️ **NEVER modify `server/config/app.config.js`** — this is a protected Vault bootstrap file.

### Required Input
1. **Resource name** (e.g. `offers`, `locations`, `notifications`)
2. **HTTP methods** needed (GET, POST, PUT, DELETE, PATCH)
3. **Downstream service** — `directory-backend` or `backbone`
4. **Angular path prefix** — e.g. `/drb/api/v1/my-resource`
5. **Downstream path** — e.g. `/directory-backend/api/v1/my-resource`

### Security Chain (every controller must follow this)

```
1. Build downstream URL from process.env config map
2. Validate URL domain (schemesList + domainsList)  ← SSRF prevention
3. Acquire OAuth token from oauth-client / backbone-client
4. Proxy request with auth headers
5. Return response — never expose internal URLs or secrets
```

### Domain Allowlist (copy exactly)

```javascript
const schemesList = ['http:', 'https:'];
const domainsList = [
  'directory-backend', 'backbone-rest',
  'prx-qa.backbone.tst', 'prx-qa.manager.tst', 'localhost'
];
```

### 4-Step Delivery

**Step 1** — `server/controller/{resource}.controller.js`  
**Step 2** — `server/routes/{resource}.routes.js`  
**Step 3** — Mount in `server.js`: `app.use('/', require('./server/routes/{resource}.routes'));`  
**Step 4** — Angular service at `src/app/core/services/{resource}/{resource}.service.ts` using `HttpService` + `DFC.RelativePath.*`

### Security Checklist

- [ ] `'use strict'` at top of every JS file
- [ ] Domain validation before every `fetch()`
- [ ] Token from `getDirectorySessionToken()` — never hardcoded
- [ ] No `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV` in code
- [ ] `try/catch` on all async handlers
- [ ] `DEBUG_MODE` check before `console.error`

### Syntax Verification

```bash
node -e "require('./server/controller/{resource}.controller')" && echo "✅ OK"
node -e "require('./server/routes/{resource}.routes')" && echo "✅ OK"
ng build --configuration development
```
