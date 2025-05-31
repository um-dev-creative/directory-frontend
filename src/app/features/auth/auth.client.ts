import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from '@app/core/services/service-template';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {DFC, SESSION_TOKEN_BACKEND} from '@app/shared/constants/app.const';

export interface AuthTokenRequest {
  alias: string;
  password: string;
}

export interface AuthTokenResponse {
  headers: any;
  body: any;
  sessionTokenBkd: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Auth client services to get token from backend services
 */
@Injectable({
  providedIn: 'root'
})
export class AuthClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DFC.RelativePath.AUTH_DIRECTORY_BACKEND_SERVICE_BASE_URL +
    DFC.RelativePath.AUTH_PATH;

  /**
   * Constructor of AuthClient
   */
  constructor() {
    super();
  }

  /**
   * Get token from backend services with user and password provided by the user
   * @param user
   * @param password
   */
  getToken(user: string, password: string): Observable<any> {
    const tokenURL = `${this.CONTENT_PATH}/token`;
    console.debug(`AuthClient.getToken:: ${tokenURL}`);
    return this.httpClient.post(tokenURL, {alias: user, password: password}, {
      ...{headers: DFC.HttpHeader.STANDARD},
      observe: 'response'
    })
      .pipe(map(response => {
        const headers = response.headers;
        const body = response.body;
        const sessionTokenBkd = headers.get(SESSION_TOKEN_BACKEND);
        return {headers, body, sessionTokenBkd};
      }), catchError(this.handlerError));
  }
}
