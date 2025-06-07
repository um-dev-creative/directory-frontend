import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {ServiceTemplate} from '@app/core/services/service-template';
import {DFC} from '@app/shared/constants/app.const';

@Injectable({
  providedIn: 'root'
})
export class UserClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.AUTH_PATH + DFC.RelativePath.USER_CREATE_PATH;

  constructor() {
    super();
  }

  createUser(user: any): Observable<any> {
    console.debug(`UserClient.createUser:: ${(this.CONTENT_PATH)}`);
    return this.httpClient.post(this.CONTENT_PATH, user, {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handlerError));
  }
}
