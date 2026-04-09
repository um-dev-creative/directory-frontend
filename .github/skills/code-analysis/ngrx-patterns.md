# Skill: NgRx Code Analysis

## Purpose

Analyze NgRx 20 store code in the Directory Frontend project for pattern correctness, naming conventions, and architectural compliance.

## When to Use

- Reviewing NgRx feature stores
- Validating generated store files
- Auditing existing stores for convention drift

## Analysis Dimensions

### 1. Action Naming Convention

Pattern: `[Feature] Verb Noun`

```typescript
// ❌ Flag these — wrong naming:
export const LOAD = createAction('load');
export const fetchData = createAction('fetchData');
export const getData = createAction('get data');
export const LOAD_PARTNERS = createAction('LOAD_PARTNERS');

// ✅ Correct — [Feature] Verb Noun:
export const loadDeals = createAction('[Deals] Load deals');
export const loadDealsSuccess = createAction('[Deals] Load deals success', props<{ items: Deal[] }>());
export const loadDealsFailure = createAction('[Deals] Load deals failure', props<{ error: string }>());
export const createDeal = createAction('[Deals] Create deal', props<{ data: Partial<Deal> }>());
export const updateDeal = createAction('[Deals] Update deal', props<{ id: string; data: Partial<Deal> }>());
export const deleteDeal = createAction('[Deals] Delete deal', props<{ id: string }>());
```

### 2. Feature Store File Structure

Every feature store MUST have ALL 6 files:

```
src/app/core/store/{feature}/
├── {feature}.state.ts          ← interface + initialState
├── {feature}.action.ts         ← createAction() definitions
├── {feature}.reducer.ts        ← on() pure handlers
├── {feature}-effects.ts        ← HttpService side-effects
├── {feature}.selectors.ts      ← createSelector() projectors
└── {feature}-store.service.ts  ← Facade (Observables + dispatch methods)
```

Flag if any file is missing.

### 3. Effects Operator Analysis

```typescript
// ❌ Flag — raw HttpClient in effects:
switchMap(() => this.httpClient.get<Deal[]>('https://...'))

// ❌ Flag — switchMap on WRITE operations (cancellation risk):
switchMap(({ id }) => this.http.delete(`/drb/api/v1/deals/${id}`))
switchMap(({ data }) => this.http.post(path, data))
switchMap(({ id, data }) => this.http.put(`${path}/${id}`, data))

// ✅ Correct — switchMap for READ operations:
switchMap(() => this.http.get<Deal[]>(DFC.RelativePath.DEALS_PATH).pipe(...))

// ✅ Correct — concatMap for WRITE operations (sequential):
concatMap(({ data }) => this.http.post<Deal>(path, data).pipe(...))
concatMap(({ id, data }) => this.http.put<Deal>(`${path}/${id}`, data).pipe(...))

// ✅ Acceptable — mergeMap for independent WRITE operations:
mergeMap(({ id }) => this.http.delete<void>(`${path}/${id}`).pipe(...))
```

### 4. Error Handling in Effects

```typescript
// ❌ Flag — missing catchError:
switchMap(() => this.http.get<Deal[]>(path).pipe(
  map(items => loadDealsSuccess({ items }))
  // No catchError — unhandled errors will break the effect stream!
))

// ❌ Flag — catchError outside the inner pipe:
switchMap(() => this.http.get<Deal[]>(path).pipe(
  map(items => loadDealsSuccess({ items }))
)),
catchError(err => of(loadDealsFailure({ error: err.message })))
// This kills the entire effect on first error!

// ✅ Correct — catchError INSIDE the inner pipe:
switchMap(() => this.http.get<Deal[]>(path).pipe(
  map(items => loadDealsSuccess({ items })),
  catchError(err => of(loadDealsFailure({ error: err.message })))
))
```

### 5. Selector Analysis

```typescript
// ❌ Flag — manual selector without createFeatureSelector:
export const selectDeals = (state: AppState) => state.deals.items;

// ❌ Flag — accessing state directly in components:
this.store.select(state => state.deals.items);

// ✅ Correct — createFeatureSelector + createSelector:
export const selectDealsState = createFeatureSelector<DealsState>('deals');
export const selectAllDeals = createSelector(selectDealsState, s => s.items);
export const selectDealsLoading = createSelector(selectDealsState, s => s.loading);
export const selectDealsError = createSelector(selectDealsState, s => s.error);
export const selectHasDeals = createSelector(selectAllDeals, items => items.length > 0);
```

### 6. StoreService Facade Pattern

```typescript
// ❌ Flag — component dispatching directly:
export class DealsComponent {
  private readonly store = inject(Store);
  loadDeals() { this.store.dispatch(loadDeals()); }
}

// ✅ Correct — component uses StoreService facade:
export class DealsComponent {
  private readonly dealsStore = inject(DealsStoreService);
  loadDeals() { this.dealsStore.load(); }
  readonly items$ = this.dealsStore.items$;
}
```

### 7. Store Registration Check

```typescript
// ❌ Flag — store not registered in app.config.ts:
// If feature store files exist but no provideState/provideEffects

// ✅ Correct — registered in app.config.ts:
provideState({ name: 'deals', reducer: dealsReducer }),
provideEffects([DealsEffects]),
```

### 8. State Interface Validation

```typescript
// ❌ Flag — missing loading/error properties:
export interface DealsState {
  items: Deal[];
  // No loading or error!
}

// ✅ Correct — complete state shape:
export interface DealsState {
  items:        Deal[];
  selectedItem: Deal | null;
  loading:      boolean;
  saving:       boolean;
  error:        string | null;
}

export const initialDealsState: DealsState = {
  items:        [],
  selectedItem: null,
  loading:      false,
  saving:       false,
  error:        null
};
```

## Output Format

```
NGRX ANALYSIS for {feature} store

✅ PASS: Action names follow [Feature] Verb Noun
✅ PASS: All 6 store files present
✅ PASS: Effects use HttpService
✅ PASS: catchError in every effect
✅ PASS: StoreService facade present
⚠️ WARNING: switchMap used for DELETE on line 45 — use concatMap
⚠️ WARNING: Missing 'saving' property in state interface
❌ VIOLATION: Direct HttpClient used in effects — must use HttpService
❌ VIOLATION: Missing catchError in create$ effect
❌ VIOLATION: Component dispatches directly — must use StoreService
🔒 SECURITY: BFF URL hardcoded in effects — use DFC.RelativePath.*
```

