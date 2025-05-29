import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private logger: LoggerService,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logger.error('HTTP Error occurred', error);

        let errorMessage = 'An unexpected error occurred';

        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request - Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized - Please login again';
            // Redirect to login or refresh token
            this.router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'Forbidden - You don\'t have permission';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error - Please try again later';
            break;
          case 0:
            errorMessage = 'Network error - Please check your connection';
            break;
          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            }
        }

        // Show notification for user-facing errors
        if (error.status !== 401) { // Don't show notification for auth errors as we redirect
          this.notificationService.error(errorMessage);
        }

        return throwError(() => error);
      })
    );
  }
}
