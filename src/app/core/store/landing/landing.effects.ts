import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LandingService } from '@core/services/landing.service';
import { loadLanding, loadLandingFailure, loadLandingSuccess } from './landing.actions';

@Injectable({
  providedIn: 'root'
})
export class LandingEffects {
  private readonly actions$ = inject(Actions);
  private readonly landingService = inject(LandingService);

  loadLanding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLanding),
      switchMap(() =>
        this.landingService.getLanding().pipe(
          map((data) => loadLandingSuccess({ data })),
          catchError((err: Error) =>
            of(loadLandingFailure({ error: err.message ?? 'Error desconocido al cargar la landing' }))
          )
        )
      )
    )
  );
}
