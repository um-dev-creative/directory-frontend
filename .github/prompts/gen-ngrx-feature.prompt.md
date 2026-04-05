---
mode: agent
description: Generate a complete NgRx feature store (state, actions, reducer, effects, selectors, service)
tools:
  - codebase
  - editFiles
  - runCommands
---

# Generate NgRx Feature Store

> This prompt activates the **NgRx State Developer Agent**.
> Full agent definition: [agent.md](../ai/agents/ngrx/agent.md)
> Sub-agents used:
> - [feature-store-builder.md](../ai/agents/ngrx/subagents/feature-store-builder.md)
> - [effects-builder.md](../ai/agents/ngrx/subagents/effects-builder.md)
> - [selector-builder.md](../ai/agents/ngrx/subagents/selector-builder.md)
>
> Skills applied:
> - [ngrx-patterns.md](../ai/skills/code-analysis/ngrx-patterns.md)
> - [ngrx-unit-tests.md](../ai/skills/test-generation/ngrx-unit-tests.md)
>
> Tools used:
> - [ngrx-schematics.md](../ai/tools/ngrx-schematics.md)
>
> Security constraints: [security-policy.md](../ai/config/security-policy.md)
> Environment constraints: [env-constraints.md](../ai/config/env-constraints.md)

---

## Instructions

Generate a complete NgRx feature store for the given domain entity or feature.

### Required Input
Ask the user for (if not already provided):
1. **Feature name** (e.g. `partner`, `deals`, `favorites`)
2. **State shape** — what data the store holds
3. **Operations** — load, create, update, delete, or custom
4. **BFF endpoint(s)** — the Angular-side HTTP paths (`/drb/api/v1/...`)

### File Structure to Generate

```
src/app/core/store/{feature}/
├── {feature}.state.ts
├── {feature}.action.ts
├── {feature}.reducer.ts
├── {feature}-effects.ts
├── {feature}.selectors.ts
└── {feature}-store.service.ts
```

### Action Naming Convention

```typescript
// Pattern: [Feature] Verb Noun
export const loadItems = createAction('[Feature] Load items');
export const loadItemsSuccess = createAction('[Feature] Load items success', props<{ items: ItemModel[] }>());
export const loadItemsFailure = createAction('[Feature] Load items failure', props<{ error: string }>());
```

### Effects Rules

```
ALWAYS use HttpService — NEVER raw HttpClient
ALWAYS target BFF paths (/drb/api/v1/* or /bkd/api/v1/*)
switchMap  → reads (load, search) — cancels previous
concatMap  → writes (create, update, delete) — sequential
ALWAYS have catchError → dispatch failure action
```

### StoreService Facade

Components **must never dispatch directly** to the store. Always use the StoreService:

```typescript
@Injectable({ providedIn: 'root' })
export class {Feature}StoreService {
  private readonly store = inject(Store);
  readonly items$ = this.store.select(selectAll{Feature}s);
  load() { this.store.dispatch({Feature}Actions.load{Feature}s()); }
}
```

### Registration in `app.config.ts`

```typescript
provideState({ name: '{feature}', reducer: {feature}Reducer }),
provideEffects([{Feature}Effects]),
```

### Post-Generation

```bash
ng build --configuration development
ng test --no-watch --browsers ChromeHeadlessNoSandbox
```
