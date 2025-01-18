import {inject, Injectable} from '@angular/core';
import {SessionData} from "@shared/state/session.state";
import {Store} from '@ngrx/store';
import {clearSession, loadSession, saveSession} from '@shared/state/session.action';

@Injectable({
  providedIn: 'root'
})
export class SessionStoreService {

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
    // Load session data from sessionStorage
    this.store.dispatch(loadSession());
  }

}
