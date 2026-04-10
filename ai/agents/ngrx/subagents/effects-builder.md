# Sub-Agent: Effects Builder

**Parent Agent:** NgRx State Developer Agent  
**Trigger:** When effects for async operations (HTTP calls, storage, side-effects) need to be generated

## Purpose

Generate NgRx effects following the project's conventions: `HttpService` only, BFF paths only, proper error handling, SSR-safe storage effects.

## Critical Rules

```
ALWAYS use HttpService — NEVER raw HttpClient
ALWAYS target BFF paths (/drb/api/v1/* or /bkd/api/v1/*)
ALWAYS handle errors with catchError → dispatch failure action
NEVER call Java backends directly from effects
NEVER use switchMap for mutations (use mergeMap or concatMap)
```

## switchMap vs mergeMap vs concatMap

| Operator | Use When |
|---|---|
| `switchMap` | Load/search — cancels previous request (read-only) |
| `concatMap` | Order-dependent mutations (sequential) |
| `mergeMap` | Independent mutations (parallel allowed) |
| `exhaustMap` | Login/form submit — ignores new until current completes |

## Effects Template

```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { NotificationService } from '@core/services/notification.service';
import { DFC } from '@shared/constants/app.const';
import * as {Feature}Actions from './{feature}.action';

@Injectable()
export class {Feature}Effects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpService);
  private readonly notification = inject(NotificationService);

  // ---- LOAD (switchMap — read-only, cancellable) ----
  load{Feature}s$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.load{Feature}s),
      switchMap(() =>
        this.http.get<{Feature}Model[]>(DFC.RelativePath.{FEATURE}_PATH).pipe(
          map(items => {Feature}Actions.load{Feature}sSuccess({ items })),
          catchError(error =>
            of({Feature}Actions.load{Feature}sFailure({ error: error.message ?? 'Load failed' }))
          )
        )
      )
    )
  );

  // ---- CREATE (concatMap — order matters) ----
  create{Feature}$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.create{Feature}),
      concatMap(({ data }) =>
        this.http.post<{Feature}Model>(DFC.RelativePath.{FEATURE}_PATH, data).pipe(
          map(item => {Feature}Actions.create{Feature}Success({ item })),
          catchError(error =>
            of({Feature}Actions.create{Feature}Failure({ error: error.message ?? 'Create failed' }))
          )
        )
      )
    )
  );

  // ---- UPDATE (concatMap) ----
  update{Feature}$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.update{Feature}),
      concatMap(({ id, data }) =>
        this.http.put<{Feature}Model>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`, data).pipe(
          map(item => {Feature}Actions.update{Feature}Success({ item })),
          catchError(error =>
            of({Feature}Actions.update{Feature}Failure({ error: error.message ?? 'Update failed' }))
          )
        )
      )
    )
  );

  // ---- DELETE (mergeMap — independent) ----
  delete{Feature}$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.delete{Feature}),
      mergeMap(({ id }) =>
        this.http.delete<void>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`).pipe(
          map(() => {Feature}Actions.delete{Feature}Success({ id })),
          catchError(error =>
            of({Feature}Actions.delete{Feature}Failure({ error: error.message ?? 'Delete failed' }))
          )
        )
      )
    )
  );

  // ---- SUCCESS NOTIFICATION (dispatch: false) ----
  notifySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        {Feature}Actions.create{Feature}Success,
        {Feature}Actions.update{Feature}Success,
        {Feature}Actions.delete{Feature}Success
      ),
      tap(action => {
        this.notification.success('{feature}.success');  // TODO: i18n
      })
    ),
    { dispatch: false }
  );

  // ---- ERROR NOTIFICATION (dispatch: false) ----
  notifyError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        {Feature}Actions.load{Feature}sFailure,
        {Feature}Actions.create{Feature}Failure,
        {Feature}Actions.update{Feature}Failure,
        {Feature}Actions.delete{Feature}Failure
      ),
      tap(({ error }) => {
        this.notification.error(error);
      })
    ),
    { dispatch: false }
  );
}
```

## SSR-Safe Storage Effects

For effects that need `localStorage` (like the session store):

```typescript
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageMockService } from '@core/services/storage-mock.service';

@Injectable()
export class {Feature}Effects {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = inject(StorageMockService);

  persistState$ = createEffect(() =>
    this.actions$.pipe(
      ofType({Feature}Actions.someAction),
      tap(({ data }) => {
        if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
          this.storage.setLocal('{feature}Data', JSON.stringify(data));
        }
      })
    ),
    { dispatch: false }
  );
}
```

## BFF Path Reference

```typescript
DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL  // '/drb/api/v1'
DFC.RelativePath.BACKBONE_BASE_URL           // 'bkd/api/v1'
DFC.RelativePath.AUTH_PATH                   // '/auth'
DFC.RelativePath.GENERAL_PATH                // '/general'
DFC.RelativePath.BUSINESS_PATH               // '/businesses'
```

