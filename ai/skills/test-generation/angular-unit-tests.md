# Skill: Angular Unit Tests

## Purpose

Generate and validate Karma + Jasmine unit tests for Angular 20 standalone components, services, guards, and interceptors.

## Test Setup Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { {ComponentName} } from './{component-name}.component';

describe('{ComponentName}', () => {
  let component: {ComponentName};
  let fixture: ComponentFixture<{ComponentName}>;

  // Mock services
  const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);
  const loggerSpy = jasmine.createSpyObj('LoggerService', ['info', 'warn', 'error']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        {ComponentName},
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: HttpService, useValue: httpSpy },
        { provide: LoggerService, useValue: loggerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent({ComponentName});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Input Testing (Signal-Based)

```typescript
it('should reflect input change', () => {
  fixture.componentRef.setInput('items', [{ id: '1', name: 'Test' }]);
  fixture.detectChanges();
  const items = fixture.nativeElement.querySelectorAll('.item');
  expect(items.length).toBe(1);
});

it('should show loading skeleton', () => {
  fixture.componentRef.setInput('loading', true);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
  expect(fixture.nativeElement.querySelector('.content')).toBeNull();
});
```

## Output Testing

```typescript
it('should emit event on action', () => {
  const item = { id: '1', name: 'Test Item' };
  spyOn(component.itemSelected, 'emit');

  const button = fixture.nativeElement.querySelector('[data-testid="select-btn"]');
  button.click();
  fixture.detectChanges();

  expect(component.itemSelected.emit).toHaveBeenCalled();
});
```

## Service Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { {Service}Service } from './{service}.service';
import { HttpService } from '@core/services/http.service';

describe('{Service}Service', () => {
  let service: {Service}Service;
  let httpSpy: jasmine.SpyObj<HttpService>;

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

  it('should call correct endpoint on getAll', () => {
    const mockData = [{ id: '1' }];
    httpSpy.get.and.returnValue(of(mockData));

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    expect(httpSpy.get).toHaveBeenCalledWith(DFC.RelativePath.SOME_PATH);
  });

  it('should handle HTTP error gracefully', () => {
    httpSpy.get.and.returnValue(throwError(() => new Error('Network error')));

    service.getAll().subscribe({
      next: () => fail('Expected error'),
      error: (err) => expect(err.message).toBe('Network error')
    });
  });
});
```

## Guard Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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
});
```

