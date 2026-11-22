import {TestBed} from '@angular/core/testing';
import {Actions} from '@ngrx/effects';
import {Action, Store, provideStore} from '@ngrx/store';
import {of, ReplaySubject, throwError} from 'rxjs';
import {BusinessStatsClient} from '@core/services/business/business-stats.client';
import {BusinessStats} from '@shared/models/business-stats.model';
import {clearBusinessStats, loadBusinessStats, loadBusinessStatsFailure, loadBusinessStatsSuccess} from './business-stats.actions';
import {BusinessStatsEffects} from './business-stats.effects';
import {businessStatsReducer} from './business-stats.reducer';
import {BusinessStatsStoreService} from './business-stats-store.service';
import {initialBusinessStatsState} from './business-stats.state';
import {selectMaxDailyViews} from './business-stats.selectors';

const stats: BusinessStats = {
  businessId: 'b1', from: '2026-11-19', to: '2026-11-21', totalViews: 9, viewsToday: 5, viewsLast7Days: 9,
  daily: [{date: '2026-11-19', views: 4}, {date: '2026-11-20', views: 0}, {date: '2026-11-21', views: 5}]
};

describe('business stats reducer', () => {
  it('starts loading a window for a business', () => {
    const state = businessStatsReducer(initialBusinessStatsState, loadBusinessStats({businessId: 'b1', days: 7}));
    expect(state.businessId).toBe('b1');
    expect(state.days).toBe(7);
    expect(state.isLoading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('keeps the numbers while the same business reloads and drops them for another one', () => {
    const loaded = businessStatsReducer(businessStatsReducer(initialBusinessStatsState,
      loadBusinessStats({businessId: 'b1', days: 30})), loadBusinessStatsSuccess({stats}));
    expect(businessStatsReducer(loaded, loadBusinessStats({businessId: 'b1', days: 7})).stats).toEqual(stats);
    expect(businessStatsReducer(loaded, loadBusinessStats({businessId: 'b2', days: 7})).stats).toBeNull();
  });

  it('stores the summary and reports a failure', () => {
    const loaded = businessStatsReducer(initialBusinessStatsState, loadBusinessStatsSuccess({stats}));
    expect(loaded.stats).toEqual(stats);
    expect(loaded.isLoading).toBeFalse();
    const failed = businessStatsReducer(loaded, loadBusinessStatsFailure({error: 'forbidden'}));
    expect(failed.error).toBe('forbidden');
    expect(failed.isLoading).toBeFalse();
  });

  it('is emptied by clearBusinessStats', () => {
    const loaded = businessStatsReducer(initialBusinessStatsState, loadBusinessStatsSuccess({stats}));
    expect(businessStatsReducer(loaded, clearBusinessStats())).toEqual(initialBusinessStatsState);
  });
});

describe('business stats selectors', () => {
  it('scales the bars to the highest day and never to zero', () => {
    expect(selectMaxDailyViews({businessStats: {...initialBusinessStatsState, stats}})).toBe(5);
    expect(selectMaxDailyViews({businessStats: initialBusinessStatsState})).toBe(1);
    expect(selectMaxDailyViews({businessStats: {...initialBusinessStatsState, stats: {...stats, daily: [{date: 'd', views: 0}]}}})).toBe(1);
  });
});

describe('BusinessStatsEffects', () => {
  let actions$: ReplaySubject<Action>;
  let client: jasmine.SpyObj<BusinessStatsClient>;
  let effects: BusinessStatsEffects;

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);
    client = jasmine.createSpyObj('BusinessStatsClient', ['getStats']);
    TestBed.configureTestingModule({
      providers: [BusinessStatsEffects, {provide: Actions, useValue: new Actions(actions$)}, {provide: BusinessStatsClient, useValue: client}]
    });
    effects = TestBed.inject(BusinessStatsEffects);
  });

  it('loads the summary', (done) => {
    client.getStats.and.returnValue(of(stats));
    effects.loadStats$.subscribe((action) => {
      expect(action).toEqual(loadBusinessStatsSuccess({stats}));
      expect(client.getStats).toHaveBeenCalledWith('b1', 7);
      done();
    });
    actions$.next(loadBusinessStats({businessId: 'b1', days: 7}));
  });

  it('reports the failure with its message', (done) => {
    client.getStats.and.returnValue(throwError(() => ({message: 'forbidden'})));
    effects.loadStats$.subscribe((action) => {
      expect(action).toEqual(loadBusinessStatsFailure({error: 'forbidden'}));
      done();
    });
    actions$.next(loadBusinessStats({businessId: 'b1', days: 7}));
  });

  it('uses a default message when the error has none', (done) => {
    client.getStats.and.returnValue(throwError(() => ({})));
    effects.loadStats$.subscribe((action) => {
      expect(action).toEqual(loadBusinessStatsFailure({error: 'Could not load the statistics'}));
      done();
    });
    actions$.next(loadBusinessStats({businessId: 'b1', days: 7}));
  });
});

describe('BusinessStatsStoreService', () => {
  it('dispatches the actions and exposes the state', (done) => {
    TestBed.configureTestingModule({providers: [provideStore({businessStats: businessStatsReducer})]});
    const store = TestBed.inject(Store);
    const dispatch = spyOn(store, 'dispatch').and.callThrough();
    const service = TestBed.inject(BusinessStatsStoreService);

    service.load('b1', 7);
    service.clear();
    service.load('b1', 30);

    expect(dispatch.calls.allArgs().map(([action]) => (action as unknown as { type: string }).type)).toEqual([
      '[BusinessStats] Load stats', '[BusinessStats] Clear stats', '[BusinessStats] Load stats'
    ]);
    service.days$.subscribe((days) => {
      expect(days).toBe(30);
      done();
    });
  });
});
