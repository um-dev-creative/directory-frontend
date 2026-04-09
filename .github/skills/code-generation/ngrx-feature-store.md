# Skill: NgRx Feature Store Generation

## Purpose

Generate a complete NgRx 20 feature store with all 6 required files following Directory Frontend conventions.

## When to Use

- Creating a new feature that needs global state management
- Adding CRUD operations for a new domain entity
- Setting up state management for a new feature module

## Required Files (ALL 6)

```
src/app/core/store/{feature}/
├── {feature}.state.ts          ← interface + initialState
├── {feature}.action.ts         ← createAction() definitions
├── {feature}.reducer.ts        ← on() pure handlers
├── {feature}-effects.ts        ← HttpService side-effects
├── {feature}.selectors.ts      ← createSelector() projectors
└── {feature}-store.service.ts  ← Facade (Observables + dispatch methods)
```

## File 1: State (`{feature}.state.ts`)

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
  items:        [],
  selectedItem: null,
  loading:      false,
  saving:       false,
  error:        null
};
```

## File 2: Actions (`{feature}.action.ts`)

```typescript
import { createAction, props } from '@ngrx/store';
import { {Feature}Model } from '@shared/models/{feature}.model';

// Load
export const load{Feature}s        = createAction('[{Feature}] Load {feature}s');
export const load{Feature}sSuccess = createAction('[{Feature}] Load {feature}s success', props<{ items: {Feature}Model[] }>());
export const load{Feature}sFailure = createAction('[{Feature}] Load {feature}s failure', props<{ error: string }>());

// Create
export const create{Feature}        = createAction('[{Feature}] Create {feature}',         props<{ data: Partial<{Feature}Model> }>());
export const create{Feature}Success = createAction('[{Feature}] Create {feature} success', props<{ item: {Feature}Model }>());
export const create{Feature}Failure = createAction('[{Feature}] Create {feature} failure', props<{ error: string }>());

// Update
export const update{Feature}        = createAction('[{Feature}] Update {feature}',         props<{ id: string; data: Partial<{Feature}Model> }>());
export const update{Feature}Success = createAction('[{Feature}] Update {feature} success', props<{ item: {Feature}Model }>());
export const update{Feature}Failure = createAction('[{Feature}] Update {feature} failure', props<{ error: string }>());

// Delete
export const delete{Feature}        = createAction('[{Feature}] Delete {feature}',         props<{ id: string }>());
export const delete{Feature}Success = createAction('[{Feature}] Delete {feature} success', props<{ id: string }>());
export const delete{Feature}Failure = createAction('[{Feature}] Delete {feature} failure', props<{ error: string }>());

// Select
export const select{Feature} = createAction('[{Feature}] Select {feature}', props<{ id: string }>());
```

## File 3: Reducer (`{feature}.reducer.ts`)

```typescript
import { createReducer, on } from '@ngrx/store';
import { initial{Feature}State } from './{feature}.state';
import * as {Feature}Actions from './{feature}.action';

export const {feature}Reducer = createReducer(
  initial{Feature}State,

  // Load
  on({Feature}Actions.load{Feature}s,        state => ({ ...state, loading: true, error: null })),
  on({Feature}Actions.load{Feature}sSuccess, (state, { items }) => ({ ...state, items, loading: false })),
  on({Feature}Actions.load{Feature}sFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Create
  on({Feature}Actions.create{Feature},        state => ({ ...state, saving: true, error: null })),
  on({Feature}Actions.create{Feature}Success, (state, { item }) => ({ ...state, items: [...state.items, item], saving: false })),
  on({Feature}Actions.create{Feature}Failure, (state, { error }) => ({ ...state, error, saving: false })),

  // Update
  on({Feature}Actions.update{Feature},        state => ({ ...state, saving: true, error: null })),
  on({Feature}Actions.update{Feature}Success, (state, { item }) => ({
    ...state,
    items: state.items.map(i => i.id === item.id ? item : i),
    saving: false
  })),
  on({Feature}Actions.update{Feature}Failure, (state, { error }) => ({ ...state, error, saving: false })),

  // Delete
  on({Feature}Actions.delete{Feature},        state => ({ ...state, saving: true, error: null })),
  on({Feature}Actions.delete{Feature}Success, (state, { id }) => ({
    ...state,
    items: state.items.filter(i => i.id !== id),
    saving: false
  })),
  on({Feature}Actions.delete{Feature}Failure, (state, { error }) => ({ ...state, error, saving: false })),

  // Select
  on({Feature}Actions.select{Feature}, (state, { id }) => ({
    ...state,
    selectedItem: state.items.find(i => i.id === id) ?? null
  }))
);
```

## File 4: Effects (`{feature}-effects.ts`)

```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, concatMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { DFC } from '@shared/constants/app.const';
import * as {Feature}Actions from './{feature}.action';
import { {Feature}Model } from '@shared/models/{feature}.model';

@Injectable()
export class {Feature}Effects {
  private readonly actions$ = inject(Actions);
  private readonly http     = inject(HttpService);

  // READ — switchMap (cancellable)
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.load{Feature}s),
      switchMap(() =>
        this.http.get<{Feature}Model[]>(DFC.RelativePath.{FEATURE}_PATH).pipe(
          map(items  => {Feature}Actions.load{Feature}sSuccess({ items })),
          catchError(err => of({Feature}Actions.load{Feature}sFailure({ error: err.message })))
        )
      )
    )
  );

  // WRITE — concatMap (sequential, no cancellation)
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.create{Feature}),
      concatMap(({ data }) =>
        this.http.post<{Feature}Model>(DFC.RelativePath.{FEATURE}_PATH, data).pipe(
          map(item  => {Feature}Actions.create{Feature}Success({ item })),
          catchError(err => of({Feature}Actions.create{Feature}Failure({ error: err.message })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.update{Feature}),
      concatMap(({ id, data }) =>
        this.http.put<{Feature}Model>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`, data).pipe(
          map(item  => {Feature}Actions.update{Feature}Success({ item })),
          catchError(err => of({Feature}Actions.update{Feature}Failure({ error: err.message })))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.delete{Feature}),
      concatMap(({ id }) =>
        this.http.delete<void>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`).pipe(
          map(() => {Feature}Actions.delete{Feature}Success({ id })),
          catchError(err => of({Feature}Actions.delete{Feature}Failure({ error: err.message })))
        )
      )
    )
  );
}
```

## File 5: Selectors (`{feature}.selectors.ts`)

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { {Feature}State } from './{feature}.state';

export const select{Feature}State    = createFeatureSelector<{Feature}State>('{feature}');
export const selectAll{Feature}s     = createSelector(select{Feature}State, s => s.items);
export const select{Feature}Loading  = createSelector(select{Feature}State, s => s.loading);
export const select{Feature}Saving   = createSelector(select{Feature}State, s => s.saving);
export const select{Feature}Error    = createSelector(select{Feature}State, s => s.error);
export const selectSelected{Feature} = createSelector(select{Feature}State, s => s.selectedItem);
export const selectHas{Feature}s     = createSelector(selectAll{Feature}s, items => items.length > 0);
```

## File 6: StoreService Facade (`{feature}-store.service.ts`)

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
import { {Feature}Model } from '@shared/models/{feature}.model';

@Injectable({ providedIn: 'root' })
export class {Feature}StoreService {
  private readonly store = inject(Store);

  readonly items$    = this.store.select(selectAll{Feature}s);
  readonly loading$  = this.store.select(select{Feature}Loading);
  readonly saving$   = this.store.select(select{Feature}Saving);
  readonly error$    = this.store.select(select{Feature}Error);
  readonly selected$ = this.store.select(selectSelected{Feature});

  load()                                          { this.store.dispatch({Feature}Actions.load{Feature}s()); }
  create(data: Partial<{Feature}Model>)           { this.store.dispatch({Feature}Actions.create{Feature}({ data })); }
  update(id: string, data: Partial<{Feature}Model>) { this.store.dispatch({Feature}Actions.update{Feature}({ id, data })); }
  delete(id: string)                              { this.store.dispatch({Feature}Actions.delete{Feature}({ id })); }
  select(id: string)                              { this.store.dispatch({Feature}Actions.select{Feature}({ id })); }
}
```

## Registration in `app.config.ts`

```typescript
import { {feature}Reducer } from '@core/store/{feature}/{feature}.reducer';
import { {Feature}Effects } from '@core/store/{feature}/{feature}-effects';

// Add to providers array:
provideState({ name: '{feature}', reducer: {feature}Reducer }),
provideEffects([{Feature}Effects]),
```

## Domain Model Template

```typescript
// src/app/shared/models/{feature}.model.ts
export interface {Feature}Model {
  id:          string;
  name:        string;
  // domain-specific fields
  createdAt?:  string;
  updatedAt?:  string;
}
```

## Canonical Reference

The session store in `src/app/core/store/session/` is the canonical example. All new stores must follow its conventions.

