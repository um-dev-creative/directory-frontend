import {TestBed} from '@angular/core/testing';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {SessionStoreService} from './session-store.service';
import {SessionData, SessionState, initialState} from './session.state';
import {clearSession, loadSession, saveSession, setInitialized} from './session.action';

describe('SessionStoreService', () => {
  let service: SessionStoreService;
  let store: MockStore<{ session: SessionState }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: {session: initialState}}),
        SessionStoreService
      ]
    });

    store = TestBed.inject(MockStore);
    service = TestBed.inject(SessionStoreService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch saveSession with the provided session data and initialized flag', () => {
    const sessionData: SessionData = {
      token: 'token',
      userAuth: {
        alias: 'alias',
        email: 'test@example.com',
        firstName: 'Pepe',
        lastName: 'Perez',
        displayName: 'Pepe Perez',
        fullName: 'Pepe Perez',
        sessionToken: 'session-token',
        sessionTokenBkd: 'bkd-token',
        authorization: 'bearer',
        features: [],
        businesses: [],
        verifiedComplete: true,
        avatarUrl: 'https://cdn.example.com/avatar.png',
        avatarVersion: '1',
        initials: 'PP'
      }
    };

    spyOn(store, 'dispatch');

    service.saveSessionData(sessionData);

    expect(store.dispatch).toHaveBeenCalledWith(saveSession({sessionData, isInitialized: true}));
  });

  it('should dispatch clearSession', () => {
    spyOn(store, 'dispatch');

    service.clearSessionData();

    expect(store.dispatch).toHaveBeenCalledWith(clearSession());
  });

  it('should dispatch loadSession', () => {
    spyOn(store, 'dispatch');

    service.loadSessionData();

    expect(store.dispatch).toHaveBeenCalledWith(loadSession());
  });

  it('should dispatch setInitialized', () => {
    spyOn(store, 'dispatch');

    service.setInitialized();

    expect(store.dispatch).toHaveBeenCalledWith(setInitialized());
  });
});
