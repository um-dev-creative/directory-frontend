import {Injectable} from '@angular/core';
import {ClientTemplate} from '@core/services/client-template';
import {DFC} from '@shared/constants/app.const';
import {catchError, Observable, throwError} from 'rxjs';
import {
  BusinessCreateRequest,
  BusinessUpdateRequest,
  BusinessUpdateResponse
} from '@shared/models/business.model';
import {sanitizeError} from '@shared/handler/error.handler';

@Injectable({
  providedIn: 'root'
})
export class BusinessClient extends ClientTemplate {
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
      {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handleError));
  }

  getBusinessById(id: string): Observable<any> {
    const url = `${this.BUSINESS_CONTENT_PATH}/${id}`;
    return this.httpClient.get<any>(url).pipe(
      catchError((err) => {
        const normalized = sanitizeError(err);
        this.logError('BusinessClient.create error', normalized);
        return throwError(() => normalized);
      })
    );
  }

  updateBusiness(id: string, data: BusinessUpdateRequest): Observable<BusinessUpdateResponse> {
    const url = `${this.BUSINESS_CONTENT_PATH}/${id}`;
    return this.httpClient.patch<BusinessUpdateResponse>(url, data,
      { headers: DFC.HttpHeader.STANDARD }).pipe(
      catchError((err) => {
        const normalized = sanitizeError(err);
        this.logError('BusinessClient.updateBusiness error', normalized);
        return throwError(() => normalized);
      })
    );
  }
}
