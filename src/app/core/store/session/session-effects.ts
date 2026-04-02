import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { SessionData, SessionState } from '@app/core/store/session/session.state';
import { clearSession, loadSession, saveSession, setInitialized } from '@app/core/store/session/session.action';
import { tap, withLatestFrom } from 'rxjs';
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
        withLatestFrom(this.store.select(state => state.session.isInitialized)),
        tap(([_action, isInitialized]) => {
          const caller = new Error().stack?.split('\n')[2]?.trim() ?? 'unknown';
          console.debug(
            `[SessionEffect] loadSession$ fired | ts=${new Date().toISOString()} | isInitialized=${isInitialized} | caller: ${caller}`
          );

          if (isInitialized) {
            console.debug('[SessionEffect] Already initialized, skipping');
            return;
          }

          if (this.isBrowser && this.isLocalStorageAvailable()) {
            const storedSession = localStorage.getItem(this.SESSION_KEY);
            if (storedSession) {
              const sessionData: SessionData = JSON.parse(storedSession);
              console.debug('[SessionEffect] Found stored session, dispatching saveSession');
              this.store.dispatch(saveSession({ sessionData, isInitialized: true }));
            } else {
              console.debug('[SessionEffect] No stored session found, dispatching setInitialized');
              this.store.dispatch(setInitialized());
            }
          } else {
            console.debug('[SessionEffect] Not browser or localStorage unavailable, dispatching setInitialized');
            this.store.dispatch(setInitialized());
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
