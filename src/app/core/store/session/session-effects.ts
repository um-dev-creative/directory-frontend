import {isPlatformBrowser} from '@angular/common';
import {Injectable, PLATFORM_ID, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {tap, withLatestFrom} from 'rxjs';
import {clearSession, loadSession, saveSession, setInitialized} from '@app/core/store/session/session.action';
import {SessionData, SessionState} from '@app/core/store/session/session.state';

@Injectable({ providedIn: 'root' })
export class SessionEffects {
  private readonly sessionKey = 'currentSession';
  // SSR: browser-only — localStorage does not exist in Node; guard every access
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<{ session: SessionState }>);

  saveSession$ = createEffect(
    () => this.actions$.pipe(
      ofType(saveSession),
      tap(({sessionData}) => this.persistSession(sessionData))
    ),
    {dispatch: false}
  );

  clearSession$ = createEffect(
    () => this.actions$.pipe(
      ofType(clearSession),
      tap(() => this.removeSession())
    ),
    {dispatch: false}
  );

  loadSession$ = createEffect(
    () => this.actions$.pipe(
      ofType(loadSession),
      withLatestFrom(this.store.select(state => state.session.isInitialized)),
      tap(([_action, isInitialized]) => {
        if (isInitialized) {
          return;
        }

        this.restoreSession();
      })
    ),
    {dispatch: false}
  );

  private persistSession(sessionData: SessionData): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.error('[SessionEffect] Failed to persist session', error);
    }
  }

  private removeSession(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error('[SessionEffect] Failed to clear session', error);
    }
  }

  private restoreSession(): void {
    if (!this.isBrowser || !this.isLocalStorageAvailable()) {
      this.store.dispatch(setInitialized());
      return;
    }

    try {
      const storedSession = localStorage.getItem(this.sessionKey);
      if (!storedSession) {
        this.store.dispatch(setInitialized());
        return;
      }

      const sessionData: SessionData = JSON.parse(storedSession);
      this.store.dispatch(saveSession({sessionData, isInitialized: true}));
    } catch (error) {
      console.error('[SessionEffect] Failed to restore session', error);
      this.store.dispatch(setInitialized());
    }
  }

  private isLocalStorageAvailable(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      const testKey = '__session_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
