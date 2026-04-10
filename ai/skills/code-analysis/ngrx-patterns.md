# Skill: NgRx Code Analysis

## Purpose

Analyze NgRx 20 store code in the Directory Frontend project for pattern correctness, naming conventions, and architectural compliance.

## Analysis Dimensions

### 1. Action Naming Convention

```typescript
// ❌ Flag these:
export const LOAD = createAction('load');
export const fetchData = createAction('fetchData');
export const getData = createAction('get data');

// ✅ Correct: [Feature] Verb Noun
export const loadDeals = createAction('[Deals] Load deals');
export const loadDealsSuccess = createAction('[Deals] Load deals success', props<{ items: Deal[] }>());
export const loadDealsFailure = createAction('[Deals] Load deals failure', props<{ error: string }>());
```

### 2. Feature Store File Structure

Every feature store must have ALL 6 files:

```
src/app/core/store/{feature}/
├── {feature}.state.ts        ← interface + initialState
├── {feature}.action.ts       ← createAction() definitions
├── {feature}.reducer.ts      ← on() handlers
├── {feature}-effects.ts      ← createEffect() side-effects
├── {feature}.selectors.ts    ← createSelector() projectors
└── {feature}-store.service.ts ← StoreService facade
```

Flag if any file is missing.

### 3. Effects Analysis

```typescript
// ❌ Flag — raw HttpClient in effects:
switchMap(() => this.http.get<Deal[]>('https://...'))

// ❌ Flag — switchMap on mutations (cancellation risk):
switchMap(({ id }) => this.http.delete(`/drb/api/v1/deals/${id}`))

// ✅ Correct — HttpService + switchMap for reads:
switchMap(() => this.http.get<Deal[]>(DFC.RelativePath.DEALS_PATH).pipe(...))

// ✅ Correct — concatMap for mutations:
concatMap(({ id }) => this.http.delete<void>(`${DFC.RelativePath.DEALS_PATH}/${id}`).pipe(...))
```

### 4. Selector Analysis

```typescript
// ❌ Flag — selector without createFeatureSelector:
export const selectDeals = (state: AppState) => state.deals.items;

// ✅ Correct:
export const selectDealsState = createFeatureSelector<DealsState>('deals');
export const selectAllDeals = createSelector(selectDealsState, s => s.items);
```

### 5. StoreService Facade Pattern

```typescript
// ❌ Flag — component dispatching directly:
export class DealsComponent {
  private readonly store = inject(Store);
  loadDeals() { this.store.dispatch(loadDeals()); }  // Don't dispatch from component
}

// ✅ Correct — component uses StoreService:
export class DealsComponent {
  private readonly dealsStore = inject(DealsStoreService);
  loadDeals() { this.dealsStore.load(); }
}
```

### 6. Error Handling in Effects

```typescript
// ❌ Flag — missing catchError:
switchMap(() => this.http.get<Deal[]>(path).pipe(
  map(items => loadDealsSuccess({ items }))
  // No catchError!
))

// ✅ Correct:
switchMap(() => this.http.get<Deal[]>(path).pipe(
  map(items => loadDealsSuccess({ items })),
  catchError(err => of(loadDealsFailure({ error: err.message })))
))
```

## Output Format

```
NGRX ANALYSIS for {feature} store

✅ PASS: Action names follow [Feature] Verb Noun
✅ PASS: All 6 store files present
⚠️ WARNING: switchMap used for DELETE on line 45 — use concatMap
❌ VIOLATION: Direct HttpClient used in effects — must use HttpService
❌ VIOLATION: Missing catchError in load$ effect
```

