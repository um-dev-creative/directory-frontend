import {createReducer, on} from '@ngrx/store';
import {clearSession, loadSession, saveSession, setInitialized} from './session.action';
import {initialState} from './session.state';

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
    debugLog('🔄 Load session dispatched (effect will handle localStorage)');
    return state;
  }),
  on(setInitialized, (state) => {
    debugLog('✨ App initialized');
    return {...state, isInitialized: true};
  })
);

export function sessionReducer(state: any, action: any) {
  return _sessionReducer(state, action);
}
