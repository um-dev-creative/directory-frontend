import {createFeatureSelector, createSelector} from '@ngrx/store';
import {BusinessSearchState} from './business-search.state';

export const selectBusinessSearchState = createFeatureSelector<BusinessSearchState>('businessSearch');

export const selectSearchParams = createSelector(selectBusinessSearchState, (s) => s.params);
export const selectSearchResults = createSelector(selectBusinessSearchState, (s) => s.results);
export const selectSearchTotalCount = createSelector(selectBusinessSearchState, (s) => s.totalCount);
export const selectSearchPage = createSelector(selectBusinessSearchState, (s) => s.page);
export const selectSearchTotalPages = createSelector(selectBusinessSearchState, (s) => s.totalPages);
export const selectIsSearching = createSelector(selectBusinessSearchState, (s) => s.isSearching);
export const selectSearchError = createSelector(selectBusinessSearchState, (s) => s.searchError);
export const selectCities = createSelector(selectBusinessSearchState, (s) => s.cities);
export const selectIsLoadingCities = createSelector(selectBusinessSearchState, (s) => s.isLoadingCities);

/** True once a search has finished without results (so the page can say "nothing found" and not on first load). */
export const selectSearchIsEmpty = createSelector(
  selectIsSearching,
  selectSearchError,
  selectSearchTotalCount,
  selectSearchParams,
  (isSearching, error, total, params) => !isSearching && !error && total === 0 && Object.keys(params).length > 0
);

export const selectHasPreviousPage = createSelector(selectSearchPage, (page) => page > 1);
export const selectHasNextPage = createSelector(selectSearchPage, selectSearchTotalPages, (page, total) => page < total);
