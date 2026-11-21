import {createAction, props} from '@ngrx/store';
import {Location, LocationCreateRequest, LocationUpdateRequest} from '@shared/models/location.model';

export const loadLocations = createAction('[Locations] Load locations', props<{ businessId: string }>());
export const loadLocationsSuccess = createAction('[Locations] Load locations success', props<{ locations: Location[] }>());
export const loadLocationsFailure = createAction('[Locations] Load locations failure', props<{ error: string }>());

export const createLocation = createAction(
  '[Locations] Create location',
  props<{ businessId: string; request: LocationCreateRequest }>()
);
export const updateLocation = createAction(
  '[Locations] Update location',
  props<{ businessId: string; locationId: string; request: LocationUpdateRequest }>()
);
export const deleteLocation = createAction(
  '[Locations] Delete location',
  props<{ businessId: string; locationId: string }>()
);

/** A create, update or delete finished: the list is reloaded because the backend may have changed the main location. */
export const saveLocationSuccess = createAction('[Locations] Save location success', props<{ businessId: string }>());
export const saveLocationFailure = createAction('[Locations] Save location failure', props<{ error: string }>());

export const clearLocations = createAction('[Locations] Clear locations');
