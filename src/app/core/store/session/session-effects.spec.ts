import {TestBed} from '@angular/core/testing';
import {Actions} from '@ngrx/effects';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {Observable, Subject} from 'rxjs';
import {SessionEffects} from './session-effects';
import {clearSession, loadSession, saveSession, setInitialized} from './session.action';
import {SessionData, SessionState, initialState} from './session.state';

const createSessionData = (overrides: Partial<SessionData['userAuth']> = {}): SessionData => ({
  token: 'user-token',
  userAuth: {
    alias: 'testAlias',
    email: 'test@example.com',
    firstName: 'Pepe',
    lastName: 'Perez',
    displayName: 'Pepe Perez',
    fullName: 'Pepe Perez',
    sessionToken: 'session-token',
    sessionTokenBkd: 'bkd-token',
    authorization: 'bearer token',
    features: [],
    businesses: [],
    verifiedComplete: true,
    avatarUrl: 'https://cdn.example.com/avatar.png',
    avatarVersion: '1',
    initials: 'PP',
    ...overrides
  }
});

describe('SessionEffects', () => {
  let actions$: Subject<any>;
  let effects: SessionEffects;
  let store: MockStore<{ session: SessionState }>;

  beforeEach(() => {
    actions$ = new Subject<any>();

    TestBed.configureTestingModule({
      providers: [
        SessionEffects,
        provideMockStore({initialState: {session: initialState}}),
        {provide: Actions, useFactory: () => actions$.asObservable() as Observable<any>}
      ]
    });

    effects = TestBed.inject(SessionEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    actions$.complete();
  });

  it('should persist a saved session to localStorage', () => {
    const sessionData = createSessionData();
    const setItemSpy = spyOn(localStorage, 'setItem').and.callFake(() => undefined);
    const removeItemSpy = spyOn(localStorage, 'removeItem').and.callFake(() => undefined);
    const subscription = effects.saveSession$.subscribe();

    actions$.next(saveSession({sessionData, isInitialized: true}));

    expect(setItemSpy).toHaveBeenCalledWith('currentSession', JSON.stringify(sessionData));
    expect(removeItemSpy).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('should swallow storage errors when persisting a session', () => {
    const sessionData = createSessionData();
    const consoleErrorSpy = spyOn(console, 'error');
    const setItemSpy = spyOn(localStorage, 'setItem').and.throwError('storage full');
    const subscription = effects.saveSession$.subscribe();

    expect(() => actions$.next(saveSession({sessionData, isInitialized: true}))).not.toThrow();
    expect(setItemSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('should restore a stored session by dispatching saveSession', () => {
    const sessionData = createSessionData({displayName: 'Ana G.', fullName: 'Ana García', avatarVersion: '2'});
    spyOn(localStorage, 'setItem').and.callFake(() => undefined);
    spyOn(localStorage, 'removeItem').and.callFake(() => undefined);
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(sessionData));
    spyOn(store, 'dispatch');
    const subscription = effects.loadSession$.subscribe();

    actions$.next(loadSession());

    expect(store.dispatch).toHaveBeenCalledWith(saveSession({sessionData, isInitialized: true}));

    subscription.unsubscribe();
  });

  it('should dispatch setInitialized when stored session JSON is invalid', () => {
    spyOn(localStorage, 'setItem').and.callFake(() => undefined);
    spyOn(localStorage, 'removeItem').and.callFake(() => undefined);
    spyOn(localStorage, 'getItem').and.returnValue('{bad json');
    spyOn(store, 'dispatch');
    const consoleErrorSpy = spyOn(console, 'error');
    const subscription = effects.loadSession$.subscribe();

    actions$.next(loadSession());

    expect(store.dispatch).toHaveBeenCalledWith(setInitialized());
    expect(consoleErrorSpy).toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('should clear the stored session when requested', () => {
    const removeItemSpy = spyOn(localStorage, 'removeItem').and.callFake(() => undefined);
    const subscription = effects.clearSession$.subscribe();

    actions$.next(clearSession());

    expect(removeItemSpy).toHaveBeenCalledWith('currentSession');

    subscription.unsubscribe();
  });
});



