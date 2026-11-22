import {createFeatureSelector, createSelector} from '@ngrx/store';
import {LocationsState} from './locations.state';

export const selectLocationsState = createFeatureSelector<LocationsState>('locations');

export const selectLocations = createSelector(selectLocationsState, (s) => s.locations);
export const selectLocationsLoading = createSelector(selectLocationsState, (s) => s.isLoading);
export const selectLocationsSaving = createSelector(selectLocationsState, (s) => s.isSaving);
export const selectLocationsError = createSelector(selectLocationsState, (s) => s.error);
export const selectMainLocation = createSelector(selectLocations, (locations) => locations.find((l) => l.main) ?? null);
