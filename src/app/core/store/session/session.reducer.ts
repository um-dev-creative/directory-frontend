import {createReducer, on} from '@ngrx/store';
import {clearSession, loadSession, saveSession, setInitialized} from './session.action';
import {initialState, SessionData} from './session.state';

// Local debug helper for reducers (can't inject services here)
const debugLog = (...args: any[]) => {
  try { console.debug(...args); } catch (e) { /* noop */ }
};

const _sessionReducer = createReducer(
  initialState,
  on(saveSession, (state, {sessionData, isInitialized}) => {
    debugLog('🔐 Saving session:', sessionData?.userAuth?.email);
    return {...state, sessionData, isInitialized: isInitialized ?? state.isInitialized};
  }),
  on(clearSession, (_state) => {
    debugLog('🔒 Session cleared from the Local Storage');
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
        debugLog('🔓 Session loaded:', sessionData?.userAuth?.email);
        return {...state, sessionData};
      }
    }
    debugLog('🔍 No session found');
    return state;
  }),
  on(setInitialized, (state) => {
    debugLog('✨ App initialized');
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
