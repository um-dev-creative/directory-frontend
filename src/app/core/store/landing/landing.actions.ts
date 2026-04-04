import { createAction, props } from '@ngrx/store';
import { LandingResponse } from '@shared/models/landing.model';

export const loadLanding = createAction('[Landing] Load landing');

export const loadLandingSuccess = createAction(
  '[Landing] Load landing success',
  props<{ data: LandingResponse }>()
);

export const loadLandingFailure = createAction(
  '[Landing] Load landing failure',
  props<{ error: string }>()
);
