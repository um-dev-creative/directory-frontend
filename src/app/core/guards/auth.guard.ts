/*import {CanActivateFn} from '@angular/router';
import {Store} from "@ngrx/store";
import {SessionData} from "@app/core/store/session/session.state";
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const store: Store<{ app: SessionData }> = inject(Store);
    const sessionData = store.select(state => state.app);
    let isAuthenticated = false;
    if (sessionData) {
      sessionData.subscribe(data => {
            isAuthenticated = data.userAuth !== null && data.userAuth !== undefined;
        });
    } else {
      isAuthenticated = false;
    }
    return isAuthenticated;
};
*/


import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanActivateChildFn,
  CanMatchFn,
  Router
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionData } from '@app/core/store/session/session.state';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoggerService, StorageService } from '../services';

// Lógica compartida para verificar autenticación
function checkAuthState(targetUrl: string): Observable<boolean> {
  const store = inject(Store<{ app: SessionData }>);
  const router = inject(Router);
  const logger = inject(LoggerService);
  const storage = inject(StorageService);
  logger.debug(`[Guard] Checking authentication state for URL: ${targetUrl}`);

  const token = storage.getLocal<string>('auth_token');
  if (!token) {
    logger.warn(`No auth token found, redirecting to /auth (URL: ${targetUrl})`);
    storage.setLocal('redirect_url', targetUrl);
    router.navigate(['/auth']);
    return new Observable<boolean>(observer => observer.next(false));
  }
  logger.debug(`Auth token found, checking session state for URL: ${targetUrl}`);

  return store.select(state => state.app).pipe(
    take(1),
    tap(session => logger.debug('[Guard] session:', session)),
    map(session => !!(session?.userAuth)),
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        logger.warn(`User not authenticated, redirecting to /auth (URL: ${targetUrl})`);
        // Store the attempted URL for redirecting after login
        storage.setLocal('redirect_url', targetUrl);
        router.navigate(['/auth']);
      }
    })
  );
}

// Guard clásico para rutas protegidas
export const authGuard: CanActivateFn = (route, state) => {
  return checkAuthState(state.url);
};

// Guard para rutas hijas
export const authGuardChild: CanActivateChildFn = (childRoute, state) => {
  return checkAuthState(state.url);
};

// Guard para rutas con carga diferida (lazy loading)
export const authMatchGuard: CanMatchFn = (route, segments) => {
  const targetUrl = '/' + segments.map(s => s.path).join('/');
  return checkAuthState(targetUrl);
};
