import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ClientTemplate} from '@core/services/client-template';
import {DFC} from '@shared/constants/app.const';
import {sanitizeError} from '@shared/handler/error.handler';
import {BffResponse} from '@shared/models/bff-response.model';
import {BusinessSearchParams, BusinessSearchResponse} from '@shared/models/location.model';

/**
 * Client of the business search (`GET /api/v1/businesses/search` of directory-backend, through the BFF).
 */
@Injectable({
  providedIn: 'root'
})
export class BusinessSearchClient extends ClientTemplate {
  private readonly SEARCH_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.BUSINESS_PATH + DFC.RelativePath.SEARCH_PATH;

  /** Only the filters that have a value are sent. */
  search(params: BusinessSearchParams): Observable<BusinessSearchResponse> {
    let httpParams = new HttpParams();
    if (params.cityId) {
      httpParams = httpParams.set('city_id', params.cityId);
    }
    if (params.category) {
      httpParams = httpParams.set('category_id', params.category);
    }
    if (params.q?.trim()) {
      httpParams = httpParams.set('q', params.q.trim());
    }
    if (params.page) {
      httpParams = httpParams.set('page', String(params.page));
    }
    if (params.perPage) {
      httpParams = httpParams.set('per_page', String(params.perPage));
    }
    this.logInfo(`BusinessSearchClient.search:: ${this.SEARCH_PATH}`);
    return this.httpClient.get<BffResponse<BusinessSearchResponse>>(this.SEARCH_PATH, {params: httpParams}).pipe(
      map((response) => response.data ?? {total_count: 0, page: 1, per_page: params.perPage ?? 10, total_pages: 0, data: []}),
      catchError((err) => {
        const normalized = sanitizeError(err);
        this.logError('BusinessSearchClient.search error', normalized);
        return throwError(() => normalized);
      })
    );
  }
}
