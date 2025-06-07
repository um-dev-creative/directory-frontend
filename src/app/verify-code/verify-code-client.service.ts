import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from '@app/core/services/service-template';
import {HttpClient} from '@angular/common/http';
import {DFC} from '@app/shared/constants/app.const';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyCodeClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.VERIFY_CODE_PATH;

  constructor() { super(); }

  confirmCode(userRegisterRequest: any, sessionToken: string, sessionTokenBkd: string, authorization: string): Observable<any> {
    console.debug(`UserRegisterClient.confirmCode:: ${(this.CONTENT_PATH)}`);
    return this.httpClient.post(this.CONTENT_PATH, userRegisterRequest, DFC.HttpHeader.STANDARD_TOKEN_DIR(sessionToken, sessionTokenBkd, authorization)).pipe(catchError(this.handlerError));
  }

  /**
   * Checks if the verification code process is completed for a user.
   * @param userId The user's unique identifier
   * @param sessionToken The session token
   * @param sessionTokenBkd The backup session token
   * @param authorization The authorization header value
   * @returns Observable<any> with verification status
   */
  checkVerificationCompleted(userId: string, sessionToken: string, sessionTokenBkd: string, authorization: string): Observable<any> {
    const url = `${this.CONTENT_PATH}/completed?userId=${userId}`;
    const headers = DFC.HttpHeader.STANDARD_TOKEN_DIR(sessionToken, sessionTokenBkd, authorization);
    return this.httpClient.get(url, headers).pipe(catchError(this.handlerError));
  }

}
