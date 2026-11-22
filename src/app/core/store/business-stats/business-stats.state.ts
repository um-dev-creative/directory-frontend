import {BusinessStats, STATS_DEFAULT_WINDOW} from '@shared/models/business-stats.model';

export interface BusinessStatsState {
  businessId: string | null;
  /** Window of the loaded summary, in days. */
  days: number;
  stats: BusinessStats | null;
  isLoading: boolean;
  error: string | null;
}

export const initialBusinessStatsState: BusinessStatsState = {
  businessId: null,
  days: STATS_DEFAULT_WINDOW,
  stats: null,
  isLoading: false,
  error: null
};
