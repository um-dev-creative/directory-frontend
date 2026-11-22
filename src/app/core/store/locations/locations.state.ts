import {Location} from '@shared/models/location.model';

export interface LocationsState {
  /** The business the locations belong to. */
  businessId: string | null;
  /** The locations, the main one first (the order the backend answers). */
  locations: Location[];
  isLoading: boolean;
  /** True while a create, update or delete is in flight. */
  isSaving: boolean;
  error: string | null;
}

export const initialLocationsState: LocationsState = {
  businessId: null,
  locations: [],
  isLoading: false,
  isSaving: false,
  error: null
};
