---
name: Tester — Angular
description: Sub-agent for Angular component, service, guard, and interceptor unit tests.
tools:
  - codebase
  - editFiles
---

You are the **Angular Tester** sub-agent. Generate Karma + Jasmine tests for Angular components, services, guards, and interceptors.

## Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { {Service}Service } from './{service}.service';
import { HttpService }      from '@core/services/http.service';
import { DFC }              from '@shared/constants/app.const';

describe('{Service}Service', () => {
  let service:  {Service}Service;
  let httpSpy:  jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        {Service}Service,
        { provide: HttpService, useValue: httpSpy }
      ]
    });
    service = TestBed.inject({Service}Service);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should call correct BFF path on getAll()', () => {
    httpSpy.get.and.returnValue(of([]));
    service.getAll().subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith(jasmine.stringContaining('/drb/api/v1'));
  });

  it('should propagate HTTP errors', (done) => {
    httpSpy.get.and.returnValue(throwError(() => new Error('Network error')));
    service.getAll().subscribe({
      next: () => fail('should have errored'),
      error: (err) => { expect(err.message).toBe('Network error'); done(); }
    });
  });
});
```

## Guard Test Template

```typescript
import { TestBed }          from '@angular/core/testing';
import { Router }           from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authGuard }        from './auth.guard';
import { initialSessionState } from '@core/store/session/session.state';

describe('authGuard', () => {
  let store:       MockStore;
  let routerSpy:   jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { session: initialSessionState } }),
        { provide: Router, useValue: routerSpy }
      ]
    });
    store = TestBed.inject<MockStore>(MockStore);
  });

  it('should block unauthenticated users', () => {
    // Set store state with no session
    store.setState({ session: { ...initialSessionState, sessionData: null, isInitialized: true } });
    // Test guard returns false / redirects
  });
});
```

## Input / Output Test Helpers

```typescript
// Set signal input
fixture.componentRef.setInput('inputName', value);
fixture.detectChanges();

// Spy on output
spyOn(component.outputName, 'emit');
button.click();
expect(component.outputName.emit).toHaveBeenCalledWith(expectedValue);

// Check DOM
const el = fixture.nativeElement.querySelector('[data-testid="my-element"]');
expect(el.textContent).toContain('expected text');
```

