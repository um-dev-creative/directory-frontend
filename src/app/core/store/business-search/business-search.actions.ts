import {createAction, props} from '@ngrx/store';
import {BusinessSearchParams, BusinessSearchResponse, City} from '@shared/models/location.model';

export const searchBusinesses = createAction(
  '[BusinessSearch] Search businesses',
  props<{ params: BusinessSearchParams }>()
);

export const searchBusinessesSuccess = createAction(
  '[BusinessSearch] Search businesses success',
  props<{ response: BusinessSearchResponse }>()
);

export const searchBusinessesFailure = createAction(
  '[BusinessSearch] Search businesses failure',
  props<{ error: string }>()
);

export const clearBusinessSearch = createAction('[BusinessSearch] Clear search');

export const loadCities = createAction('[BusinessSearch] Load cities');

export const loadCitiesSuccess = createAction(
  '[BusinessSearch] Load cities success',
  props<{ cities: City[] }>()
);

export const loadCitiesFailure = createAction(
  '[BusinessSearch] Load cities failure',
  props<{ error: string }>()
);
