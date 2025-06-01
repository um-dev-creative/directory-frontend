import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {ServiceTemplate} from '@shared/services/service-template';
import {DFC} from '@shared/app.const';

@Injectable({
  providedIn: 'root'
})
export class UserClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DFC.RelativePath.AUTH_DIRECTORY_BACKEND_SERVICE_BASE_URL +
    DFC.RelativePath.USER_REGISTER_PATH;

  constructor() { super(); }

  createUser(user: any): Observable<any> {
    console.debug(`UserClient.createUser:: ${(this.CONTENT_PATH)}`);
    return this.httpClient.post(this.CONTENT_PATH, user, {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handlerError));
  }
}
