import {inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {DFC} from '@shared/constants/app.const';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly store: Store<{ session: SessionState }> = inject(Store);
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

    if (bearerToken && directorySessionToken) {
      // Clone the request and add the authorization header correctamente
      const authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          'session-token': directorySessionToken
        }
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
