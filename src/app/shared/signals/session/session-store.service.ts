import {inject, Injectable} from '@angular/core';
import {SessionData} from "@shared/signals/session/session.state";
import {Store} from '@ngrx/store';
import {clearSession, loadSession, saveSession} from '@shared/signals/session/session.action';

@Injectable({
  providedIn: 'root'
})
export class SessionStoreService {

  private sessionData: SessionData | undefined;
  protected readonly store: Store<{ session: SessionData }> = inject(Store);

  protected constructor() {
    this.loadSessionData();
  }

  saveSessionData(sessionData: SessionData): void {
    this.store.dispatch(saveSession({data: sessionData, token: sessionData.token}));
  }

  clearSessionData(): void {
    this.store.dispatch(clearSession());
  }

  loadSessionData(): void {
    this.store.dispatch(loadSession());
  }

  get session(): SessionData {
    this.store.select('session').subscribe((sessionData: SessionData) => {
      this.sessionData = sessionData;
    });
    return <SessionData>this.sessionData;
  }

}
