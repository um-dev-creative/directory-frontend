# Tester Agent

## Role

Specialist agent for generating and reviewing unit tests for all layers of the Directory Frontend project: Angular components, NgRx stores, services, and BFF controllers.

## Scope

| Layer | Test Framework | Location |
|---|---|---|
| Angular Components | Karma + Jasmine | Co-located `.spec.ts` |
| NgRx Reducers | Karma + Jasmine | Co-located `.spec.ts` |
| NgRx Effects | Karma + Jasmine + `provideMockActions` | Co-located `.spec.ts` |
| Core Services | Karma + Jasmine | Co-located `.spec.ts` |
| BFF Controllers | Jest / Node assert | `test/` folder |

## Skills Used

- `skills/test-generation/angular-unit-tests.md`
- `skills/test-generation/ngrx-unit-tests.md`

## Copilot Chat

Use `#gen-unit-test` to invoke this agent.

## Test Command

```bash
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox
```

## Rules

```
NEVER make real HTTP calls in unit tests
ALWAYS mock HttpService with jasmine.createSpyObj
ALWAYS use MockStore for NgRx Store
ALWAYS use TranslateModule.forRoot() for components with translations
ALWAYS co-locate spec files next to source files
NEVER import real AuthService in unrelated component tests
```

## Mocking Patterns

### Mock HttpService

```typescript
const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete', 'patch']);
providers: [{ provide: HttpService, useValue: httpSpy }]
```

### Mock Store (NgRx)

```typescript
import { MockStore, provideMockStore } from '@ngrx/store/testing';

providers: [
  provideMockStore({ initialState: { session: initialSessionState } })
]
// Then in test:
const store = TestBed.inject<MockStore>(MockStore);
store.dispatch(SomeActions.someAction());
store.setState({ session: { ...newState } });
```

### Mock StorageMockService

```typescript
const storageSpy = jasmine.createSpyObj('StorageMockService', ['getLocal', 'setLocal', 'removeLocal']);
storageSpy.getLocal.and.returnValue(null);
providers: [{ provide: StorageMockService, useValue: storageSpy }]
```

### Mock TranslateService

```typescript
import { TranslateModule } from '@ngx-translate/core';
imports: [TranslateModule.forRoot()]
// TranslateModule.forRoot() with no loader returns keys as-is — safe for tests
```

## Coverage Targets

Minimum thresholds are configured in `karma.conf.js`. Do not lower them.
Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Test Structure (AAA Pattern)

```typescript
it('should do something specific', () => {
  // Arrange — set up state and spies
  const expectedResult = ...;
  spy.method.and.returnValue(of(expectedResult));

  // Act — call the method under test
  component.someMethod();

  // Assert — verify outcomes
  expect(spy.method).toHaveBeenCalledWith(expectedArg);
  expect(component.someSignal()).toEqual(expectedResult);
});
```

