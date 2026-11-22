import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BusinessStatsClient} from '@core/services/business/business-stats.client';
import {loadBusinessStats, loadBusinessStatsFailure, loadBusinessStatsSuccess} from './business-stats.actions';

@Injectable({
  providedIn: 'root'
})
export class BusinessStatsEffects {
  private readonly actions$ = inject(Actions);
  private readonly client = inject(BusinessStatsClient);

  /** `switchMap`: changing the window quickly keeps only the answer of the last one. */
  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBusinessStats),
      switchMap(({businessId, days}) =>
        this.client.getStats(businessId, days).pipe(
          map((stats) => loadBusinessStatsSuccess({stats})),
          catchError((err: { message?: string }) => of(loadBusinessStatsFailure({error: err?.message ?? 'Could not load the statistics'})))
        )
      )
    )
  );
}
