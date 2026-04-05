---
mode: agent
description: Generate unit tests for any Angular component, service, NgRx store, or BFF controller
tools:
  - codebase
  - editFiles
---

# Generate Unit Tests

> This prompt activates the **Tester Agent**.
> Full agent definition: [agent.md](../ai/agents/tester/agent.md)
> Skills applied:
> - [angular-unit-tests.md](../ai/skills/test-generation/angular-unit-tests.md)
> - [ngrx-unit-tests.md](../ai/skills/test-generation/ngrx-unit-tests.md)
>
> Security constraints: [security-policy.md](../ai/config/security-policy.md)

---

## Instructions

Generate comprehensive unit tests for the specified file. Always co-locate the spec file next to the source file.

### Test Command

```bash
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox
```

### Rules

```
NEVER make real HTTP calls in unit tests
ALWAYS mock HttpService with jasmine.createSpyObj
ALWAYS use MockStore for NgRx Store
ALWAYS use TranslateModule.forRoot() for components with translations
ALWAYS co-locate spec files next to source files
```

### Mocking Patterns

```typescript
// HttpService mock
const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);
providers: [{ provide: HttpService, useValue: httpSpy }]

// NgRx MockStore
import { MockStore, provideMockStore } from '@ngrx/store/testing';
providers: [provideMockStore({ initialState: { feature: initialState } })]

// StorageMockService mock
const storageSpy = jasmine.createSpyObj('StorageMockService', ['getLocal', 'setLocal', 'removeLocal']);
storageSpy.getLocal.and.returnValue(null);
```

### Test Structure (AAA)

```typescript
it('should do something specific', () => {
  // Arrange
  const expected = ...;
  spy.method.and.returnValue(of(expected));

  // Act
  component.someMethod();

  // Assert
  expect(spy.method).toHaveBeenCalled();
  expect(component.result()).toEqual(expected);
});
```

### Coverage Targets

- Statements: 80%+ · Branches: 75%+ · Functions: 80%+ · Lines: 80%+
