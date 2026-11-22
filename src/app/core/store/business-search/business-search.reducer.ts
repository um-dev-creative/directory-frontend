import {createReducer, on} from '@ngrx/store';
import {
  clearBusinessSearch,
  loadCities,
  loadCitiesFailure,
  loadCitiesSuccess,
  searchBusinesses,
  searchBusinessesFailure,
  searchBusinessesSuccess
} from './business-search.actions';
import {initialBusinessSearchState} from './business-search.state';

export const businessSearchReducer = createReducer(
  initialBusinessSearchState,
  on(searchBusinesses, (state, {params}) => ({...state, params, isSearching: true, searchError: null})),
  on(searchBusinessesSuccess, (state, {response}) => ({
    ...state,
    results: response.data ?? [],
    totalCount: response.total_count,
    page: response.page,
    perPage: response.per_page,
    totalPages: response.total_pages,
    isSearching: false,
    searchError: null
  })),
  on(searchBusinessesFailure, (state, {error}) => ({...state, results: [], totalCount: 0, totalPages: 0, isSearching: false, searchError: error})),
  on(clearBusinessSearch, (state) => ({
    ...initialBusinessSearchState,
    cities: state.cities,
    isLoadingCities: state.isLoadingCities,
    citiesError: state.citiesError
  })),
  on(loadCities, (state) => ({...state, isLoadingCities: true, citiesError: null})),
  on(loadCitiesSuccess, (state, {cities}) => ({...state, cities, isLoadingCities: false, citiesError: null})),
  on(loadCitiesFailure, (state, {error}) => ({...state, isLoadingCities: false, citiesError: error}))
);
