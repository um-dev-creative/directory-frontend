import {TestBed} from '@angular/core/testing';
import {Actions} from '@ngrx/effects';
import {Action, Store, provideStore} from '@ngrx/store';
import {of, ReplaySubject, throwError} from 'rxjs';
import {BusinessSearchClient} from '@core/services/business/business-search.client';
import {CityClient} from '@core/services/city/city.client';
import {BusinessSearchResponse, City} from '@shared/models/location.model';
import {
  clearBusinessSearch,
  loadCities,
  loadCitiesFailure,
  loadCitiesSuccess,
  searchBusinesses,
  searchBusinessesFailure,
  searchBusinessesSuccess
} from './business-search.actions';
import {BusinessSearchEffects} from './business-search.effects';
import {businessSearchReducer} from './business-search.reducer';
import {BusinessSearchStoreService} from './business-search-store.service';
import {initialBusinessSearchState} from './business-search.state';
import {
  selectHasNextPage,
  selectHasPreviousPage,
  selectSearchIsEmpty
} from './business-search.selectors';

const city: City = {id: 'c1', name: 'Toronto', province: 'Ontario', country: 'CA'};
const response: BusinessSearchResponse = {total_count: 25, page: 2, per_page: 10, total_pages: 3, data: []};

describe('business search reducer', () => {
  it('starts a search with its filters and clears the previous error', () => {
    const failed = businessSearchReducer(initialBusinessSearchState, searchBusinessesFailure({error: 'x'}));
    const state = businessSearchReducer(failed, searchBusinesses({params: {q: 'pan'}}));
    expect(state.isSearching).toBeTrue();
    expect(state.searchError).toBeNull();
    expect(state.params).toEqual({q: 'pan'});
  });

  it('stores a page of results', () => {
    const state = businessSearchReducer(initialBusinessSearchState, searchBusinessesSuccess({response}));
    expect(state.totalCount).toBe(25);
    expect(state.page).toBe(2);
    expect(state.perPage).toBe(10);
    expect(state.totalPages).toBe(3);
    expect(state.isSearching).toBeFalse();
  });

  it('tolerates a page without data', () => {
    const state = businessSearchReducer(initialBusinessSearchState,
      searchBusinessesSuccess({response: {...response, data: undefined as never}}));
    expect(state.results).toEqual([]);
  });

  it('empties the results on a failure', () => {
    const withResults = businessSearchReducer(initialBusinessSearchState, searchBusinessesSuccess({response}));
    const state = businessSearchReducer(withResults, searchBusinessesFailure({error: 'down'}));
    expect(state.results).toEqual([]);
    expect(state.totalCount).toBe(0);
    expect(state.searchError).toBe('down');
  });

  it('keeps the cities when the search is cleared', () => {
    let state = businessSearchReducer(initialBusinessSearchState, loadCitiesSuccess({cities: [city]}));
    state = businessSearchReducer(state, searchBusinessesSuccess({response}));
    state = businessSearchReducer(state, clearBusinessSearch());
    expect(state.cities).toEqual([city]);
    expect(state.results).toEqual([]);
    expect(state.params).toEqual({});
  });

  it('tracks the loading of the cities', () => {
    let state = businessSearchReducer(initialBusinessSearchState, loadCities());
    expect(state.isLoadingCities).toBeTrue();
    state = businessSearchReducer(state, loadCitiesFailure({error: 'no'}));
    expect(state.isLoadingCities).toBeFalse();
    expect(state.citiesError).toBe('no');
    state = businessSearchReducer(state, loadCitiesSuccess({cities: [city]}));
    expect(state.citiesError).toBeNull();
  });
});

describe('business search selectors', () => {
  const root = (search: typeof initialBusinessSearchState) => ({businessSearch: search});

  it('says "empty" only after a search without results', () => {
    expect(selectSearchIsEmpty(root(initialBusinessSearchState))).toBeFalse();
    const searched = {...initialBusinessSearchState, params: {q: 'x'}};
    expect(selectSearchIsEmpty(root(searched))).toBeTrue();
    expect(selectSearchIsEmpty(root({...searched, isSearching: true}))).toBeFalse();
    expect(selectSearchIsEmpty(root({...searched, searchError: 'e'}))).toBeFalse();
    expect(selectSearchIsEmpty(root({...searched, totalCount: 3}))).toBeFalse();
  });

  it('knows whether there are previous and next pages', () => {
    const middle = {...initialBusinessSearchState, page: 2, totalPages: 3};
    expect(selectHasPreviousPage(root(middle))).toBeTrue();
    expect(selectHasNextPage(root(middle))).toBeTrue();
    expect(selectHasPreviousPage(root({...middle, page: 1}))).toBeFalse();
    expect(selectHasNextPage(root({...middle, page: 3}))).toBeFalse();
  });
});

describe('BusinessSearchEffects', () => {
  let actions$: ReplaySubject<Action>;
  let searchClient: jasmine.SpyObj<BusinessSearchClient>;
  let cityClient: jasmine.SpyObj<CityClient>;
  let effects: BusinessSearchEffects;

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    searchClient = jasmine.createSpyObj('BusinessSearchClient', ['search']);
    cityClient = jasmine.createSpyObj('CityClient', ['getCities']);
    TestBed.configureTestingModule({
      providers: [
        BusinessSearchEffects,
        {provide: Actions, useValue: new Actions(actions$)},
        {provide: BusinessSearchClient, useValue: searchClient},
        {provide: CityClient, useValue: cityClient}
      ]
    });
    effects = TestBed.inject(BusinessSearchEffects);
  });

  it('turns a search into a success action', (done) => {
    searchClient.search.and.returnValue(of(response));
    effects.searchBusinesses$.subscribe((action) => {
      expect(action).toEqual(searchBusinessesSuccess({response}));
      expect(searchClient.search).toHaveBeenCalledWith({q: 'pan'});
      done();
    });
    actions$.next(searchBusinesses({params: {q: 'pan'}}));
  });

  it('turns a failed search into a failure action with the message', (done) => {
    searchClient.search.and.returnValue(throwError(() => ({message: 'down'})));
    effects.searchBusinesses$.subscribe((action) => {
      expect(action).toEqual(searchBusinessesFailure({error: 'down'}));
      done();
    });
    actions$.next(searchBusinesses({params: {}}));
  });

  it('uses a default message when the error has none', (done) => {
    searchClient.search.and.returnValue(throwError(() => ({})));
    effects.searchBusinesses$.subscribe((action) => {
      expect(action).toEqual(searchBusinessesFailure({error: 'Search failed'}));
      done();
    });
    actions$.next(searchBusinesses({params: {}}));
  });

  it('loads the cities', (done) => {
    cityClient.getCities.and.returnValue(of([city]));
    effects.loadCities$.subscribe((action) => {
      expect(action).toEqual(loadCitiesSuccess({cities: [city]}));
      done();
    });
    actions$.next(loadCities());
  });

  it('reports a failure to load the cities', (done) => {
    cityClient.getCities.and.returnValue(throwError(() => ({message: 'no cities'})));
    effects.loadCities$.subscribe((action) => {
      expect(action).toEqual(loadCitiesFailure({error: 'no cities'}));
      done();
    });
    actions$.next(loadCities());
  });
});

describe('BusinessSearchStoreService', () => {
  it('dispatches the actions of the store', () => {
    TestBed.configureTestingModule({providers: [provideStore({businessSearch: businessSearchReducer})]});
    const store = TestBed.inject(Store);
    const dispatch = spyOn(store, 'dispatch').and.callThrough();
    const service = TestBed.inject(BusinessSearchStoreService);

    service.search({q: 'pan'});
    service.loadCities();
    service.clear();

    expect(dispatch.calls.allArgs().map(([action]) => (action as unknown as { type: string }).type)).toEqual([
      '[BusinessSearch] Search businesses',
      '[BusinessSearch] Load cities',
      '[BusinessSearch] Clear search'
    ]);
  });

  it('exposes the state as streams', (done) => {
    TestBed.configureTestingModule({providers: [provideStore({businessSearch: businessSearchReducer})]});
    const service = TestBed.inject(BusinessSearchStoreService);
    service.search({q: 'pan'});
    service.isSearching$.subscribe((searching) => {
      expect(searching).toBeTrue();
      done();
    });
  });
});
