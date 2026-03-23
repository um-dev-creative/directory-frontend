import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {throwError, Observable} from "rxjs";
import {inject} from '@angular/core';
import {LoggerService} from './logger.service';

export class ClientTemplate {

  protected readonly logger = inject(LoggerService);
  protected readonly httpClient: HttpClient = inject(HttpClient);


  /**
   * Convenience wrapper used by subclasses to log informational messages.
   */
  protected logInfo(message: string, ...optional: any[]): void {
    try {
      this.logger.info(message, ...optional);
    } catch (e) {
      console.error(message, ...optional, e);
    }
  }

  /**
   * Convenience wrapper used by subclasses to log errors.
   */
  protected logError(message: string, error?: any, ...optional: any[]): void {
    try {
      this.logger.error(message, error, ...optional);
    } catch (e) {
      console.error(message, ...optional, e);
    }
  }

  public handleError = (errorResponse: HttpErrorResponse | ErrorEvent): Observable<never> => {
    if (errorResponse instanceof ErrorEvent) {
      this.logger.error('ClientTemplate handleError (ErrorEvent)', errorResponse);
    } else {
      this.logger.error('ClientTemplate handlerError', {status: errorResponse.status, message: errorResponse.message});
    }
    // RxJS v7+ throws deprecation if you pass the error directly. Use factory form.
    return throwError(() => errorResponse);
  }

}
