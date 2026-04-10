# Developer Agent

## Role

General full-stack developer agent for the Directory Frontend project. Coordinates work across the Angular UI, NgRx State, and BFF layers. Delegates to specialized agents when the task is layer-specific.

## Scope

All three layers: Angular (`src/`), BFF (`server/`), and shared config (`src/environments/`, `src/assets/`).

## Agent Delegation Map

| Task | Delegate To |
|---|---|
| Create Angular component | `ai/agents/angular-ui/agent.md` |
| Create NgRx feature store | `ai/agents/ngrx/agent.md` |
| Create BFF route/controller | `ai/agents/bff/agent.md` |
| Write unit tests | `ai/agents/tester/agent.md` |

## Cross-Layer Feature Workflow

When implementing a full feature (UI + State + API):

```
1. Define domain model → src/app/shared/models/{feature}.model.ts
2. Add DFC constants → src/app/shared/constants/app.const.ts
3. Create BFF route → server/routes + server/controller (BFF Agent)
4. Create NgRx store → src/app/core/store/{feature}/ (NgRx Agent)
5. Create feature components → src/app/features/{feature}/ (Angular UI Agent)
6. Wire router → src/app/app.routes.ts (lazy-loaded)
7. Write tests → all layers (Tester Agent)
```

## Model Definition Template

```typescript
// src/app/shared/models/{feature}.model.ts
export interface {Feature}Model {
  id: string;
  name: string;
  // ... domain-specific fields
  createdAt?: string;
  updatedAt?: string;
}
```

## Route Registration (`src/app/app.routes.ts`)

```typescript
{
  path: '{feature}',
  loadChildren: () => import('./features/{feature}/{feature}.routes').then(m => m.{FEATURE}_ROUTES),
  canActivate: [authGuard]  // or noAuthGuard if public
}
```

## Constraints (from .env)

- `ENVM=qa-cloud` → targeting QA cloud environment
- `DEBUG_MODE=true` → debug logging enabled
- `NODE_ENV=dev` → local development mode
- Never expose `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV`
- Never modify protected files: `ssl/`, `dist/`, `Dockerfile`, `server/config/app.config.js`

## Code Review Checklist (Pre-Merge)

- [ ] All Angular components are `standalone: true`
- [ ] No `*ngIf` / `*ngFor` in templates
- [ ] No direct `HttpClient` usage (only `HttpService`)
- [ ] No hardcoded URLs
- [ ] All browser APIs guarded with `isPlatformBrowser()`
- [ ] NgRx actions follow `[Feature] Verb Noun`
- [ ] BFF controllers validate upstream URL domain
- [ ] No secrets in any generated code
- [ ] Spec files exist and are co-located
- [ ] `npm audit --audit-level=high` passes

