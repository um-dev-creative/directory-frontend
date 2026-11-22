import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ClientTemplate} from '@core/services/client-template';
import {DFC} from '@shared/constants/app.const';
import {sanitizeError} from '@shared/handler/error.handler';
import {BffResponse} from '@shared/models/bff-response.model';
import {BusinessStats} from '@shared/models/business-stats.model';

/**
 * Client of the business statistics (`POST .../views` and `GET .../stats` of directory-backend, through the BFF).
 */
@Injectable({
  providedIn: 'root'
})
export class BusinessStatsClient extends ClientTemplate {
  private readonly BUSINESS_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.BUSINESS_PATH;

  private businessUrl(businessId: string): string {
    return `${this.BUSINESS_PATH}/${encodeURIComponent(businessId)}`;
  }

  /** Counts one view of the business. Nothing about the visitor is sent or stored; the owner's own views are ignored by the backend. */
  recordView(businessId: string): Observable<void> {
    return this.httpClient.post<BffResponse<null>>(`${this.businessUrl(businessId)}${DFC.RelativePath.VIEWS_PATH}`, {},
      {headers: DFC.HttpHeader.STANDARD}).pipe(
      map(() => undefined),
      catchError((err) => this.fail('recordView', err))
    );
  }

  /** Summary of the last `days` days; owner only (the backend answers 403 otherwise). */
  getStats(businessId: string, days: number): Observable<BusinessStats> {
    const params = new HttpParams().set('days', String(days));
    return this.httpClient.get<BffResponse<BusinessStats>>(`${this.businessUrl(businessId)}${DFC.RelativePath.STATS_PATH}`, {params}).pipe(
      map((response) => response.data as BusinessStats),
      catchError((err) => this.fail('getStats', err))
    );
  }

  private fail(operation: string, err: unknown): Observable<never> {
    const normalized = sanitizeError(err);
    this.logError(`BusinessStatsClient.${operation} error`, normalized);
    return throwError(() => normalized);
  }
}
