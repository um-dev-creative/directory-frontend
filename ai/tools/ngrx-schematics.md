# Tool: NgRx Schematics

## Purpose

Reference for NgRx-related scaffolding, registration, and DevTools integration used by the NgRx agent.

## Store Registration (`src/app/app.config.ts`)

```typescript
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Existing session store
    provideStore({ session: sessionReducer }),
    provideEffects([SessionEffects]),

    // NEW FEATURE — add below:
    provideState({ name: '{feature}', reducer: {feature}Reducer }),
    provideEffects([{Feature}Effects]),

    // DevTools (dev only)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true
    })
  ]
};
```

## Packages

```bash
# NgRx core (already installed)
@ngrx/store@20
@ngrx/effects@20
@ngrx/store-devtools@20

# Install with pnpm (not npm)
pnpm add @ngrx/store @ngrx/effects @ngrx/store-devtools
```

## TypeScript Strict Mode Considerations

With `strict: true` in tsconfig:

```typescript
// Use explicit typing for props
export const myAction = createAction(
  '[Feature] My action',
  props<{ id: string; data: MyModel }>()  // Explicit types required
);

// Use `as const` for action type checking
const action = {Feature}Actions.loadItems();
// action.type is '[Feature] Load items' (literal type)
```

## NgRx DevTools (Browser Extension)

1. Install "Redux DevTools" Chrome extension
2. With `provideStoreDevtools` configured, state is visible in browser DevTools
3. `DEBUG_MODE=true` → full action/state logging enabled

## Feature State Key Naming

```typescript
// The feature name passed to provideState must match createFeatureSelector:
provideState({ name: 'partner', reducer: partnerReducer })
// Matches:
createFeatureSelector<PartnerState>('partner')
```

## Testing Utilities

```bash
# Always import MockStore from:
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
```

