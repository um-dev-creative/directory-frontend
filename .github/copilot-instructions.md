# GitHub Copilot — Repository Instructions
# Directory Frontend

> Read this file entirely before generating any code. These are non-negotiable rules.

---

## Project Context

Directory Frontend is a full-stack web application (LatinHub business directory). It is built as:
- **Angular 20 SSR SPA** — client rendered and server-side rendered
- **Express.js BFF** — mandatory intermediary between Angular and all Java microservices
- **NgRx 20** — global state management
- **Redis** — session/token cache (with in-memory fallback)

---

## Technology Stack

| Category | Technology | Version |
|---|---|---|
| Frontend | Angular with SSR (`@angular/ssr`) | 20.3.x |
| Global State | NgRx (Store · Effects · Devtools) | 20.x |
| Local State | Angular Signals | built-in |
| Styling | Tailwind CSS | v4 |
| Translations | `@ngx-translate/core` | v16 |
| BFF | Express.js | 4.x |
| Session | Redis + in-memory fallback | 7.x |
| Auth | JWT + OAuth 2.0 / Keycloak | — |
| Testing | Karma + Jasmine + ChromeHeadlessNoSandbox | — |
| TypeScript | strict mode | 5.7.3 |
| Package manager | pnpm | 9.x |

---

## Path Aliases (always use these)

```
@app/*    → src/app/*
@core/*   → src/app/core/*
@shared/* → src/app/shared/*
@env/*    → src/environments/*
```

Never use relative paths with more than 2 `../` levels.

---

## Absolute Rules (Non-Negotiable)

### Angular Components
- **ALWAYS `standalone: true`** — NgModule is forbidden
- Use **`inject()`** function — never constructor injection (except inheritance)
- Use **`@if` / `@for` / `@let`** — never `*ngIf` / `*ngFor` / `*ngSwitch`
- List ALL template dependencies in the `imports: []` array
- Use `| translate` for user-visible strings when the key exists in `src/assets/i18n/`

### State Management
- **NgRx** for global state; **Angular Signals** for local component state only
- NgRx feature store structure: `state.ts`, `action.ts`, `reducer.ts`, `effects.ts`, `selectors.ts`, `store.service.ts`
- Action naming: `[Feature] Verb Noun` — example: `[Session] Save session`

### HTTP / BFF Layer
- **NEVER call Java backends directly from Angular** — ALL calls go through the BFF
- Use `HttpService` (`@core/services/http.service.ts`) — never raw `HttpClient`
- Build URLs from `DFC` constants or `environment.ts` — zero hardcoded URLs

### SSR Safety
- Guard ALL `window` / `document` / `localStorage` / `sessionStorage` access with `isPlatformBrowser()`
- Use `StorageMockService` (`@core/services/storage-mock.service.ts`) instead of direct storage
- Comment `// SSR: browser-only` on any browser-only code

### Protected Files — NEVER TOUCH
```
ssl/
dist/
Dockerfile
docker-entrypoint.sh
server/config/app.config.js
```

---

## Component Template

```typescript
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent {
  private readonly myService = inject(MyService);
}
```

---

## NgRx Action Template

```typescript
export const loadItems = createAction('[Feature] Load items');
export const loadItemsSuccess = createAction(
  '[Feature] Load items success',
  props<{ items: ItemModel[] }>()
);
export const loadItemsFailure = createAction(
  '[Feature] Load items failure',
  props<{ error: string }>()
);
```

---

## BFF Route Template

```javascript
// server/controller/my-resource.controller.js
const proxyApi = async (req, res) => {
  // 1. Validate URL (schemesList + domainsList)
  // 2. Get auth tokens
  // 3. Proxy request to downstream service
  // 4. Return response
};
module.exports = { proxyApi };
```

---

## Testing

```bash
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox
```

- Co-locate spec files: `my-service.spec.ts` next to `my-service.ts`
- Mock `HttpService` with `HttpClientTestingModule`
- Mock `Store` with `MockStore` from `@ngrx/store/testing`
- NEVER make real HTTP calls in unit tests

---

## Security Constraints (from .env)

- `DEBUG_MODE=true` — verbose logging allowed in dev
- `ENVM=qa-cloud` — current environment; Vault path is `PRX/data/directory-frontend/qa-cloud`
- `NODE_ENV=dev` — TLS bypass allowed locally
- `VAULT_TOKEN` — NEVER log, expose, or include in any generated code or response
- AES keys (`ENCRYPT_KEY`, `ENCRYPT_IV`) — NEVER expose, log, or hardcode
- OAuth secrets — NEVER expose to browser or include in Angular code

---

## Available Agents (use `#` in Copilot Chat)

| Agent Prompt | Purpose |
|---|---|
| `#gen-angular-component` | Generate a standalone Angular component |
| `#gen-ngrx-feature` | Generate a complete NgRx feature store |
| `#gen-bff-route` | Generate a new BFF Express route + controller |
| `#gen-unit-test` | Generate unit tests for a given file |
| `#review-code` | Review code for project convention compliance |

---

## Directory Structure Reference

```
src/app/
├── core/
│   ├── guards/       # authGuard, noAuthGuard, roleGuard, smoothAuthGuard
│   ├── interceptors/ # AuthInterceptor, LoadingInterceptor, ErrorInterceptor, CacheInterceptor
│   ├── services/     # HttpService, AuthService, LoggerService, NotificationService, StorageMockService
│   └── store/
│       └── session/  # session NgRx store
├── features/         # Lazy-loaded: auth, partner, community-member, stage, deals, about, contact
├── components/ui/    # Button, Badge, Alert, Avatar, Card, Input, Modal, Skeleton, Tooltip, Icon
├── shared/           # Models, constants (DFC), pipes, utils
└── layout/           # Footer, NotFound, ReportProblem

server/               # BFF Express.js
├── config/           # app.config.js (PROTECTED), config.json, constants.util.js
├── controller/       # Request handlers
├── routes/           # Express route definitions
├── proxy/            # oauth-client.js, backbone-client.js
└── shared/           # redis-client, redis-session-store, redis-lock, common-function
```

