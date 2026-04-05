import {inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {HeaderService} from '@app/header/header.service';
import {HeaderType} from '@shared/constants/header-type';
import {DFC} from '@shared/constants/app.const';

/**
 * AuthInterceptor — responsabilidad: adjuntar tokens de autenticación a las
 * peticiones HTTP salientes y manejar la respuesta 401 (limpiar sesión,
 * resetear header y redirigir a /auth).
 *
 * Es el único interceptor que navega a /auth y limpia la sesión; el
 * ErrorInterceptor delega esa responsabilidad aquí para evitar doble
 * navegación y estados inconsistentes.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly sessionStoreService = inject(SessionStoreService);
  private readonly headerService = inject(HeaderService);
  private readonly router = inject(Router);
  private sessionData: SessionData | undefined;

  constructor() {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth header for certain requests
    if (req.headers.get('skip-auth') === 'true') {
      return next.handle(req);
    }
    if (req.url.includes(DFC.RelativePath.ASSETS_i18_PATH)) {
      // Skip auth header for Backbone and Directory Backend requests
      return next.handle(req);
    }
    // Get bearerToken from storage
    const bearerToken = this.sessionData?.userAuth?.authorization;
    const directorySessionToken = this.sessionData?.userAuth?.sessionToken;

    let outReq = req;

    if (bearerToken && directorySessionToken) {
      // Clone the request and add the authorization header correctly
      if (req.body instanceof FormData) {
        outReq = req.clone({
          headers: req.headers.set('session-token', directorySessionToken)
        });
      } else {
        outReq = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
            'session-token': directorySessionToken
          }
        });
      }
    }

    return next.handle(outReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const tokenPreview = this.sessionData?.userAuth?.sessionToken
            ? `...${this.sessionData.userAuth.sessionToken.slice(-8)}`
            : 'none';
          console.warn(
            `[AuthInterceptor] 401 caught | ts=${new Date().toISOString()} | url=${req.url} | tokenPreview=${tokenPreview}`
          );

          // No limpiar sesión ni redirigir si el 401 viene de un endpoint
          // de autenticación (login, token, verify-code). Un 401 en estos
          // endpoints significa credenciales inválidas, no sesión expirada.
          const isAuthEndpoint =
            req.url.includes('/auth/') ||
            req.url.includes('/login');

          // Solo limpiar sesión y redirigir si:
          //  1. NO es un endpoint de auth (el componente de login maneja su propio error)
          //  2. El usuario tenía una sesión activa (evita limpiar estado vacío)
          const wasAuthenticated = !!this.sessionData?.userAuth?.sessionToken;

          if (!isAuthEndpoint && wasAuthenticated) {
            this.sessionStoreService.clearSessionData();
            this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
            this.router.navigate([DFC.RelativePath.AUTH_PATH]);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
