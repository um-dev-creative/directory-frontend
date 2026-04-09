# Skill: NgRx Unit Test Generation

## Purpose

Generate Karma + Jasmine unit tests for NgRx reducers, effects, selectors, and StoreService facades.

## When to Use

- Testing a new or existing NgRx feature store
- Validating reducer state transitions
- Testing effect side-effects with mocked HttpService
- Verifying selector projections
- Testing StoreService facade dispatch behavior

## Reducer Test Template

```typescript
import { {feature}Reducer } from './{feature}.reducer';
import { initial{Feature}State } from './{feature}.state';
import * as {Feature}Actions from './{feature}.action';

describe('{Feature}Reducer', () => {
  it('should return initial state for unknown action', () => {
    const state = {feature}Reducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initial{Feature}State);
  });

  it('should set loading=true on load action', () => {
    const state = {feature}Reducer(initial{Feature}State, {Feature}Actions.load{Feature}s());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should populate items and clear loading on success', () => {
    const loadingState = { ...initial{Feature}State, loading: true };
    const items = [{ id: '1', name: 'Test' }];
    const state = {feature}Reducer(loadingState, {Feature}Actions.load{Feature}sSuccess({ items } as any));
    expect(state.items).toEqual(items as any);
    expect(state.loading).toBeFalse();
  });

  it('should set error and clear loading on failure', () => {
    const loadingState = { ...initial{Feature}State, loading: true };
    const state = {feature}Reducer(loadingState, {Feature}Actions.load{Feature}sFailure({ error: 'Error!' }));
    expect(state.error).toBe('Error!');
    expect(state.loading).toBeFalse();
  });

  it('should add item on create success', () => {
    const existingState = { ...initial{Feature}State, items: [{ id: '1', name: 'Existing' }] };
    const newItem = { id: '2', name: 'New' };
    const state = {feature}Reducer(existingState as any, {Feature}Actions.create{Feature}Success({ item: newItem as any }));
    expect(state.items.length).toBe(2);
  });

  it('should update item in place on update success', () => {
    const existingState = { ...initial{Feature}State, items: [{ id: '1', name: 'Old' }] };
    const updatedItem = { id: '1', name: 'New' };
    const state = {feature}Reducer(existingState as any, {Feature}Actions.update{Feature}Success({ item: updatedItem as any }));
    expect(state.items[0].name).toBe('New');
  });

  it('should remove item on delete success', () => {
    const existingState = { ...initial{Feature}State, items: [{ id: '1' }, { id: '2' }] };
    const state = {feature}Reducer(existingState as any, {Feature}Actions.delete{Feature}Success({ id: '1' }));
    expect(state.items.length).toBe(1);
    expect(state.items.find((i: any) => i.id === '1')).toBeUndefined();
  });
});
```

## Effects Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { {Feature}Effects } from './{feature}-effects';
import { HttpService } from '@core/services/http.service';
import { NotificationService } from '@core/services/notification.service';
import * as {Feature}Actions from './{feature}.action';

describe('{Feature}Effects', () => {
  let actions$: Observable<any>;
  let effects: {Feature}Effects;
  let httpSpy: jasmine.SpyObj<HttpService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        {Feature}Effects,
        provideMockActions(() => actions$),
        { provide: HttpService, useValue: httpSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });
    effects = TestBed.inject({Feature}Effects);
  });

  describe('load$', () => {
    it('should dispatch success with items on HTTP 200', (done) => {
      const items = [{ id: '1', name: 'Test' }];
      httpSpy.get.and.returnValue(of(items));
      actions$ = of({Feature}Actions.load{Feature}s());

      effects.load$.subscribe(action => {
        expect(action).toEqual({Feature}Actions.load{Feature}sSuccess({ items } as any));
        done();
      });
    });

    it('should dispatch failure on HTTP error', (done) => {
      httpSpy.get.and.returnValue(throwError(() => new Error('Network error')));
      actions$ = of({Feature}Actions.load{Feature}s());

      effects.load$.subscribe(action => {
        expect(action.type).toBe({Feature}Actions.load{Feature}sFailure.type);
        done();
      });
    });
  });

  describe('create$', () => {
    it('should dispatch success on create', (done) => {
      const item = { id: '1', name: 'New' };
      httpSpy.post.and.returnValue(of(item));
      actions$ = of({Feature}Actions.create{Feature}({ data: { name: 'New' } }));

      effects.create$.subscribe(action => {
        expect(action).toEqual({Feature}Actions.create{Feature}Success({ item } as any));
        done();
      });
    });

    it('should dispatch failure on create error', (done) => {
      httpSpy.post.and.returnValue(throwError(() => new Error('Create failed')));
      actions$ = of({Feature}Actions.create{Feature}({ data: { name: 'New' } }));

      effects.create$.subscribe(action => {
        expect(action.type).toBe({Feature}Actions.create{Feature}Failure.type);
        done();
      });
    });
  });
});
```

## Selector Test Template

```typescript
import {
  selectAll{Feature}s,
  select{Feature}Loading,
  select{Feature}Error,
  selectSelected{Feature},
  selectHas{Feature}s
} from './{feature}.selectors';

describe('{Feature} Selectors', () => {
  const mockState = {
    {feature}: {
      items: [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }],
      selectedItem: null,
      loading: false,
      saving: false,
      error: null
    }
  };

  it('should select all items', () => {
    expect(selectAll{Feature}s(mockState as any)).toEqual(mockState.{feature}.items as any);
  });

  it('should select loading state', () => {
    expect(select{Feature}Loading(mockState as any)).toBeFalse();
  });

  it('should select error state', () => {
    expect(select{Feature}Error(mockState as any)).toBeNull();
  });

  it('should select hasItems', () => {
    expect(selectHas{Feature}s(mockState as any)).toBeTrue();
  });

  it('should return false for hasItems when empty', () => {
    const emptyState = { {feature}: { ...mockState.{feature}, items: [] } };
    expect(selectHas{Feature}s(emptyState as any)).toBeFalse();
  });
});
```

## StoreService Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { {Feature}StoreService } from './{feature}-store.service';
import { initial{Feature}State } from './{feature}.state';
import * as {Feature}Actions from './{feature}.action';

describe('{Feature}StoreService', () => {
  let service: {Feature}StoreService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {Feature}StoreService,
        provideMockStore({ initialState: { {feature}: initial{Feature}State } })
      ]
    });
    service = TestBed.inject({Feature}StoreService);
    store   = TestBed.inject<MockStore>(MockStore);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should dispatch load action on load()', () => {
    spyOn(store, 'dispatch');
    service.load();
    expect(store.dispatch).toHaveBeenCalledWith({Feature}Actions.load{Feature}s());
  });

  it('should dispatch create action on create()', () => {
    spyOn(store, 'dispatch');
    const data = { name: 'Test' };
    service.create(data);
    expect(store.dispatch).toHaveBeenCalledWith({Feature}Actions.create{Feature}({ data }));
  });

  it('should dispatch delete action on delete()', () => {
    spyOn(store, 'dispatch');
    service.delete('1');
    expect(store.dispatch).toHaveBeenCalledWith({Feature}Actions.delete{Feature}({ id: '1' }));
  });
});
```

## Coverage Targets

- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

