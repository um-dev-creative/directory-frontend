import {createReducer, on} from '@ngrx/store';
import {clearBusinessStats, loadBusinessStats, loadBusinessStatsFailure, loadBusinessStatsSuccess} from './business-stats.actions';
import {initialBusinessStatsState} from './business-stats.state';

export const businessStatsReducer = createReducer(
  initialBusinessStatsState,
  on(loadBusinessStats, (state, {businessId, days}) => ({
    ...state,
    businessId,
    days,
    // another business: never show the previous one's numbers while loading
    stats: state.businessId === businessId ? state.stats : null,
    isLoading: true,
    error: null
  })),
  on(loadBusinessStatsSuccess, (state, {stats}) => ({...state, stats, isLoading: false, error: null})),
  on(loadBusinessStatsFailure, (state, {error}) => ({...state, isLoading: false, error})),
  on(clearBusinessStats, () => initialBusinessStatsState)
);
