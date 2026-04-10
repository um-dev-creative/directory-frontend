# Sub-Agent: Feature Store Builder

**Parent Agent:** NgRx State Developer Agent  
**Trigger:** When a complete NgRx feature store needs to be scaffolded

## Purpose

Generate all 6 files for a new NgRx feature store following the Directory Frontend conventions.

## Input Requirements

Before generating, collect:
1. **Feature name** (e.g. `deals`, `favorites`, `partner`)
2. **Model definition** (properties of the domain entity)
3. **Operations needed** (list: load, create, update, delete, select, etc.)
4. **BFF endpoint paths** (e.g. `/drb/api/v1/deals`)

---

## File 1: `{feature}.state.ts`

```typescript
import { {Feature}Model } from '@shared/models/{feature}.model';

export interface {Feature}State {
  items: {Feature}Model[];
  selectedItem: {Feature}Model | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initial{Feature}State: {Feature}State = {
  items: [],
  selectedItem: null,
  loading: false,
  saving: false,
  error: null
};
```

---

## File 2: `{feature}.action.ts`

```typescript
import { createAction, props } from '@ngrx/store';
import { {Feature}Model } from '@shared/models/{feature}.model';

// Load collection
export const load{Feature}s = createAction('[{Feature}] Load {feature}s');
export const load{Feature}sSuccess = createAction(
  '[{Feature}] Load {feature}s success',
  props<{ items: {Feature}Model[] }>()
);
export const load{Feature}sFailure = createAction(
  '[{Feature}] Load {feature}s failure',
  props<{ error: string }>()
);

// Select item
export const select{Feature} = createAction(
  '[{Feature}] Select {feature}',
  props<{ id: string }>()
);

// Create
export const create{Feature} = createAction(
  '[{Feature}] Create {feature}',
  props<{ data: Partial<{Feature}Model> }>()
);
export const create{Feature}Success = createAction(
  '[{Feature}] Create {feature} success',
  props<{ item: {Feature}Model }>()
);
export const create{Feature}Failure = createAction(
  '[{Feature}] Create {feature} failure',
  props<{ error: string }>()
);

// Update
export const update{Feature} = createAction(
  '[{Feature}] Update {feature}',
  props<{ id: string; data: Partial<{Feature}Model> }>()
);
export const update{Feature}Success = createAction(
  '[{Feature}] Update {feature} success',
  props<{ item: {Feature}Model }>()
);
export const update{Feature}Failure = createAction(
  '[{Feature}] Update {feature} failure',
  props<{ error: string }>()
);

// Delete
export const delete{Feature} = createAction(
  '[{Feature}] Delete {feature}',
  props<{ id: string }>()
);
export const delete{Feature}Success = createAction(
  '[{Feature}] Delete {feature} success',
  props<{ id: string }>()
);
export const delete{Feature}Failure = createAction(
  '[{Feature}] Delete {feature} failure',
  props<{ error: string }>()
);
```

---

## File 3: `{feature}.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { initial{Feature}State } from './{feature}.state';
import * as {Feature}Actions from './{feature}.action';

export const {feature}Reducer = createReducer(
  initial{Feature}State,

  // Load
  on({Feature}Actions.load{Feature}s, state => ({
    ...state, loading: true, error: null
  })),
  on({Feature}Actions.load{Feature}sSuccess, (state, { items }) => ({
    ...state, items, loading: false
  })),
  on({Feature}Actions.load{Feature}sFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  // Select
  on({Feature}Actions.select{Feature}, (state, { id }) => ({
    ...state, selectedItem: state.items.find(i => i.id === id) ?? null
  })),

  // Create
  on({Feature}Actions.create{Feature}, state => ({ ...state, saving: true, error: null })),
  on({Feature}Actions.create{Feature}Success, (state, { item }) => ({
    ...state, items: [...state.items, item], saving: false
  })),
  on({Feature}Actions.create{Feature}Failure, (state, { error }) => ({
    ...state, error, saving: false
  })),

  // Update
  on({Feature}Actions.update{Feature}, state => ({ ...state, saving: true, error: null })),
  on({Feature}Actions.update{Feature}Success, (state, { item }) => ({
    ...state,
    items: state.items.map(i => i.id === item.id ? item : i),
    selectedItem: state.selectedItem?.id === item.id ? item : state.selectedItem,
    saving: false
  })),
  on({Feature}Actions.update{Feature}Failure, (state, { error }) => ({
    ...state, error, saving: false
  })),

  // Delete
  on({Feature}Actions.delete{Feature}, state => ({ ...state, saving: true, error: null })),
  on({Feature}Actions.delete{Feature}Success, (state, { id }) => ({
    ...state,
    items: state.items.filter(i => i.id !== id),
    selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
    saving: false
  })),
  on({Feature}Actions.delete{Feature}Failure, (state, { error }) => ({
    ...state, error, saving: false
  }))
);
```

---

## File 4: `{feature}-effects.ts`

See `subagents/effects-builder.md` for detailed patterns.

---

## File 5: `{feature}.selectors.ts`

See `subagents/selector-builder.md` for detailed patterns.

---

## File 6: `{feature}-store.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as {Feature}Actions from './{feature}.action';
import {
  selectAll{Feature}s,
  select{Feature}Loading,
  select{Feature}Saving,
  select{Feature}Error,
  selectSelected{Feature}
} from './{feature}.selectors';

@Injectable({ providedIn: 'root' })
export class {Feature}StoreService {
  private readonly store = inject(Store);

  // Selectors as Observables
  readonly items$ = this.store.select(selectAll{Feature}s);
  readonly loading$ = this.store.select(select{Feature}Loading);
  readonly saving$ = this.store.select(select{Feature}Saving);
  readonly error$ = this.store.select(select{Feature}Error);
  readonly selectedItem$ = this.store.select(selectSelected{Feature});

  // Dispatch methods
  load(): void {
    this.store.dispatch({Feature}Actions.load{Feature}s());
  }

  select(id: string): void {
    this.store.dispatch({Feature}Actions.select{Feature}({ id }));
  }

  create(data: Partial<{Feature}Model>): void {
    this.store.dispatch({Feature}Actions.create{Feature}({ data }));
  }

  update(id: string, data: Partial<{Feature}Model>): void {
    this.store.dispatch({Feature}Actions.update{Feature}({ id, data }));
  }

  delete(id: string): void {
    this.store.dispatch({Feature}Actions.delete{Feature}({ id }));
  }
}
```

---

## Registration in `app.config.ts`

```typescript
import { {feature}Reducer } from '@core/store/{feature}/{feature}.reducer';
import { {Feature}Effects } from '@core/store/{feature}/{feature}-effects';

// Add to provideStore providers:
provideState({ name: '{feature}', reducer: {feature}Reducer }),
provideEffects([{Feature}Effects]),
```

