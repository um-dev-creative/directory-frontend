# /gen-ngrx-feature — Generate Complete NgRx Feature

Generates all necessary files for an NgRx 20 feature following the project architecture.

## Usage

```
/gen-ngrx-feature <feature-name>
```

**Example:** `/gen-ngrx-feature offers`

---

## Files to generate

All created in `src/app/core/store/<feature-name>/` (or in `src/app/features/<feature>/store/` if feature-specific).

---

### 1. `<feature>.state.ts`

```typescript
export interface <Feature>State {
  items: <Model>[];
  selectedItem: <Model> | null;
  loading: boolean;
  error: string | null;
}

export const initialState: <Feature>State = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null
};
```

---

### 2. `<feature>.actions.ts`

```typescript
import { createAction, props } from '@ngrx/store';
import { <Model> } from '../models/<model>.model';

// Convention: '[Feature] Verb noun'
export const load<Feature> = createAction('[<Feature>] Load <feature>');

export const load<Feature>Success = createAction(
  '[<Feature>] Load <feature> success',
  props<{ items: <Model>[] }>()
);

export const load<Feature>Failure = createAction(
  '[<Feature>] Load <feature> failure',
  props<{ error: string }>()
);

export const select<Feature> = createAction(
  '[<Feature>] Select <feature>',
  props<{ id: string }>()
);

export const clear<Feature> = createAction('[<Feature>] Clear <feature>');
```

---

### 3. `<feature>.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { initialState, <Feature>State } from './<feature>.state';
import * as <Feature>Actions from './<feature>.actions';

const _<feature>Reducer = createReducer(
  initialState,

  on(<Feature>Actions.load<Feature>, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(<Feature>Actions.load<Feature>Success, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),

  on(<Feature>Actions.load<Feature>Failure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(<Feature>Actions.select<Feature>, (state, { id }) => ({
    ...state,
    selectedItem: state.items.find(i => i.id === id) ?? null
  })),

  on(<Feature>Actions.clear<Feature>, () => initialState)
);

export function <feature>Reducer(state: <Feature>State | undefined, action: Action) {
  return _<feature>Reducer(state, action);
}
```

---

### 4. `<feature>.selectors.ts`

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { <Feature>State } from './<feature>.state';

export const select<Feature>State = createFeatureSelector<<Feature>State>('<feature>');

export const select<Feature>Items = createSelector(
  select<Feature>State,
  (state) => state.items
);

export const select<Feature>Selected = createSelector(
  select<Feature>State,
  (state) => state.selectedItem
);

export const select<Feature>Loading = createSelector(
  select<Feature>State,
  (state) => state.loading
);

export const select<Feature>Error = createSelector(
  select<Feature>State,
  (state) => state.error
);
```

---

### 5. `<feature>.effects.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as <Feature>Actions from './<feature>.actions';
import { <Feature>Service } from '@core/services/<feature>/<feature>.service';

@Injectable()
export class <Feature>Effects {
  private readonly actions$ = inject(Actions);
  private readonly <feature>Service = inject(<Feature>Service);

  load<Feature>$ = createEffect(() =>
    this.actions$.pipe(
      ofType(<Feature>Actions.load<Feature>),
      switchMap(() =>
        this.<feature>Service.getAll().pipe(
          map((items) => <Feature>Actions.load<Feature>Success({ items })),
          catchError((error) =>
            of(<Feature>Actions.load<Feature>Failure({ error: error.message }))
          )
        )
      )
    )
  );
}
```

---

### 6. `<feature>-store.service.ts`

Facade that encapsulates store access for components:

```typescript
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import * as <Feature>Actions from './<feature>.actions';
import * as <Feature>Selectors from './<feature>.selectors';

@Injectable({ providedIn: 'root' })
export class <Feature>StoreService {
  private readonly store = inject(Store);

  // Observables (for async pipe or combineLatest)
  readonly items$ = this.store.select(<Feature>Selectors.select<Feature>Items);
  readonly loading$ = this.store.select(<Feature>Selectors.select<Feature>Loading);
  readonly error$ = this.store.select(<Feature>Selectors.select<Feature>Error);
  readonly selected$ = this.store.select(<Feature>Selectors.select<Feature>Selected);

  // Signals (preferred for Angular 20 templates)
  readonly items = toSignal(this.items$, { initialValue: [] });
  readonly loading = toSignal(this.loading$, { initialValue: false });
  readonly error = toSignal(this.error$, { initialValue: null });
  readonly selected = toSignal(this.selected$, { initialValue: null });

  // Action dispatchers
  load(): void {
    this.store.dispatch(<Feature>Actions.load<Feature>());
  }

  select(id: string): void {
    this.store.dispatch(<Feature>Actions.select<Feature>({ id }));
  }

  clear(): void {
    this.store.dispatch(<Feature>Actions.clear<Feature>());
  }
}
```

---

## Register in app.config.ts

Remember to add the reducer and effects in `src/app/app.config.ts`:

```typescript
provideStore({ ..., <feature>: <feature>Reducer }),
provideEffects([..., <Feature>Effects]),
```

---

## Checklist

- [ ] All 6 files created in the correct folder
- [ ] Action names in format `[Feature] Verb noun`
- [ ] Pure reducer (no side effects)
- [ ] Effects use `switchMap` to cancel previous requests (or `concatMap`/`mergeMap` as appropriate)
- [ ] Facade (`StoreService`) exposes both Observables and `toSignal()` Signals
- [ ] Feature registered in `app.config.ts`
- [ ] `*.spec.ts` files for the reducer and selectors
