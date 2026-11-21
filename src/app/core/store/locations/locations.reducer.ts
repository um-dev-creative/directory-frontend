import {createReducer, on} from '@ngrx/store';
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
import {initialLocationsState} from './locations.state';

export const locationsReducer = createReducer(
  initialLocationsState,
  on(loadLocations, (state, {businessId}) => ({
    ...state,
    // another business: do not show the previous one's locations while loading
    locations: state.businessId === businessId ? state.locations : [],
    businessId,
    isLoading: true,
    error: null
  })),
  on(loadLocationsSuccess, (state, {locations}) => ({...state, locations, isLoading: false, error: null})),
  on(loadLocationsFailure, (state, {error}) => ({...state, isLoading: false, error})),
  on(createLocation, updateLocation, deleteLocation, (state) => ({...state, isSaving: true, error: null})),
  on(saveLocationSuccess, (state) => ({...state, isSaving: false})),
  on(saveLocationFailure, (state, {error}) => ({...state, isSaving: false, error})),
  on(clearLocations, () => initialLocationsState)
);
