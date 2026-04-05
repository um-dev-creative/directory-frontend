import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorInterceptor } from './error.interceptor';
import { LoggerService } from '@app/core/services/logger.service';
import { NotificationService } from '@app/core/services/notification.service';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLogger: jasmine.SpyObj<LoggerService>;
  let mockNotification: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLogger = jasmine.createSpyObj('LoggerService', ['debug', 'info', 'warn', 'error']);
    mockNotification = jasmine.createSpyObj('NotificationService', [
      'success', 'error', 'warning', 'info', 'errorWithReport', 'errorWithExternalLink'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLogger },
        { provide: NotificationService, useValue: mockNotification }
      ]
    });

    interceptor = TestBed.inject(ErrorInterceptor);
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through successful responses', (done) => {
    const response = new HttpResponse({ status: 200, body: { ok: true } });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.body).toEqual({ ok: true });
        done();
      }
    });
  });

  it('should log the error but NOT redirect on 401 (AuthInterceptor owns that)', (done) => {
    // ErrorInterceptor delegates 401 navigation to AuthInterceptor to avoid
    // double-redirects and inconsistent state.
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: '/api/profile'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('GET', '/api/profile');
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        expect(mockLogger.error).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should NOT redirect for auth-related 401 errors', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: '/auth/token'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('POST', '/auth/token', {});
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => {
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle 500 server error and show notification', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      url: '/api/data'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => {
        expect(mockNotification.errorWithExternalLink).toHaveBeenCalled();
        expect(mockLogger.error).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle network error (status 0)', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: '/api/data'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => {
        expect(mockLogger.error).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle 404 Not Found error', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: '/api/unknown'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('GET', '/api/unknown');
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => {
        expect(mockLogger.error).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should suppress notification for 406 on verify-code endpoint', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 406,
      statusText: 'Not Acceptable',
      url: '/api/v1/auth/verify-code'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('POST', '/api/v1/auth/verify-code', {});
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => {
        expect(mockNotification.errorWithExternalLink).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle ProgressEvent (network/parsing errors)', (done) => {
    const progressEvent = new ProgressEvent('error');
    const errorResponse = new HttpErrorResponse({
      error: progressEvent,
      status: 0,
      statusText: 'Unknown Error',
      url: '/api/data'
    });
    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe({
      error: (err) => {
        expect(err.message).toBe('Network error or invalid response format');
        done();
      }
    });
  });
});
