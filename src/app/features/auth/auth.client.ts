import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {ClientTemplate} from '@core/services/client-template';
import {AUTHORIZATION_TOKEN_KEY, DFC, SESSION_TOKEN_BACKEND} from '@app/shared/constants/app.const';

/**
 * Auth client services to get token from backend services
 */
@Injectable({
  providedIn: 'root'
})
export class AuthClient extends ClientTemplate {
  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
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
   * @return Observable<any>
   */
  getToken(user: string, password: string): Observable<any> {
    const tokenURL = `${this.CONTENT_PATH}/access-token`;
    console.debug(`AuthClient.getToken:: ${tokenURL}`);
    return this.httpClient.post(tokenURL, {alias: user, password: password}, {
      headers: DFC.HttpHeader.STANDARD,
      observe: 'response'
    })
      .pipe(map(response => {
        const headers = response.headers;
        const body = response.body;
        const sessionTokenBkd = headers.get(SESSION_TOKEN_BACKEND);
        const authorization = headers.get(AUTHORIZATION_TOKEN_KEY);
        return {headers, body, sessionTokenBkd, authorization};
      }), catchError(this.handleError));
  }

  /**
   * Get token from backend services with user and password provided by the user
   * @param backboneToken - AuthTokenRequest
   * @return Observable<any>
   */
  closeSession(backboneToken: any): Observable<any> {
    return this.httpClient.delete<any>(`${this.CONTENT_PATH}/session-end`,
      DFC.HttpHeader.STANDARD_TOKEN_BKD(backboneToken))
      .pipe(catchError(this.handleError));
  }
}
