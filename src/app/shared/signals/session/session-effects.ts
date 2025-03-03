import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {SessionData} from '@shared/signals/session/session.state';
import {clearSession, loadSession, saveSession} from '@shared/signals/session/session.action';
import {tap} from 'rxjs';
import {Actions, createEffect, ofType} from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class SessionEffects {
  private readonly SESSION_KEY = 'currentSession';

  constructor(private readonly action$: Actions, private readonly store: Store<{ session: SessionData }>) {
    this.isSessionStorageAvailable();
  }

  saveSession$ = createEffect(() => this.action$.pipe(
      ofType(saveSession),
      tap(action => {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(action.data));
      })
    ),
    {dispatch: false}
  );

  clearSession$ = createEffect(() => this.action$.pipe(
      ofType(clearSession),
      tap(() => {
        sessionStorage.removeItem(this.SESSION_KEY);
      })
    ),
    {dispatch: false}
  );

  loadSession$ = createEffect(() =>
      this.action$.pipe(
        ofType(loadSession),
        tap(() => {
          if (this.isSessionStorageAvailable()) {
            const storedSession = sessionStorage.getItem(this.SESSION_KEY);
            if (storedSession) {
              const sessionData: SessionData = JSON.parse(storedSession);
              this.store.dispatch(saveSession({data: sessionData, token: sessionData.token}));
            }
          }
        })
      ),
    {dispatch: false}
  );

  private isSessionStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
