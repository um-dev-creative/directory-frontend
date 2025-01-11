import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {ServiceTemplate} from '@shared/service/service-template';
import {DIRECTORY_BACKEND_SERVICE_BASE_URL, HTTP_OPTIONS} from '@shared/app.const';

@Injectable({
  providedIn: 'root'
})
export class UserClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly contentPath: string = `${DIRECTORY_BACKEND_SERVICE_BASE_URL}/users`;
  constructor() { super(); }

  createUser(user: any): Observable<any> {
    return this.httpClient.post(this.contentPath, user, HTTP_OPTIONS).pipe(catchError(this.handlerError));
  }
}
