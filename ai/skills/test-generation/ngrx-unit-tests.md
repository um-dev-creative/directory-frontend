# Skill: NgRx Unit Tests

## Purpose

Generate Karma + Jasmine unit tests for NgRx reducers, effects, selectors, and StoreService facades.

## Reducer Tests

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
    const state = {feature}Reducer(loadingState, {Feature}Actions.load{Feature}sSuccess({ items }));
    expect(state.items).toEqual(items);
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
    const state = {feature}Reducer(existingState, {Feature}Actions.create{Feature}Success({ item: newItem as any }));
    expect(state.items.length).toBe(2);
    expect(state.items).toContain(newItem as any);
  });

  it('should update item in place on update success', () => {
    const existingState = {
      ...initial{Feature}State,
      items: [{ id: '1', name: 'Old Name' }]
    };
    const updatedItem = { id: '1', name: 'New Name' };
    const state = {feature}Reducer(existingState, {Feature}Actions.update{Feature}Success({ item: updatedItem as any }));
    expect(state.items[0].name).toBe('New Name');
  });

  it('should remove item on delete success', () => {
    const existingState = {
      ...initial{Feature}State,
      items: [{ id: '1' }, { id: '2' }]
    };
    const state = {feature}Reducer(existingState, {Feature}Actions.delete{Feature}Success({ id: '1' }));
    expect(state.items.length).toBe(1);
    expect(state.items.find(i => i.id === '1')).toBeUndefined();
  });
});
```

## Effects Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { {Feature}Effects } from './{feature}-effects';
import { HttpService } from '@core/services/http.service';
import { NotificationService } from '@core/services/notification.service';

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

  describe('load{Feature}s$', () => {
    it('should dispatch success with items on HTTP 200', (done) => {
      const items = [{ id: '1', name: 'Test' }];
      httpSpy.get.and.returnValue(of(items));
      actions$ = of({Feature}Actions.load{Feature}s());

      effects.load{Feature}s$.subscribe(action => {
        expect(action).toEqual({Feature}Actions.load{Feature}sSuccess({ items }));
        done();
      });
    });

    it('should dispatch failure on HTTP error', (done) => {
      httpSpy.get.and.returnValue(throwError(() => new Error('Network error')));
      actions$ = of({Feature}Actions.load{Feature}s());

      effects.load{Feature}s$.subscribe(action => {
        expect(action.type).toBe({Feature}Actions.load{Feature}sFailure.type);
        done();
      });
    });
  });
});
```

## Selector Tests

```typescript
import {
  selectAll{Feature}s,
  select{Feature}Loading,
  select{Feature}Error
} from './{feature}.selectors';

describe('{Feature} Selectors', () => {
  const mockState = {
    {feature}: {
      items: [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }],
      loading: false,
      error: null,
      selectedItem: null
    }
  };

  it('should select all items', () => {
    expect(selectAll{Feature}s(mockState)).toEqual(mockState.{feature}.items);
  });

  it('should select loading state', () => {
    expect(select{Feature}Loading(mockState)).toBeFalse();
  });

  it('should select error state', () => {
    expect(select{Feature}Error(mockState)).toBeNull();
  });
});
```

## StoreService Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { {Feature}StoreService } from './{feature}-store.service';

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
    store = TestBed.inject<MockStore>(MockStore);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should dispatch load action on load()', () => {
    spyOn(store, 'dispatch');
    service.load();
    expect(store.dispatch).toHaveBeenCalledWith({Feature}Actions.load{Feature}s());
  });
});
```

