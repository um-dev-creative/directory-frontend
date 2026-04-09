---
name: NgRx — Feature Store Builder
description: Sub-agent that generates all 6 NgRx feature store files from a domain entity description.
tools:
  - codebase
  - editFiles
---

You are the **Feature Store Builder** sub-agent. Given a feature name and its domain model, generate all 6 NgRx store files.

## Input Required

1. Feature name (e.g. `deals`, `partner`, `favorites`)
2. Model properties (fields of the domain entity)
3. Operations needed: load / create / update / delete / select

## Output: 6 Files

Generate in `src/app/core/store/{feature}/`:

### `{feature}.state.ts`
```typescript
import { {Feature}Model } from '@shared/models/{feature}.model';

export interface {Feature}State {
  items:        {Feature}Model[];
  selectedItem: {Feature}Model | null;
  loading:      boolean;
  saving:       boolean;
  error:        string | null;
}

export const initial{Feature}State: {Feature}State = {
  items: [], selectedItem: null, loading: false, saving: false, error: null
};
```

### `{feature}.action.ts`
```typescript
import { createAction, props } from '@ngrx/store';
import { {Feature}Model } from '@shared/models/{feature}.model';

export const load{Feature}s          = createAction('[{Feature}] Load {feature}s');
export const load{Feature}sSuccess   = createAction('[{Feature}] Load {feature}s success',  props<{ items: {Feature}Model[] }>());
export const load{Feature}sFailure   = createAction('[{Feature}] Load {feature}s failure',  props<{ error: string }>());
export const select{Feature}         = createAction('[{Feature}] Select {feature}',         props<{ id: string }>());
export const create{Feature}         = createAction('[{Feature}] Create {feature}',         props<{ data: Partial<{Feature}Model> }>());
export const create{Feature}Success  = createAction('[{Feature}] Create {feature} success', props<{ item: {Feature}Model }>());
export const create{Feature}Failure  = createAction('[{Feature}] Create {feature} failure', props<{ error: string }>());
export const update{Feature}         = createAction('[{Feature}] Update {feature}',         props<{ id: string; data: Partial<{Feature}Model> }>());
export const update{Feature}Success  = createAction('[{Feature}] Update {feature} success', props<{ item: {Feature}Model }>());
export const update{Feature}Failure  = createAction('[{Feature}] Update {feature} failure', props<{ error: string }>());
export const delete{Feature}         = createAction('[{Feature}] Delete {feature}',         props<{ id: string }>());
export const delete{Feature}Success  = createAction('[{Feature}] Delete {feature} success', props<{ id: string }>());
export const delete{Feature}Failure  = createAction('[{Feature}] Delete {feature} failure', props<{ error: string }>());
```

### `{feature}.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import { initial{Feature}State } from './{feature}.state';
import * as A from './{feature}.action';

export const {feature}Reducer = createReducer(
  initial{Feature}State,
  on(A.load{Feature}s,         state         => ({ ...state, loading: true,  error: null })),
  on(A.load{Feature}sSuccess,  (state,{items}) => ({ ...state, items, loading: false })),
  on(A.load{Feature}sFailure,  (state,{error}) => ({ ...state, error, loading: false })),
  on(A.select{Feature},        (state,{id})   => ({ ...state, selectedItem: state.items.find(i=>i.id===id)??null })),
  on(A.create{Feature},        state         => ({ ...state, saving: true,   error: null })),
  on(A.create{Feature}Success, (state,{item}) => ({ ...state, items:[...state.items,item], saving:false })),
  on(A.create{Feature}Failure, (state,{error}) => ({ ...state, error, saving: false })),
  on(A.update{Feature},        state         => ({ ...state, saving: true,   error: null })),
  on(A.update{Feature}Success, (state,{item}) => ({ ...state, items:state.items.map(i=>i.id===item.id?item:i), saving:false })),
  on(A.update{Feature}Failure, (state,{error}) => ({ ...state, error, saving: false })),
  on(A.delete{Feature},        state         => ({ ...state, saving: true,   error: null })),
  on(A.delete{Feature}Success, (state,{id})  => ({ ...state, items:state.items.filter(i=>i.id!==id), saving:false })),
  on(A.delete{Feature}Failure, (state,{error}) => ({ ...state, error, saving: false }))
);
```

### `{feature}-effects.ts`
See `effects-builder.md` for full template.

### `{feature}.selectors.ts`
See `selector-builder.md` for full template.

### `{feature}-store.service.ts`
See parent `agent.md` for full facade template.

## Post-Generation Steps

```
1. Add model file: src/app/shared/models/{feature}.model.ts
2. Add DFC constant: DFC.RelativePath.{FEATURE}_PATH
3. Register in app.config.ts: provideState + provideEffects
4. Run: ng build --configuration development
```

