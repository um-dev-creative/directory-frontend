import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from '@shared/services/service-template';
import {HttpClient} from '@angular/common/http';
import {AUTH_PATH, DIRECTORY_BACKEND_SERVICE_BASE_URL, HTTP_OPTIONS, SESSION_TOKEN_BACKEND} from '@shared/app.const';
import {catchError, map, Observable} from 'rxjs';

/**
 * Auth client services to get token from backend services
 */
@Injectable({
  providedIn: 'root'
})
export class AuthClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DIRECTORY_BACKEND_SERVICE_BASE_URL;

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
    const tokenURL = `${this.CONTENT_PATH + AUTH_PATH}/token`;
    console.info(`UserClient.getToken:: ${tokenURL}`);
    return this.httpClient.post(tokenURL, {alias: user, password: password}, {
      ...HTTP_OPTIONS,
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
