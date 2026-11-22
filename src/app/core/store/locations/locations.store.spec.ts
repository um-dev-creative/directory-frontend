import {TestBed} from '@angular/core/testing';
import {Actions} from '@ngrx/effects';
import {Action, Store, provideStore} from '@ngrx/store';
import {of, ReplaySubject, throwError} from 'rxjs';
import {LocationClient} from '@core/services/location/location.client';
import {City, Location} from '@shared/models/location.model';
import {
  clearLocations,
  createLocation,
  deleteLocation,
  loadLocations,
  loadLocationsFailure,
  loadLocationsSuccess,
  saveLocationFailure,
  saveLocationSuccess,
  updateLocation
} from './locations.actions';
import {LocationsEffects} from './locations.effects';
import {locationsReducer} from './locations.reducer';
import {LocationsStoreService} from './locations-store.service';
import {initialLocationsState} from './locations.state';
import {selectMainLocation} from './locations.selectors';

const city: City = {id: 'c1', name: 'Toronto', province: 'Ontario', country: 'CA'};
const main = {id: 'l1', businessId: 'b1', city, main: true, addressLine: '1 Main St'} as Location;
const other = {id: 'l2', businessId: 'b1', city, main: false, addressLine: '2 Side St'} as Location;

describe('locations reducer', () => {
  it('starts loading for a business', () => {
    const state = locationsReducer(initialLocationsState, loadLocations({businessId: 'b1'}));
    expect(state.businessId).toBe('b1');
    expect(state.isLoading).toBeTrue();
  });

  it('keeps the list while it reloads the same business and drops it for another one', () => {
    const loaded = locationsReducer(locationsReducer(initialLocationsState, loadLocations({businessId: 'b1'})),
      loadLocationsSuccess({locations: [main]}));
    expect(locationsReducer(loaded, loadLocations({businessId: 'b1'})).locations).toEqual([main]);
    expect(locationsReducer(loaded, loadLocations({businessId: 'b2'})).locations).toEqual([]);
  });

  it('stores the locations and reports a failure to load them', () => {
    const loaded = locationsReducer(initialLocationsState, loadLocationsSuccess({locations: [main, other]}));
    expect(loaded.locations).toEqual([main, other]);
    expect(loaded.isLoading).toBeFalse();
    const failed = locationsReducer(loaded, loadLocationsFailure({error: 'down'}));
    expect(failed.error).toBe('down');
    expect(failed.isLoading).toBeFalse();
  });

  it('marks the store as saving during a create, update or delete and records the outcome', () => {
    for (const action of [
      createLocation({businessId: 'b1', request: {cityId: 'c1', addressLine: 'x'}}),
      updateLocation({businessId: 'b1', locationId: 'l1', request: {main: true}}),
      deleteLocation({businessId: 'b1', locationId: 'l1'})
    ]) {
      const saving = locationsReducer({...initialLocationsState, error: 'old'}, action);
      expect(saving.isSaving).toBeTrue();
      expect(saving.error).toBeNull();
      expect(locationsReducer(saving, saveLocationSuccess({businessId: 'b1'})).isSaving).toBeFalse();
      const failed = locationsReducer(saving, saveLocationFailure({error: 'forbidden'}));
      expect(failed.isSaving).toBeFalse();
      expect(failed.error).toBe('forbidden');
    }
  });

  it('is emptied by clearLocations', () => {
    const loaded = locationsReducer(initialLocationsState, loadLocationsSuccess({locations: [main]}));
    expect(locationsReducer(loaded, clearLocations())).toEqual(initialLocationsState);
  });
});

describe('locations selectors', () => {
  it('finds the main location', () => {
    expect(selectMainLocation({locations: {...initialLocationsState, locations: [other, main]}})).toEqual(main);
    expect(selectMainLocation({locations: {...initialLocationsState, locations: [other]}})).toBeNull();
  });
});

describe('LocationsEffects', () => {
  let actions$: ReplaySubject<Action>;
  let client: jasmine.SpyObj<LocationClient>;
  let effects: LocationsEffects;

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    client = jasmine.createSpyObj('LocationClient', ['list', 'create', 'update', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        LocationsEffects,
        {provide: Actions, useValue: new Actions(actions$)},
        {provide: LocationClient, useValue: client}
      ]
    });
    effects = TestBed.inject(LocationsEffects);
  });

  it('loads the locations', (done) => {
    client.list.and.returnValue(of([main]));
    effects.loadLocations$.subscribe((action) => {
      expect(action).toEqual(loadLocationsSuccess({locations: [main]}));
      expect(client.list).toHaveBeenCalledWith('b1');
      done();
    });
    actions$.next(loadLocations({businessId: 'b1'}));
  });

  it('reports a failure to load', (done) => {
    client.list.and.returnValue(throwError(() => ({message: 'down'})));
    effects.loadLocations$.subscribe((action) => {
      expect(action).toEqual(loadLocationsFailure({error: 'down'}));
      done();
    });
    actions$.next(loadLocations({businessId: 'b1'}));
  });

  it('creates a location and signals success', (done) => {
    client.create.and.returnValue(of(main));
    effects.createLocation$.subscribe((action) => {
      expect(action).toEqual(saveLocationSuccess({businessId: 'b1'}));
      expect(client.create).toHaveBeenCalledWith('b1', {cityId: 'c1', addressLine: 'x'});
      done();
    });
    actions$.next(createLocation({businessId: 'b1', request: {cityId: 'c1', addressLine: 'x'}}));
  });

  it('reports a failure to create', (done) => {
    client.create.and.returnValue(throwError(() => ({message: 'forbidden'})));
    effects.createLocation$.subscribe((action) => {
      expect(action).toEqual(saveLocationFailure({error: 'forbidden'}));
      done();
    });
    actions$.next(createLocation({businessId: 'b1', request: {cityId: 'c1', addressLine: 'x'}}));
  });

  it('updates a location and signals success', (done) => {
    client.update.and.returnValue(of(other));
    effects.updateLocation$.subscribe((action) => {
      expect(action).toEqual(saveLocationSuccess({businessId: 'b1'}));
      expect(client.update).toHaveBeenCalledWith('b1', 'l2', {main: true});
      done();
    });
    actions$.next(updateLocation({businessId: 'b1', locationId: 'l2', request: {main: true}}));
  });

  it('reports a failure to update with a default message', (done) => {
    client.update.and.returnValue(throwError(() => ({})));
    effects.updateLocation$.subscribe((action) => {
      expect(action).toEqual(saveLocationFailure({error: 'Could not save the location'}));
      done();
    });
    actions$.next(updateLocation({businessId: 'b1', locationId: 'l2', request: {main: true}}));
  });

  it('deletes a location and signals success', (done) => {
    client.delete.and.returnValue(of(undefined));
    effects.deleteLocation$.subscribe((action) => {
      expect(action).toEqual(saveLocationSuccess({businessId: 'b1'}));
      expect(client.delete).toHaveBeenCalledWith('b1', 'l1');
      done();
    });
    actions$.next(deleteLocation({businessId: 'b1', locationId: 'l1'}));
  });

  it('reports a failure to delete with a default message', (done) => {
    client.delete.and.returnValue(throwError(() => ({})));
    effects.deleteLocation$.subscribe((action) => {
      expect(action).toEqual(saveLocationFailure({error: 'Could not delete the location'}));
      done();
    });
    actions$.next(deleteLocation({businessId: 'b1', locationId: 'l1'}));
  });

  it('reloads the list after any save, because the backend may have moved the main location', (done) => {
    effects.reloadAfterSave$.subscribe((action) => {
      expect(action).toEqual(loadLocations({businessId: 'b1'}));
      done();
    });
    actions$.next(saveLocationSuccess({businessId: 'b1'}));
  });
});

describe('LocationsStoreService', () => {
  it('dispatches the actions of the store', () => {
    TestBed.configureTestingModule({providers: [provideStore({locations: locationsReducer})]});
    const store = TestBed.inject(Store);
    const dispatch = spyOn(store, 'dispatch').and.callThrough();
    const service = TestBed.inject(LocationsStoreService);

    service.load('b1');
    service.create('b1', {cityId: 'c1', addressLine: 'x'});
    service.update('b1', 'l1', {main: true});
    service.remove('b1', 'l1');
    service.clear();

    expect(dispatch.calls.allArgs().map(([action]) => (action as unknown as { type: string }).type)).toEqual([
      '[Locations] Load locations',
      '[Locations] Create location',
      '[Locations] Update location',
      '[Locations] Delete location',
      '[Locations] Clear locations'
    ]);
  });

  it('exposes the state as streams', (done) => {
    TestBed.configureTestingModule({providers: [provideStore({locations: locationsReducer})]});
    const service = TestBed.inject(LocationsStoreService);
    service.load('b1');
    service.isLoading$.subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });
});
