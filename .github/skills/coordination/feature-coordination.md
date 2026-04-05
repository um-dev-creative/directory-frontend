# Skill: Full-Stack Feature Coordination

## Purpose

Coordinate the implementation of a full-stack feature across all three layers: Angular UI, NgRx State, and BFF API, ensuring consistent conventions and proper integration.

## When to Use

- Implementing a feature that spans multiple layers
- Coordinating work between specialized agents
- Validating end-to-end feature completeness

## Full-Feature Implementation Order

```
1. Domain model    → src/app/shared/models/{feature}.model.ts
2. DFC constant    → src/app/shared/constants/app.const.ts
3. BFF endpoint    → server/controller/ + server/routes/ (BFF Agent)
4. NgRx store      → src/app/core/store/{feature}/ (NgRx Agent)
5. Angular service → src/app/core/services/ or features/ (Angular Agent)
6. Angular feature → src/app/features/{feature}/ (Angular Agent)
7. Route wiring    → src/app/app.routes.ts (lazy-loaded)
8. Unit tests      → all layers (Tester Agent)
9. Documentation   → docs/ (Documenter Agent)
10. Review         → all layers (Reviewer Agent)
```

## Agent Delegation Map

| Task | Agent | Files |
|---|---|---|
| Domain model | Developer / Angular UI | `src/app/shared/models/{feature}.model.ts` |
| DFC constant | Developer | `src/app/shared/constants/app.const.ts` |
| BFF controller | BFF Agent | `server/controller/{resource}.controller.js` |
| BFF route | BFF Agent | `server/routes/{resource}.routes.js` |
| Server mount | BFF Agent | `server.js` |
| NgRx store | NgRx Agent | `src/app/core/store/{feature}/` (6 files) |
| NgRx registration | NgRx Agent | `src/app/app.config.ts` |
| Angular components | Angular UI Agent | `src/app/features/{feature}/` |
| Route registration | Developer | `src/app/app.routes.ts` |
| Unit tests | Tester Agent | Co-located `*.spec.ts` files |
| Documentation | Documenter Agent | `docs/` |
| Code review | Reviewer Agent | All changed files |

## Route Registration Template

```typescript
// src/app/app.routes.ts
{
  path: '{feature}',
  loadChildren: () =>
    import('./features/{feature}/{feature}.routes').then(m => m.{FEATURE}_ROUTES),
  canActivate: [authGuard]  // or noAuthGuard for public routes
}
```

## Feature Routes Template

```typescript
// src/app/features/{feature}/{feature}.routes.ts
import { Routes } from '@angular/router';

export const {FEATURE}_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./{feature}-list/{feature}-list.component').then(m => m.{Feature}ListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./{feature}-detail/{feature}-detail.component').then(m => m.{Feature}DetailComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./{feature}-form/{feature}-form.component').then(m => m.{Feature}FormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./{feature}-form/{feature}-form.component').then(m => m.{Feature}FormComponent)
  }
];
```

## Pre-Merge Checklist (All Layers)

### Angular
```
[ ] standalone: true
[ ] inject() — no constructor injection
[ ] @if / @for / @let — no structural directives
[ ] HttpService only — no raw HttpClient
[ ] isPlatformBrowser() guards on browser APIs
[ ] DFC constants for URLs
[ ] Path aliases — no deep relative imports
[ ] | translate for visible text
```

### NgRx
```
[ ] [Feature] Verb Noun actions
[ ] All 6 store files present
[ ] HttpService in effects
[ ] catchError in every effect
[ ] switchMap for reads, concatMap for writes
[ ] StoreService facade
[ ] Registered in app.config.ts
```

### BFF
```
[ ] 'use strict' in all JS files
[ ] URL domain validation
[ ] OAuth from oauth-client.js or backbone-client.js
[ ] try/catch on all async handlers
[ ] app.config.js untouched
```

### Security
```
[ ] No VAULT_TOKEN / ENCRYPT_KEY / ENCRYPT_IV
[ ] npm audit --audit-level=high passes
[ ] ssl/, dist/, Dockerfile untouched
```

### Testing
```
[ ] Spec files co-located
[ ] All mocks in place (HttpService, MockStore)
[ ] ng test passes
[ ] Coverage meets thresholds
```

## Validation Commands

```bash
# Full validation sequence
ng build --configuration development && \
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox && \
npm audit --audit-level=high && \
echo "✅ All checks passed"
```

