---
mode: agent
description: Review Angular, NgRx, or BFF code for project convention compliance
tools:
  - codebase
---

# Code Review Agent

> This prompt activates the **Code Review** skill set.
> Skills applied:
> - [angular-patterns.md](../ai/skills/code-analysis/angular-patterns.md)
> - [ngrx-patterns.md](../ai/skills/code-analysis/ngrx-patterns.md)
> - [bff-patterns.md](../ai/skills/code-analysis/bff-patterns.md)
>
> Tools used:
> - [code-reviewer.md](../ai/tools/code-reviewer.md)
>
> Security constraints: [security-policy.md](../ai/config/security-policy.md)
> Environment constraints: [env-constraints.md](../ai/config/env-constraints.md)

---

## Review Checklist

### Angular Components
- [ ] `standalone: true` present
- [ ] `inject()` used (no constructor injection)
- [ ] `@if` / `@for` / `@let` used (no `*ngIf` / `*ngFor`)
- [ ] All imports listed in `imports: []`
- [ ] `| translate` for user-visible strings (or `// TODO: i18n`)
- [ ] `isPlatformBrowser()` guards around browser APIs
- [ ] `// SSR: browser-only` comments on SSR-incompatible code
- [ ] Path aliases used (`@core/*`, `@shared/*`, `@app/*`) — no deep relative paths
- [ ] No hardcoded URLs — uses `DFC.RelativePath.*`

### NgRx Store
- [ ] Actions follow `[Feature] Verb Noun` pattern
- [ ] All 6 feature store files present
- [ ] Effects use `HttpService` — never raw `HttpClient`
- [ ] Effects have `catchError` → dispatch failure action
- [ ] No direct `Store` dispatch in components (use `StoreService` facade)
- [ ] Selectors use `createSelector` with memoization

### BFF (Express.js)
- [ ] `'use strict'` at top of every JS file
- [ ] URL domain validation with `schemesList` + `domainsList` before any fetch
- [ ] OAuth token from `oauth-client.js` — never hardcoded
- [ ] `try/catch` on all async handlers
- [ ] `app.config.js` not touched

### Security
- [ ] No `VAULT_TOKEN` in any file
- [ ] No `ENCRYPT_KEY` / `ENCRYPT_IV` hardcoded
- [ ] No OAuth secrets in Angular code
- [ ] No direct Java backend URLs in Angular

### Protected Files
- [ ] `ssl/` — untouched
- [ ] `dist/` — untouched
- [ ] `Dockerfile` — untouched
- [ ] `server/config/app.config.js` — untouched

## Output Format

```
✅ PASS   — conventions followed
⚠️ WARNING — minor issue, should fix
❌ VIOLATION — must fix before merge
🔒 SECURITY — critical, blocks merge
```
