import {Injectable} from '@angular/core';
import {ClientTemplate} from '@core/services/client-template';
import {DFC} from '@app/shared/constants/app.const';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyCodeClient extends ClientTemplate {
  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.AUTH_PATH + DFC.RelativePath.VERIFY_CODE_PATH;

  constructor() { super(); }

  confirmCode(userRegisterRequest: any): Observable<any> {
    this.logInfo(`VerifyCodeClient.confirmCode -> POST ${this.CONTENT_PATH}`);
    return this.httpClient.post(this.CONTENT_PATH, userRegisterRequest).pipe(catchError(this.handleError));
  }

 }
