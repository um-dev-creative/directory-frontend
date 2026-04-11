import {sessionReducer} from './session.reducer';
import {clearSession, saveSession, setInitialized, loadSession} from './session.action';
import {SessionState, initialState} from './session.state';

describe('sessionReducer', () => {
  const createSessionState = (overrides: Partial<SessionState> = {}): SessionState => ({
    ...initialState,
    ...overrides,
    sessionData: {
      ...initialState.sessionData,
      ...(overrides.sessionData ?? {}),
      userAuth: {
        ...initialState.sessionData.userAuth,
        ...((overrides.sessionData?.userAuth as object) ?? {})
      }
    }
  });

  it('should normalize profile fields when saving session data', () => {
    const state = createSessionState();
    const nextState = sessionReducer(
      state,
      saveSession({
        sessionData: {
          token: 'session-token',
          userAuth: {
            alias: 'alias',
            email: 'test@example.com',
            firstName: 'Pepe',
            lastName: 'Perez',
            displayName: 'Pepe P.',
            sessionToken: 'session-token',
            sessionTokenBkd: 'bkd-token',
            authorization: 'bearer',
            features: [],
            businesses: ['business-1'],
            avatarUrl: 'https://cdn.example.com/avatar.png',
            avatarVersion: '42',
            initials: 'PP'
          }
        } as any,
        isInitialized: true
      })
    );

    expect(nextState.isInitialized).toBeTrue();
    expect(nextState.sessionData.token).toBe('session-token');
    expect(nextState.sessionData.userAuth.firstName).toBe('Pepe');
    expect(nextState.sessionData.userAuth.lastName).toBe('Perez');
    expect(nextState.sessionData.userAuth.displayName).toBe('Pepe P.');
    expect(nextState.sessionData.userAuth.fullName).toBe('Pepe P.');
    expect(nextState.sessionData.userAuth.avatarUrl).toBe('https://cdn.example.com/avatar.png');
    expect(nextState.sessionData.userAuth.avatarVersion).toBe('42');
    expect(nextState.sessionData.userAuth.initials).toBe('PP');
    expect(nextState.sessionData.userAuth.businesses).toEqual(['business-1']);
  });

  it('should preserve existing session fields when saving partial profile updates', () => {
    const state = createSessionState({
      sessionData: {
        ...initialState.sessionData,
        token: 'session-token',
        userAuth: {
          ...initialState.sessionData.userAuth,
          alias: 'alias',
          email: 'test@example.com',
          firstName: 'Pepe',
          lastName: 'Perez',
          displayName: 'Pepe Perez',
          fullName: 'Pepe Perez',
          sessionToken: 'session-token',
          sessionTokenBkd: 'bkd-token',
          authorization: 'bearer',
          features: ['feature-a'],
          businesses: ['business-1'],
          verifiedComplete: true,
          avatarUrl: 'https://cdn.example.com/avatar-old.png',
          avatarVersion: '1',
          initials: 'PP'
        }
      }
    });

    const nextState = sessionReducer(
      state,
      saveSession({
        sessionData: {
          token: 'session-token',
          userAuth: {
            avatarUrl: 'https://cdn.example.com/avatar-new.png',
            avatarVersion: '2',
            displayName: 'Pepe P.'
          }
        } as any,
        isInitialized: false
      })
    );

    expect(nextState.sessionData.userAuth.firstName).toBe('Pepe');
    expect(nextState.sessionData.userAuth.lastName).toBe('Perez');
    expect(nextState.sessionData.userAuth.displayName).toBe('Pepe P.');
    expect(nextState.sessionData.userAuth.fullName).toBe('Pepe P.');
    expect(nextState.sessionData.userAuth.avatarUrl).toBe('https://cdn.example.com/avatar-new.png');
    expect(nextState.sessionData.userAuth.avatarVersion).toBe('2');
    expect(nextState.sessionData.userAuth.features).toEqual(['feature-a']);
    expect(nextState.sessionData.userAuth.businesses).toEqual(['business-1']);
    expect(nextState.isInitialized).toBeFalse();
  });

  it('should reset the session when clearing session data', () => {
    const state = createSessionState({isInitialized: false});
    const nextState = sessionReducer(state, clearSession());

    expect(nextState).toEqual({
      ...initialState,
      isInitialized: true
    });
  });

  it('should keep the current state when loading session', () => {
    const state = createSessionState({isInitialized: true});
    const nextState = sessionReducer(state, loadSession());

    expect(nextState).toEqual(state);
  });

  it('should set initialized when requested', () => {
    const state = createSessionState({isInitialized: false});
    const nextState = sessionReducer(state, setInitialized());

    expect(nextState.isInitialized).toBeTrue();
  });
});


