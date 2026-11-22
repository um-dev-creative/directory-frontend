import {createAction, props} from '@ngrx/store';
import {BusinessStats} from '@shared/models/business-stats.model';

export const loadBusinessStats = createAction('[BusinessStats] Load stats', props<{ businessId: string; days: number }>());
export const loadBusinessStatsSuccess = createAction('[BusinessStats] Load stats success', props<{ stats: BusinessStats }>());
export const loadBusinessStatsFailure = createAction('[BusinessStats] Load stats failure', props<{ error: string }>());
export const clearBusinessStats = createAction('[BusinessStats] Clear stats');
