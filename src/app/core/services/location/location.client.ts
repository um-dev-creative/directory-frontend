import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ClientTemplate} from '@core/services/client-template';
import {DFC} from '@shared/constants/app.const';
import {sanitizeError} from '@shared/handler/error.handler';
import {BffResponse} from '@shared/models/bff-response.model';
import {Location, LocationCreateRequest, LocationUpdateRequest} from '@shared/models/location.model';

/**
 * Client of the locations (sedes) of a business. Reading is open to any session; creating, changing and deleting are reserved
 * for the owner of the business (the backend answers 403 otherwise).
 */
@Injectable({
  providedIn: 'root'
})
export class LocationClient extends ClientTemplate {
  private readonly BUSINESS_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.BUSINESS_PATH;

  private locationsUrl(businessId: string): string {
    return `${this.BUSINESS_PATH}/${encodeURIComponent(businessId)}${DFC.RelativePath.LOCATIONS_PATH}`;
  }

  /** @returns the locations of the business, the main one first */
  list(businessId: string): Observable<Location[]> {
    return this.httpClient.get<BffResponse<Location[]>>(this.locationsUrl(businessId)).pipe(
      map((response) => response.data ?? []),
      catchError((err) => this.fail('list', err))
    );
  }

  create(businessId: string, request: LocationCreateRequest): Observable<Location> {
    return this.httpClient.post<BffResponse<Location>>(this.locationsUrl(businessId), request, {headers: DFC.HttpHeader.STANDARD})
      .pipe(map((response) => response.data as Location), catchError((err) => this.fail('create', err)));
  }

  update(businessId: string, locationId: string, request: LocationUpdateRequest): Observable<Location> {
    return this.httpClient.patch<BffResponse<Location>>(`${this.locationsUrl(businessId)}/${encodeURIComponent(locationId)}`, request,
      {headers: DFC.HttpHeader.STANDARD}).pipe(map((response) => response.data as Location), catchError((err) => this.fail('update', err)));
  }

  delete(businessId: string, locationId: string): Observable<void> {
    return this.httpClient.delete<BffResponse<null>>(`${this.locationsUrl(businessId)}/${encodeURIComponent(locationId)}`)
      .pipe(map(() => undefined), catchError((err) => this.fail('delete', err)));
  }

  private fail(operation: string, err: unknown): Observable<never> {
    const normalized = sanitizeError(err);
    this.logError(`LocationClient.${operation} error`, normalized);
    return throwError(() => normalized);
  }
}
