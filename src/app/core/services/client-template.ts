import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {inject} from '@angular/core';
import {LoggerService} from './logger.service';

export class ClientTemplate {

  protected readonly logger = inject(LoggerService);
  protected readonly httpClient: HttpClient = inject(HttpClient);

  constructor() {
    // keep constructor lightweight; logger is injected above
  }

  /**
   * Convenience wrapper used by subclasses to log informational messages.
   */
  protected logInfo(message: string, ...optional: any[]): void {
    try { this.logger.info(message, ...optional); } catch (e) { /* swallow */ }
  }

  /**
   * Convenience wrapper used by subclasses to log errors.
   */
  protected logError(message: string, error?: any, ...optional: any[]): void {
    try { this.logger.error(message, error, ...optional); } catch (e) { /* swallow */ }
  }

  public handlerError(errorResponse: HttpErrorResponse | ErrorEvent): any {
    if (errorResponse instanceof ErrorEvent) {
      this.logger.error('ClientTemplate handlerError (ErrorEvent)', errorResponse);
    } else {
      this.logger.error('ClientTemplate handlerError', {status: errorResponse.status, message: errorResponse.message});
    }
    return throwError(errorResponse);
  }

}
