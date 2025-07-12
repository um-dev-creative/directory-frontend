import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {ServiceTemplate} from '@app/core/services/service-template';
import {DFC} from '@app/shared/constants/app.const';
import {UserDetailUpdateRequest} from '@shared/models/user-detail-update-request';

@Injectable({
  providedIn: 'root'
})
export class UserClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.AUTH_PATH;
  private readonly USER_CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.USERS_PATH;
  /** Function to log errors */


  constructor() {
    super();
  }

  findUserById(userId: string): Observable<any> {
    this.logInfo(`UserClient.getUserById:: ${this.USER_CONTENT_PATH}/${userId}`);
    return this.httpClient.get<any>(`${this.USER_CONTENT_PATH}/${userId}`).pipe(catchError(this.handlerError));
  }

  createUser(user: any): Observable<any> {
    this.logInfo(`UserClient.createUser:: ${this.CONTENT_PATH}`);
    return this.httpClient.post(this.CONTENT_PATH + DFC.RelativePath.USER_CREATE_PATH, user, {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handlerError));
  }

  /**
   * Updates user details
   * @param userId The ID of the user to update
   * @param updateRequest The update payload
   */
  updateUser(userId: string, updateRequest: UserDetailUpdateRequest): Observable<any> {
    this.logInfo(`UserClient.updateUser:: ${this.USER_CONTENT_PATH}/${userId}`);
    this.logInfo(`UserClient.updateUser:: updateRequest: ${JSON.stringify(updateRequest)}`);
    return this.httpClient.put<any>(`${this.USER_CONTENT_PATH}/${userId}`, updateRequest, {headers: DFC.HttpHeader.STANDARD, observe: 'response' as 'body'})
      .pipe(catchError(this.handlerError));
  }
}
