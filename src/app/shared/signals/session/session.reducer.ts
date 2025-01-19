import {createReducer, on} from '@ngrx/store';
import {clearSession, loadSession, saveSession} from './session.action';
import {initialState, SessionData} from './session.state';

const _sessionReducer = createReducer(
  initialState,
  on(saveSession, (state, {data, token}) => {
    return {sessionData: data, token: token};
  }),
  on(clearSession, () => initialState),
  on(loadSession, (state) => {
    if (isSessionStorageAvailable()) {
      const storedSession = sessionStorage.getItem('currentSession');
      if (storedSession) {
        const sessionData: SessionData = JSON.parse(storedSession);
        return {...state, ...sessionData};
      }
    }
    return state;
  })
);

const isSessionStorageAvailable = () => {
  try {
    const testKey = '__test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function sessionReducer(state: any, action: any) {
  return _sessionReducer(state, action);
}
