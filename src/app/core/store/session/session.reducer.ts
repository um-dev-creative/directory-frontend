import {createReducer, on} from '@ngrx/store';
import {clearSession, loadSession, saveSession, setInitialized} from './session.action';
import {initialState, SessionData, UserAuth} from './session.state';
import {getInitials} from '@shared/utils/get-initials.helper';

// Local debug helper for reducers (can't inject services here)
const debugLog = (...args: any[]) => {
  console.debug(...args);
};

const pickString = (next?: string, fallback = ''): string => next?.trim() || fallback;

const normalizeUserAuth = (userAuth: Partial<UserAuth> | undefined, currentUserAuth: UserAuth): UserAuth => {
  const nextFirstName = pickString(userAuth?.firstName, currentUserAuth.firstName ?? '');
  const nextLastName = pickString(userAuth?.lastName, currentUserAuth.lastName ?? '');
  const composedName = `${nextFirstName} ${nextLastName}`.trim();
  const nextDisplayName = pickString(
    userAuth?.displayName,
    pickString(userAuth?.fullName, currentUserAuth.displayName ?? currentUserAuth.fullName ?? composedName)
  );
  const nextFullName = pickString(
    userAuth?.fullName,
    pickString(userAuth?.displayName, composedName || currentUserAuth.fullName || currentUserAuth.displayName || '')
  );
  const nextAvatarUrl = pickString(userAuth?.avatarUrl, currentUserAuth.avatarUrl ?? '');
  const nextAvatarVersion = pickString(userAuth?.avatarVersion, currentUserAuth.avatarVersion ?? '');
  const nextInitials = pickString(userAuth?.initials, currentUserAuth.initials ?? getInitials(nextFirstName, nextLastName));

  return {
    ...currentUserAuth,
    ...userAuth,
    firstName: nextFirstName,
    lastName: nextLastName,
    displayName: nextDisplayName,
    fullName: nextFullName,
    avatarUrl: nextAvatarUrl,
    avatarVersion: nextAvatarVersion,
    initials: nextInitials,
    features: userAuth?.features ?? currentUserAuth.features ?? [],
    businesses: userAuth?.businesses ?? currentUserAuth.businesses ?? []
  };
};

const normalizeSessionData = (stateSessionData: SessionData, sessionData: SessionData): SessionData => ({
  ...stateSessionData,
  ...sessionData,
  userAuth: normalizeUserAuth(sessionData.userAuth, stateSessionData.userAuth)
});

const _sessionReducer = createReducer(
  initialState,
  on(saveSession, (state, {sessionData, isInitialized}) => {
    debugLog('🔐 Saving session:', sessionData?.userAuth?.email);
    return {
      ...state,
      sessionData: normalizeSessionData(state.sessionData, sessionData),
      isInitialized: isInitialized ?? state.isInitialized
    };
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
