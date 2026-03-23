import {inject, Injectable} from '@angular/core';
import {ClientTemplate} from '@core/services/client-template';
import {HttpClient} from '@angular/common/http';
import {DFC} from '@shared/constants/app.const';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimezoneClient extends ClientTemplate {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly TIMEZONE_CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.TIMEZONE_PATH;

  constructor() {
    super();
  }

  getTimezones(): Observable<any> {
    const url = this.TIMEZONE_CONTENT_PATH + '/all';
    this.logInfo(`TimezoneClient.getTimezones:: ${url}`);
    return this.http.get<any>(url, {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handleError));
  }
}
