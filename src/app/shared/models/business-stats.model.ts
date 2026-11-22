/**
 * Views of a business (directory-backend `BusinessStatsTO`). Days are UTC and no personal data is involved.
 */

export interface DailyViews {
  /** ISO date, `yyyy-MM-dd`. */
  date: string;
  views: number;
}

export interface BusinessStats {
  businessId: string;
  from: string;
  to: string;
  totalViews: number;
  viewsToday: number;
  /** Views in the last 7 days, whatever the requested window is. */
  viewsLast7Days: number;
  /** One entry per day of the window, zeros included, oldest first. */
  daily: DailyViews[];
}

/** Windows the panel offers, in days (the backend accepts 1 to 365). */
export const STATS_WINDOWS: readonly number[] = [7, 30, 90];
export const STATS_DEFAULT_WINDOW = 30;
