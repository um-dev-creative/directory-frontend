# Agent Skills Mapping

This document shows the skills and commands assigned to each agent in the Directory Frontend project.

**Last Updated:** 2026-04-09

---

## Claude Code Agents (`.claude/agents/`)

These are the active agents invoked by Claude Code in this repository.

### Angular UI Developer (`angular-ui-agent`)
**File:** `.claude/agents/angular-ui-agent.md`
**Responsibilities:** Angular 20 standalone components, templates, Tailwind styles, SSR safety, accessibility, i18n, NgRx facade integration

**Key rules enforced:**
- `standalone: true` always
- `inject()` for DI — no constructor injection (except ControlValueAccessor)
- `@if`/`@for`/`@let` control flow — no `*ngIf`/`*ngFor`
- Signal-based `input()`/`output()` for new components; `@Input()`/`@Output()` for ControlValueAccessor
- `toSignal()` for consuming NgRx store in templates
- `StorageMockService` / `isPlatformBrowser()` for SSR safety
- No secrets/tokens/AES keys in Angular code

---

### BFF Developer (`bff-agent`)
**File:** `.claude/agents/bff-agent.md`
**Responsibilities:** Express.js routes, controllers, OAuth proxy, Redis session management, SSRF prevention, AES encryption, Multer uploads

**Key rules enforced:**
- `'use strict';` at top of every JS file
- SSRF allowlist validation before any proxy call
- `getUserSession()` from `redis-session-store.js` — not `req.session?.token`
- AES-256 encrypt passwords before forwarding to backends
- No secrets hardcoded — `process.env.*` only
- No stack traces in error responses
- Never modifies `server/config/app.config.js`

---

### NgRx State Developer (`ngrx-agent`)
**File:** `.claude/agents/ngrx-agent.md`
**Responsibilities:** NgRx 20 stores (state, actions, reducer, effects, selectors, facade), `toSignal()` integration, store tests

**Key rules enforced:**
- Action naming: `[Feature] Verbo sustantivo`
- Pure reducers — no side effects
- `catchError` in every effect → dispatches `*Fallido`
- HTTP via `HttpService` only — no `HttpClient` directly
- Facades expose `toSignal()` for Angular 20 templates
- Components use facade — never `Store` directly
- BFF URLs only (`/drb/api/v1/*` or `/bkd/api/v1/*`) — no direct Java backend calls

---

## Claude Code Skills (`.claude/commands/`)

These are slash commands available in the project.

| Command | File | Description |
|---------|------|-------------|
| `/gen-component` | `commands/gen-component.md` | Generate Angular 20 standalone component (signal-based or CVA) |
| `/gen-ngrx-feature` | `commands/gen-ngrx-feature.md` | Generate complete NgRx feature store (6 files + registration) |
| `/gen-service` | `commands/gen-service.md` | Generate Angular service (core, feature, or BFF client) |
| `/gen-bff-endpoint` | `commands/gen-bff-endpoint.md` | Generate BFF route + controller + Angular client service |
| `/review-pr` | `commands/review-pr.md` | Review PR against project conventions, security, and architecture |

---

## AI Agents (Reference — `ai/agents/`)

These are extended agent definitions used as reference documentation.

### Angular UI (`ai/agents/angular-ui/`)
- **Sub-agents:** component-builder, ui-library-builder, ssr-guard-checker
- **Skills:** angular-patterns, angular-unit-tests, component-documentation
- **Tools:** angular-cli

### NgRx (`ai/agents/ngrx/`)
- **Sub-agents:** feature-store-builder, effects-builder, selector-builder
- **Skills:** ngrx-patterns, ngrx-unit-tests
- **Tools:** ngrx-schematics

### BFF (`ai/agents/bff/`)
- **Sub-agents:** route-builder, controller-builder, session-handler
- **Skills:** bff-patterns, bff-unit-tests
- **Tools:** bff-route-builder

### Developer (`ai/agents/developer/`)
- **Responsibilities:** Full-stack coordination across Angular, NgRx, and BFF layers

### Tester (`ai/agents/tester/`)
- **Responsibilities:** Karma + Jasmine unit tests for all layers

### Product Manager (`ai/agents/product-manager/`)
- **Responsibilities:** Business requirements → technical specifications

### Product Owner (`ai/agents/product-owner/`)
- **Responsibilities:** Definition of Done validation, backlog management

---

## Hooks (`.claude/hooks/`)

| Hook | File | Trigger | Purpose |
|------|------|---------|---------|
| Pre-edit | `hooks/pre-edit.md` | Before any Edit/Write | Checks protected files, conventions, SSR safety, BFF patterns |
| Post-edit | `hooks/post-edit.md` | After any Edit/Write | Validates conventions, reminds about tests, i18n, SSR, BFF registration |

---

## Protected Files (enforced by settings.json + hooks)

```
ssl/
dist/
Dockerfile
docker-entrypoint.sh
server/config/app.config.js
```

---

## Route Prefix Convention

| Angular calls | BFF prefix | Backend target |
|--------------|------------|----------------|
| `/drb/api/v1/auth/*` | Directory Auth | Keycloak + Directory Backend auth |
| `/drb/api/v1/general/*` | Directory General | Directory Backend API |
| `/drb/api/v1/d-image/*` | Multimedia | Directory Backend profile image |
| `/bkd/api/v1/*` | Backbone | Backbone REST API |
