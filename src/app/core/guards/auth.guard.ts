import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanActivateChildFn,
  CanMatchFn,
  Router
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionData, SessionState } from '@app/core/store/session/session.state';
import { take, filter, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoggerService, StorageMockService } from '../services';

// Helper function to validate authentication data
function isValidAuthData(sessionData: SessionData | undefined): boolean {
  if (!sessionData || !sessionData.userAuth) {
    return false;
  }

  const { userAuth, token } = sessionData;

  // Check that all required fields have non-empty values
  return !!(
    token && token.trim() !== '' &&
    userAuth.sessionToken && userAuth.sessionToken.trim() !== '' &&
    userAuth.alias && userAuth.alias.trim() !== ''
  );
}

// Lógica compartida para verificar autenticación
function checkAuthState(targetUrl: string): Observable<boolean> {
  const store = inject(Store<{ session: SessionState }>);
  const router = inject(Router);
  const logger = inject(LoggerService);
  const storage = inject(StorageMockService);

  console.log(`[Guard] Checking authentication state for URL: ${targetUrl}`);

  // First, wait for initialization to complete
  return store.select(state => state.session).pipe(
    tap(sessionState => {
      const hasToken = !!(sessionState?.sessionData?.token && sessionState.sessionData.token.trim() !== '');
      console.debug(
        `[Guard] pre-filter | ts=${new Date().toISOString()} | isInitialized=${sessionState?.isInitialized} | hasToken=${hasToken} | url=${targetUrl}`
      );
    }),
    filter(sessionState => {
      console.log(`[Guard] Checking if initialized:`, sessionState?.isInitialized);
      return sessionState?.isInitialized === true;
    }),
    take(1),
    switchMap(sessionState => {
      console.log(`[Guard] Initialization complete, checking session data for URL: ${targetUrl}`);
      console.log(`[Guard] Session state:`, sessionState);

      const sessionData = sessionState?.sessionData;
      console.log(`[Guard] Session Data for URL ${targetUrl}:`, sessionData);
      console.log(`[Guard] Type of sessionData:`, typeof sessionData);

      const isAuthenticated = isValidAuthData(sessionData);
      console.log(`[Guard] Is authenticated for ${targetUrl}:`, isAuthenticated);
      console.log(`[Guard] Authentication details:`, {
        hasSessionData: !!sessionData,
        hasUserAuth: !!(sessionData?.userAuth),
        hasToken: !!(sessionData?.token && sessionData.token !== ''),
        hasSessionToken: !!(sessionData?.userAuth?.sessionToken && sessionData.userAuth.sessionToken !== ''),
        hasAlias: !!(sessionData?.userAuth?.alias && sessionData.userAuth.alias !== '')
      });

      if (isAuthenticated) {
        console.log(`[Guard] User authenticated, access granted for URL: ${targetUrl}`);
        logger.debug(`User authenticated, access granted for URL: ${targetUrl}`);
        return [true];
      } else {
        console.log(`[Guard] User not authenticated, redirecting to /auth (URL: ${targetUrl})`);
        logger.warn(`User not authenticated, redirecting to /auth (URL: ${targetUrl})`);
        storage.setLocal('redirect_url', targetUrl);
        router.navigate(['/auth']);
        return [false];
      }
    })
  );
}

// Guard clásico para rutas protegidas
export const authGuard: CanActivateFn = (route, state) => {
  console.log(`[authGuard] Called for route: ${state.url}`);
  console.log(`[authGuard] Route params:`, route);
  return checkAuthState(state.url);
};

// Guard para rutas hijas
export const authGuardChild: CanActivateChildFn = (_childRoute, state) => {
  return checkAuthState(state.url);
};

// Guard para rutas con carga diferida (lazy loading)
export const authMatchGuard: CanMatchFn = (_route, segments) => {
  const targetUrl = '/' + segments.map(s => s.path).join('/');
  return checkAuthState(targetUrl);
};
