import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LoggerService, NotificationService} from '@app/core/services';
import {DirectoryFrontendConst} from '@shared/constants/app.const';

/**
 * ErrorInterceptor — responsabilidad: logging centralizado y notificaciones
 * de errores HTTP al usuario (toast con enlace a "Reportar un problema").
 *
 * NO maneja redirección ni limpieza de sesión en 401; esa responsabilidad
 * pertenece exclusivamente a AuthInterceptor para evitar doble navegación
 * y estados inconsistentes.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly router: Router,
    private readonly logger: LoggerService,
    private readonly notificationService: NotificationService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // SSR: browser-only — ProgressEvent does not exist in Node.js
        if (typeof ProgressEvent !== 'undefined' && error.error instanceof ProgressEvent) {
          console.error('Network or parsing error:', error.message);
          return throwError(() => new Error('Network error or invalid response format'));
        }

        this.logger.error('HTTP Error occurred', error.message, error);

        let errorMessage = 'An unexpected error occurred';
        let shouldRedirect = false;
        let shouldNotify = true;

        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request - Please check your input';
            break;
          case 401: {
            errorMessage = 'Unauthorized - Please login again';
            // 401 redirect y limpieza de sesión los maneja AuthInterceptor.
            // Aquí solo logueamos; no redirigimos ni mostramos toast para
            // evitar doble navegación y notificaciones duplicadas.
            shouldRedirect = false;
            shouldNotify = false;
            break;
          }
          case 403:
            errorMessage = 'Forbidden - You don\'t have permission';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 406:
            if (req.url.includes('api/v1/auth/verify-code')) {
              shouldNotify = false;
              break;
            }
            errorMessage = error.error?.message || 'Not Acceptable - The request was not acceptable';
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
          this.router.navigate([DirectoryFrontendConst.RelativePath.AUTH_PATH]);
        }

        // Show notification for user-facing errors, but not for auth requests
        // as the component should handle its own error messaging
        const isAuthRequest = req.url.includes('/auth/token') ||
          req.url.includes('/login') ||
          req.url.includes('/auth/drb/api/v1/auth');
        if (shouldNotify && (error.status !== 401 || !isAuthRequest)) {
          const sanitizedMessage = (errorMessage || '')
            .substring(0, 100) // Limit to 100 characters
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

          const encodedMessage = encodeURIComponent(sanitizedMessage);
          this.notificationService.errorWithExternalLink(
            errorMessage,
            `https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=${encodedMessage}`,
            'Reportar un problema');
        }

        return throwError(() => error);
      })
    );
  }
}
