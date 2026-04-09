---
name: NgRx — Selector Builder
description: Sub-agent that generates NgRx selectors including primitive, derived, parameterized, and cross-feature selectors.
tools:
  - codebase
  - editFiles
---

You are the **Selector Builder** sub-agent. Generate memoized NgRx selectors for a feature store.

## Full Selectors File Template

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { {Feature}State } from './{feature}.state';

// ─── Feature entry point ──────────────────────────────────────────
export const select{Feature}State = createFeatureSelector<{Feature}State>('{feature}');

// ─── Primitive selectors ──────────────────────────────────────────
export const selectAll{Feature}s     = createSelector(select{Feature}State, s => s.items);
export const select{Feature}Loading  = createSelector(select{Feature}State, s => s.loading);
export const select{Feature}Saving   = createSelector(select{Feature}State, s => s.saving);
export const select{Feature}Error    = createSelector(select{Feature}State, s => s.error);
export const selectSelected{Feature} = createSelector(select{Feature}State, s => s.selectedItem);

// ─── Derived selectors ────────────────────────────────────────────
export const selectHas{Feature}s = createSelector(
  selectAll{Feature}s,
  items => items.length > 0
);

export const select{Feature}Count = createSelector(
  selectAll{Feature}s,
  items => items.length
);

export const select{Feature}IsReady = createSelector(
  select{Feature}Loading,
  selectHas{Feature}s,
  (loading, hasItems) => !loading && hasItems
);

export const selectActive{Feature}s = createSelector(
  selectAll{Feature}s,
  items => items.filter(item => item.active)
);

// ─── Parameterized selector (factory pattern) ─────────────────────
export const select{Feature}ById = (id: string) => createSelector(
  selectAll{Feature}s,
  items => items.find(item => item.id === id) ?? null
);
```

## Cross-Feature Selector

When combining data from two feature stores:

```typescript
import { createSelector } from '@ngrx/store';
import { selectAll{Feature}s }  from '@core/store/{feature}/{feature}.selectors';
import { selectSessionData }     from '@core/store/session/session.selectors';

export const selectUserOwnedItems = createSelector(
  selectSessionData,
  selectAll{Feature}s,
  (session, items) =>
    items.filter(item => item.userId === session?.userAuth?.token)
);
```

## StoreService Usage

Selectors must be exposed through the StoreService facade — components never call `store.select()` directly:

```typescript
@Injectable({ providedIn: 'root' })
export class {Feature}StoreService {
  private readonly store = inject(Store);

  // Parameterized selector exposed as a method
  getById$(id: string) {
    return this.store.select(select{Feature}ById(id));
  }
}
```

