# Skill: Angular Unit Test Generation

## Purpose

Generate Karma + Jasmine unit tests for Angular 20 standalone components, services, guards, and interceptors following Directory Frontend testing conventions.

## When to Use

- Creating tests for new or existing components
- Creating tests for services that use HttpService
- Creating tests for guards and interceptors
- Validating component input/output behavior

## Test Command

```bash
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox
```

## Non-Negotiable Rules

```
✅ ALWAYS co-locate spec files: my.component.spec.ts next to my.component.ts
✅ ALWAYS mock ALL external dependencies (HttpService, Store, services)
✅ ALWAYS use TranslateModule.forRoot() for components with translations
✅ ALWAYS use MockStore from @ngrx/store/testing for store-dependent code
✅ ALWAYS follow AAA pattern: Arrange → Act → Assert
❌ NEVER make real HTTP calls in tests
❌ NEVER import real AuthService in unrelated tests
❌ NEVER use raw HttpClient in test providers
```

## Mock Patterns

```typescript
// HttpService
const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete', 'patch']);
providers: [{ provide: HttpService, useValue: httpSpy }]

// NgRx MockStore
import { MockStore, provideMockStore } from '@ngrx/store/testing';
providers: [provideMockStore({ initialState: { feature: initialFeatureState } })]

// StorageMockService
const storageSpy = jasmine.createSpyObj('StorageMockService', ['getLocal', 'setLocal', 'removeLocal']);

// LoggerService
const loggerSpy = jasmine.createSpyObj('LoggerService', ['info', 'warn', 'error']);

// NotificationService
const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'info']);

// Router
const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

// ActivatedRoute
const activatedRouteMock = { snapshot: { params: { id: '1' } }, params: of({ id: '1' }) };
```

## Component Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { {Name}Component } from './{name}.component';

describe('{Name}Component', () => {
  let component: {Name}Component;
  let fixture: ComponentFixture<{Name}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [{Name}Component, TranslateModule.forRoot()],
      providers: [
        { provide: SomeService, useValue: jasmine.createSpyObj('SomeService', ['method']) }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent({Name}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should show skeleton when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
  });

  it('should render items when loaded', () => {
    fixture.componentRef.setInput('items', [{ id: '1', name: 'Test' }]);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.item');
    expect(items.length).toBe(1);
  });

  it('should show empty state when no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
  });
});
```

## Signal-Based Input Testing

```typescript
it('should reflect input change via signal', () => {
  fixture.componentRef.setInput('items', [{ id: '1', name: 'Test' }]);
  fixture.detectChanges();
  const items = fixture.nativeElement.querySelectorAll('.item');
  expect(items.length).toBe(1);
});
```

## Output Testing

```typescript
it('should emit event on user action', () => {
  const item = { id: '1', name: 'Test Item' };
  spyOn(component.itemSelected, 'emit');

  const button = fixture.nativeElement.querySelector('[data-testid="select-btn"]');
  button.click();
  fixture.detectChanges();

  expect(component.itemSelected.emit).toHaveBeenCalled();
});
```

## Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { {Feature}Service } from './{feature}.service';
import { HttpService } from '@core/services/http.service';
import { DFC } from '@shared/constants/app.const';

describe('{Feature}Service', () => {
  let service: {Feature}Service;
  let httpSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete', 'patch']);

    TestBed.configureTestingModule({
      providers: [
        {Feature}Service,
        { provide: HttpService, useValue: httpSpy }
      ]
    });
    service = TestBed.inject({Feature}Service);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should call correct endpoint on getAll', () => {
    const mockData = [{ id: '1', name: 'Test' }];
    httpSpy.get.and.returnValue(of(mockData));

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    expect(httpSpy.get).toHaveBeenCalledWith(DFC.RelativePath.{FEATURE}_PATH);
  });

  it('should handle HTTP errors', () => {
    httpSpy.get.and.returnValue(throwError(() => new Error('Network error')));

    service.getAll().subscribe({
      next: () => fail('Expected error'),
      error: (err) => expect(err.message).toBe('Network error')
    });
  });
});
```

## Guard Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { SessionStoreService } from '@core/store/session/session-store.service';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let sessionStoreSpy: jasmine.SpyObj<SessionStoreService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    sessionStoreSpy = jasmine.createSpyObj('SessionStoreService', [], {
      sessionData$: of({ userAuth: { sessionToken: 'valid-token' } })
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SessionStoreService, useValue: sessionStoreSpy }
      ]
    });
  });

  it('should allow navigation when authenticated', () => {
    // Test guard logic
  });

  it('should redirect to /auth when not authenticated', () => {
    // Test redirect logic
  });
});
```

## Coverage Targets

- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

