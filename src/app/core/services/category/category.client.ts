import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DFC} from '@shared/constants/app.const';
import {ClientTemplate} from '@core/services/client-template';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryClient extends ClientTemplate {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly CATEGORY_CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.GENERAL_PATH + DFC.RelativePath.CATEGORY_PATH;

  constructor() {
    super();
  }

  getCategories(): Observable<any> {
    this.logInfo(`CategoryClient.getCategories:: ${this.CATEGORY_CONTENT_PATH}`);
    return this.http.get<any>(this.CATEGORY_CONTENT_PATH, {headers: DFC.HttpHeader.STANDARD}).pipe(catchError(this.handleError));
  }
}
