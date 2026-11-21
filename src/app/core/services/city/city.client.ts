import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ClientTemplate} from '@core/services/client-template';
import {DFC} from '@shared/constants/app.const';
import {sanitizeError} from '@shared/handler/error.handler';
import {BffResponse} from '@shared/models/bff-response.model';
import {City} from '@shared/models/location.model';

/**
 * Client of the cities catalogue (`GET /api/v1/cities` of directory-backend, through the BFF).
 */
@Injectable({
  providedIn: 'root'
})
export class CityClient extends ClientTemplate {
  private readonly CITIES_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.CITIES_PATH;

  /**
   * @param country ISO 3166-1 alpha-2 code to filter by (optional)
   * @param text text found in the city name (optional)
   * @returns the cities ordered by name
   */
  getCities(country?: string, text?: string): Observable<City[]> {
    let params = new HttpParams();
    if (country) {
      params = params.set('country', country);
    }
    if (text) {
      params = params.set('q', text);
    }
    this.logInfo(`CityClient.getCities:: ${this.CITIES_PATH}`);
    return this.httpClient.get<BffResponse<City[]>>(this.CITIES_PATH, {params}).pipe(
      map((response) => response.data ?? []),
      catchError((err) => {
        const normalized = sanitizeError(err);
        this.logError('CityClient.getCities error', normalized);
        return throwError(() => normalized);
      })
    );
  }
}
