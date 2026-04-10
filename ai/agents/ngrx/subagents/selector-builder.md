# Sub-Agent: Selector Builder

**Parent Agent:** NgRx State Developer Agent  
**Trigger:** When selectors for derived state or filtered data need to be generated

## Purpose

Generate NgRx selectors using `createFeatureSelector` and `createSelector` for memoized, composable state projections.

## Base Selector Pattern

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { {Feature}State } from './{feature}.state';

// Feature selector — entry point for all {feature} selectors
export const select{Feature}State = createFeatureSelector<{Feature}State>('{feature}');

// ---- Primitive selectors ----
export const selectAll{Feature}s = createSelector(
  select{Feature}State,
  state => state.items
);

export const select{Feature}Loading = createSelector(
  select{Feature}State,
  state => state.loading
);

export const select{Feature}Saving = createSelector(
  select{Feature}State,
  state => state.saving
);

export const select{Feature}Error = createSelector(
  select{Feature}State,
  state => state.error
);

export const selectSelected{Feature} = createSelector(
  select{Feature}State,
  state => state.selectedItem
);

// ---- Derived selectors (computed) ----
export const selectHas{Feature}s = createSelector(
  selectAll{Feature}s,
  items => items.length > 0
);

export const select{Feature}Count = createSelector(
  selectAll{Feature}s,
  items => items.length
);

export const select{Feature}ById = (id: string) => createSelector(
  selectAll{Feature}s,
  items => items.find(item => item.id === id) ?? null
);

export const selectActive{Feature}s = createSelector(
  selectAll{Feature}s,
  items => items.filter(item => item.active)
);

export const select{Feature}IsReady = createSelector(
  select{Feature}Loading,
  selectHas{Feature}s,
  (loading, hasItems) => !loading && hasItems
);
```

## Cross-Feature Selectors

When selectors need data from multiple feature stores:

```typescript
import { createSelector } from '@ngrx/store';
import { selectAll{Feature}s } from '@core/store/{feature}/{feature}.selectors';
import { selectSessionData } from '@core/store/session/session.selectors';

// Combine session + feature data
export const selectUserItems = createSelector(
  selectSessionData,
  selectAll{Feature}s,
  (session, items) => items.filter(item => item.userId === session?.userAuth?.token)
);
```

## Selector in Components (via StoreService)

Components should always access selectors through the `StoreService` facade:

```typescript
// ✅ Correct — via StoreService
export class MyComponent {
  private readonly {feature}Store = inject({Feature}StoreService);

  readonly items$ = this.{feature}Store.items$;
  readonly loading$ = this.{feature}Store.loading$;
}

// ❌ Incorrect — direct store access in component
export class MyComponent {
  private readonly store = inject(Store);
  readonly items$ = this.store.select(selectAll{Feature}s); // Don't do this
}
```

## Selector with Parameters (Factory Pattern)

```typescript
// Factory selector for parameterized queries
export const select{Feature}ByCategory = (categoryId: string) => createSelector(
  selectAll{Feature}s,
  items => items.filter(item => item.categoryId === categoryId)
);

// Usage in StoreService:
getByCategory(categoryId: string) {
  return this.store.select(select{Feature}ByCategory(categoryId));
}
```

