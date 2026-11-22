import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {clearBusinessStats, loadBusinessStats} from './business-stats.actions';
import {selectBusinessStats, selectMaxDailyViews, selectStatsError, selectStatsLoading, selectStatsWindow} from './business-stats.selectors';

@Injectable({providedIn: 'root'})
export class BusinessStatsStoreService {
  private readonly store = inject(Store);

  readonly stats$ = this.store.select(selectBusinessStats);
  readonly days$ = this.store.select(selectStatsWindow);
  readonly isLoading$ = this.store.select(selectStatsLoading);
  readonly error$ = this.store.select(selectStatsError);
  readonly maxDailyViews$ = this.store.select(selectMaxDailyViews);

  load(businessId: string, days: number): void {
    this.store.dispatch(loadBusinessStats({businessId, days}));
  }

  clear(): void {
    this.store.dispatch(clearBusinessStats());
  }
}
