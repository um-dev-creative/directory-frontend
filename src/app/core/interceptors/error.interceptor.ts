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
    private readonly router: Router,
    private readonly logger: LoggerService,
    private readonly notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logger.error('HTTP Error occurred', error);

        let errorMessage = 'An unexpected error occurred';
        let shouldRedirect = false;

        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request - Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized - Please login again';
            // Only redirect to auth if this is NOT a login request
            // Check if the request URL contains auth/token or login endpoints
            const isAuthRequest = req.url.includes('/auth/token') ||
                                 req.url.includes('/login') ||
                                 req.url.includes('/auth/drb/api/v1/auth');
            if (!isAuthRequest) {
              shouldRedirect = true;
            }
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

        // Redirect to auth page if needed
        if (shouldRedirect) {
          this.router.navigate(['/auth']);
        }

        // Show notification for user-facing errors, but not for auth requests
        // as the component should handle its own error messaging
        const isAuthRequest = req.url.includes('/auth/token') ||
                             req.url.includes('/login') ||
                             req.url.includes('/auth/drb/api/v1/auth');
        if (error.status !== 401 || !isAuthRequest) {
          this.notificationService.error(errorMessage);
        }

        return throwError(() => error);
      })
    );
  }
}
