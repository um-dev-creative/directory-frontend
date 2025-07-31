import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from '@app/core/services/service-template';
import {HttpClient} from '@angular/common/http';
import {DFC} from '@shared/constants/app.const';
import {catchError, Observable} from 'rxjs';
import {BusinessCreateRequest, BusinessDetailResponse} from '@shared/models/business.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.AUTH_PATH;
  private readonly BUSINESS_CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.BUSINESS_PATH;

  constructor() {
    super();
  }
  /**
   * Retrieves the business profile for the current user.
   * @returns An observable containing the business profile data.
   */
  create(businessCreateRequest: BusinessCreateRequest): Observable<any> {
    this.logInfo(`BusinessClient.create:: ${this.CONTENT_PATH}`);
    return this.httpClient.post<any>(this.BUSINESS_CONTENT_PATH, businessCreateRequest,
      {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handlerError));
  }

  getBusinessById(id: string): Observable<any> {
    const url = `${this.BUSINESS_CONTENT_PATH}/${id}`;
    return this.httpClient.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching business details:', error);
        throw error;
      })
    );
  }
}
