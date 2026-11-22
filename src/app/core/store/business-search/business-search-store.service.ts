import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BusinessSearchParams} from '@shared/models/location.model';
import {clearBusinessSearch, loadCities, searchBusinesses} from './business-search.actions';
import {
  selectCities,
  selectHasNextPage,
  selectHasPreviousPage,
  selectIsLoadingCities,
  selectIsSearching,
  selectSearchError,
  selectSearchIsEmpty,
  selectSearchPage,
  selectSearchResults,
  selectSearchTotalCount,
  selectSearchTotalPages
} from './business-search.selectors';

@Injectable({providedIn: 'root'})
export class BusinessSearchStoreService {
  private readonly store = inject(Store);

  readonly results$ = this.store.select(selectSearchResults);
  readonly totalCount$ = this.store.select(selectSearchTotalCount);
  readonly page$ = this.store.select(selectSearchPage);
  readonly totalPages$ = this.store.select(selectSearchTotalPages);
  readonly isSearching$ = this.store.select(selectIsSearching);
  readonly error$ = this.store.select(selectSearchError);
  readonly isEmpty$ = this.store.select(selectSearchIsEmpty);
  readonly hasPreviousPage$ = this.store.select(selectHasPreviousPage);
  readonly hasNextPage$ = this.store.select(selectHasNextPage);
  readonly cities$ = this.store.select(selectCities);
  readonly isLoadingCities$ = this.store.select(selectIsLoadingCities);

  search(params: BusinessSearchParams): void {
    this.store.dispatch(searchBusinesses({params}));
  }

  clear(): void {
    this.store.dispatch(clearBusinessSearch());
  }

  loadCities(): void {
    this.store.dispatch(loadCities());
  }
}
