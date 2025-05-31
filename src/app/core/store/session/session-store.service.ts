/*
import {inject, Injectable} from '@angular/core';
import {SessionData, SessionState} from "@app/core/store/session/session.state";
import {Store} from '@ngrx/store';
import {clearSession, loadSession, saveSession} from '@app/core/store/session/session.action';

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
    const sessionState: SessionState = {sessionData: sessionData};
    this.store.dispatch(saveSession(sessionState));
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

}*/

import { inject, Injectable } from '@angular/core';
import { SessionData, SessionState } from "@app/core/store/session/session.state";
import { Store } from '@ngrx/store';
import { clearSession, loadSession, saveSession } from '@app/core/store/session/session.action';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionStoreService {

  readonly session$: Observable<SessionData> = inject(Store).select('session');

  constructor(private store: Store<{ session: SessionData }>) {
    this.loadSessionData();
  }

  saveSessionData(sessionData: SessionData): void {
    const sessionState: SessionState = { sessionData };
    this.store.dispatch(saveSession(sessionState));
  }

  clearSessionData(): void {
    this.store.dispatch(clearSession());
  }

  loadSessionData(): void {
    this.store.dispatch(loadSession());
  }
}
