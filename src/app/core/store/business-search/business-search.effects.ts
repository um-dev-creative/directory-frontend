import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BusinessSearchClient} from '@core/services/business/business-search.client';
import {CityClient} from '@core/services/city/city.client';
import {
  loadCities,
  loadCitiesFailure,
  loadCitiesSuccess,
  searchBusinesses,
  searchBusinessesFailure,
  searchBusinessesSuccess
} from './business-search.actions';

@Injectable({
  providedIn: 'root'
})
export class BusinessSearchEffects {
  private readonly actions$ = inject(Actions);
  private readonly searchClient = inject(BusinessSearchClient);
  private readonly cityClient = inject(CityClient);

  /** `switchMap` drops the answer of an older search when a newer one starts (typing, paging). */
  searchBusinesses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchBusinesses),
      switchMap(({params}) =>
        this.searchClient.search(params).pipe(
          map((response) => searchBusinessesSuccess({response})),
          catchError((err: { message?: string }) => of(searchBusinessesFailure({error: err?.message ?? 'Search failed'})))
        )
      )
    )
  );

  loadCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCities),
      switchMap(() =>
        this.cityClient.getCities().pipe(
          map((cities) => loadCitiesSuccess({cities})),
          catchError((err: { message?: string }) => of(loadCitiesFailure({error: err?.message ?? 'Could not load the cities'})))
        )
      )
    )
  );
}
