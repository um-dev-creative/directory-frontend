import {createFeatureSelector, createSelector} from '@ngrx/store';
import {BusinessStatsState} from './business-stats.state';

export const selectBusinessStatsState = createFeatureSelector<BusinessStatsState>('businessStats');

export const selectBusinessStats = createSelector(selectBusinessStatsState, (s) => s.stats);
export const selectStatsWindow = createSelector(selectBusinessStatsState, (s) => s.days);
export const selectStatsLoading = createSelector(selectBusinessStatsState, (s) => s.isLoading);
export const selectStatsError = createSelector(selectBusinessStatsState, (s) => s.error);

/** Highest daily value of the window (at least 1), used to scale the bars. */
export const selectMaxDailyViews = createSelector(selectBusinessStats, (stats) =>
  Math.max(1, ...(stats?.daily ?? []).map((day) => day.views)));
