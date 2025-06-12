import {createReducer, on} from '@ngrx/store';
import {clearSession, loadSession, saveSession, setInitialized} from './session.action';
import {initialState, SessionData} from './session.state';

const _sessionReducer = createReducer(
  initialState,
  on(saveSession, (state, {sessionData, isInitialized}) => {
    console.debug('🔐 Saving session:', sessionData?.userAuth?.email);
    return {...state, sessionData, isInitialized: isInitialized ?? state.isInitialized};
  }),
  on(clearSession, (state) => {
    console.debug('🔒 Session cleared from the Local Storage');
    return {
      ...initialState,
      isInitialized: true
    };
  }),
  on(loadSession, (state) => {
    if (isLocalStorageAvailable()) {
      const storedSession = localStorage.getItem('currentSession');
      if (storedSession) {
        const sessionData: SessionData = JSON.parse(storedSession);
        console.debug('🔓 Session loaded:', sessionData?.userAuth?.email);
        return {...state, sessionData};
      }
    }
    console.debug('🔍 No session found');
    return state;
  }),
  on(setInitialized, (state) => {
    console.debug('✨ App initialized');
    return {...state, isInitialized: true};
  })
);

const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function sessionReducer(state: any, action: any) {
  return _sessionReducer(state, action);
}
