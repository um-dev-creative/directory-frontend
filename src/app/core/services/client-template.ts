import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {inject} from '@angular/core';

export class ClientTemplate {

  protected logInfo: (...arg: any) => void;
  protected logError: (...arg: any) => void;
  protected readonly httpClient: HttpClient = inject(HttpClient);

  constructor() {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
  }

  public handlerError(errorResponse: HttpErrorResponse | ErrorEvent): any {
    if (errorResponse instanceof ErrorEvent) {
      console.error(errorResponse);
    } else {
      console.error(`Code: ${errorResponse.status}, Message: Error: ${errorResponse.message}`);
    }
    return throwError(errorResponse);
  }

}
