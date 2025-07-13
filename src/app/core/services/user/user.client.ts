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

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param {string} userId - The unique identifier of the user to be retrieved.
   * @return {Observable<any>} An Observable containing the user data or an error if the operation fails.
   */
  findUserById(userId: string): Observable<any> {
    this.logInfo(`UserClient.getUserById:: ${this.USER_CONTENT_PATH}/${userId}`);
    return this.httpClient.get<any>(`${this.USER_CONTENT_PATH}/${userId}`).pipe(catchError(this.handlerError));
  }

  /**
   * Creates a new user by sending the user data to the server.
   *
   * @param {any} user - The user object containing the details to be created.
   * @return {Observable<any>} An observable that emits the server response or an error if the operation fails.
   */
  createUser(user: any): Observable<any> {
    this.logInfo(`UserClient.createUser:: ${this.CONTENT_PATH}`);
    return this.httpClient.post(this.CONTENT_PATH + DFC.RelativePath.USER_CREATE_PATH, user, {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handlerError));
  }

  /**
   * Updates the user details for the specified user ID with the provided update request data.
   *
   * @param {string} userId - The unique identifier of the user to update.
   * @param {UserDetailUpdateRequest} updateRequest - An object containing the details to update for the user.
   * @return {Observable<any>} An observable containing the response of the update operation.
   */
  updateUser(userId: string, updateRequest: UserDetailUpdateRequest): Observable<any> {
    this.logInfo(`UserClient.updateUser:: ${this.USER_CONTENT_PATH}/${userId}`);
    this.logInfo(`UserClient.updateUser:: updateRequest: ${JSON.stringify(updateRequest)}`);
    return this.httpClient.put<any>(`${this.USER_CONTENT_PATH}/${userId}`, updateRequest, {
      headers: DFC.HttpHeader.STANDARD,
      observe: 'response' as 'body'
    })
      .pipe(catchError(this.handlerError));
  }

  /**
   * Deletes a user by their unique identifier.
   *
   * @param {string} userId - The unique identifier of the user to be deleted.
   * @return {Observable<any>} An Observable containing the server response or an error if the operation fails.
   */
  deleteUser(userId: string): Observable<any> {
    this.logInfo(`UserClient.deleteUser:: ${this.USER_CONTENT_PATH}/${userId}`);
    return this.httpClient.delete<any>(`${this.USER_CONTENT_PATH}/${userId}`, {headers: DFC.HttpHeader.STANDARD, observe: 'response' as 'body'})
      .pipe(catchError(this.handlerError));
  }
}
