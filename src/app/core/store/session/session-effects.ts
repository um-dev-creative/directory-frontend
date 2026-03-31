import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { SessionData, SessionState } from '@app/core/store/session/session.state';
import { clearSession, loadSession, saveSession } from '@app/core/store/session/session.action';
import { tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class SessionEffects {
  private readonly SESSION_KEY = 'currentSession';
  // SSR: browser-only — localStorage does not exist in Node; guard every access
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private readonly action$: Actions, private readonly store: Store<{ session: SessionState }>) {}

  saveSession$ = createEffect(() => this.action$.pipe(
      ofType(saveSession),
      tap(action => {
        if (this.isBrowser) {
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(action.sessionData));
        }
      })
    ),
    { dispatch: false }
  );

  clearSession$ = createEffect(() => this.action$.pipe(
      ofType(clearSession),
      tap(() => {
        if (this.isBrowser) {
          localStorage.removeItem(this.SESSION_KEY);
        }
      })
    ),
    { dispatch: false }
  );

  loadSession$ = createEffect(() =>
      this.action$.pipe(
        ofType(loadSession),
        tap(() => {
          if (this.isBrowser && this.isLocalStorageAvailable()) {
            const storedSession = localStorage.getItem(this.SESSION_KEY);
            if (storedSession) {
              const sessionData: SessionData = JSON.parse(storedSession);
              this.store.dispatch(saveSession({ sessionData, isInitialized: true }));
            }
          }
        })
      ),
    { dispatch: false }
  );

  private isLocalStorageAvailable(): boolean {
    if (!this.isBrowser) return false;
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
