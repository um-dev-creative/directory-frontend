import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {LocationCreateRequest, LocationUpdateRequest} from '@shared/models/location.model';
import {clearLocations, createLocation, deleteLocation, loadLocations, updateLocation} from './locations.actions';
import {
  selectLocations,
  selectLocationsError,
  selectLocationsLoading,
  selectLocationsSaving,
  selectMainLocation
} from './locations.selectors';

@Injectable({providedIn: 'root'})
export class LocationsStoreService {
  private readonly store = inject(Store);

  readonly locations$ = this.store.select(selectLocations);
  readonly mainLocation$ = this.store.select(selectMainLocation);
  readonly isLoading$ = this.store.select(selectLocationsLoading);
  readonly isSaving$ = this.store.select(selectLocationsSaving);
  readonly error$ = this.store.select(selectLocationsError);

  load(businessId: string): void {
    this.store.dispatch(loadLocations({businessId}));
  }

  create(businessId: string, request: LocationCreateRequest): void {
    this.store.dispatch(createLocation({businessId, request}));
  }

  update(businessId: string, locationId: string, request: LocationUpdateRequest): void {
    this.store.dispatch(updateLocation({businessId, locationId, request}));
  }

  remove(businessId: string, locationId: string): void {
    this.store.dispatch(deleteLocation({businessId, locationId}));
  }

  clear(): void {
    this.store.dispatch(clearLocations());
  }
}
