import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {LocationClient} from '@core/services/location/location.client';
import {
  createLocation,
  deleteLocation,
  loadLocations,
  loadLocationsFailure,
  loadLocationsSuccess,
  saveLocationFailure,
  saveLocationSuccess,
  updateLocation
} from './locations.actions';

@Injectable({
  providedIn: 'root'
})
export class LocationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly client = inject(LocationClient);

  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocations),
      switchMap(({businessId}) =>
        this.client.list(businessId).pipe(
          map((locations) => loadLocationsSuccess({locations})),
          catchError((err: { message?: string }) => of(loadLocationsFailure({error: err?.message ?? 'Could not load the locations'})))
        )
      )
    )
  );

  createLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createLocation),
      mergeMap(({businessId, request}) =>
        this.client.create(businessId, request).pipe(
          map(() => saveLocationSuccess({businessId})),
          catchError((err: { message?: string }) => of(saveLocationFailure({error: err?.message ?? 'Could not save the location'})))
        )
      )
    )
  );

  updateLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateLocation),
      mergeMap(({businessId, locationId, request}) =>
        this.client.update(businessId, locationId, request).pipe(
          map(() => saveLocationSuccess({businessId})),
          catchError((err: { message?: string }) => of(saveLocationFailure({error: err?.message ?? 'Could not save the location'})))
        )
      )
    )
  );

  deleteLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteLocation),
      mergeMap(({businessId, locationId}) =>
        this.client.delete(businessId, locationId).pipe(
          map(() => saveLocationSuccess({businessId})),
          catchError((err: { message?: string }) => of(saveLocationFailure({error: err?.message ?? 'Could not delete the location'})))
        )
      )
    )
  );

  /** The backend may have moved the main location, so the list is read again instead of patched locally. */
  reloadAfterSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveLocationSuccess),
      map(({businessId}) => loadLocations({businessId}))
    )
  );
}
