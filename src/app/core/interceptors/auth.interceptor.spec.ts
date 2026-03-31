import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { SessionData } from '@app/core/store/session/session.state';
import { SessionStoreService } from '@app/core/store/session/session-store.service';
import { HeaderService } from '@app/header/header.service';
import { HeaderType } from '@shared/constants/header-type';
import { DFC } from '@shared/constants/app.const';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
  let mockSessionStoreService: jasmine.SpyObj<SessionStoreService>;
  let mockHeaderService: jasmine.SpyObj<HeaderService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let sessionSubject: BehaviorSubject<{ sessionData: SessionData | undefined }>;

  const mockSessionData: SessionData = {
    token: 'my-token',
    userAuth: {
      alias: 'john',
      email: 'john@test.com',
      fullName: 'John Doe',
      sessionToken: 'dir-session-token',
      sessionTokenBkd: 'bkd-token',
      authorization: 'bearer-auth-token',
      features: [],
      businesses: []
    }
  };

  beforeEach(() => {
    sessionSubject = new BehaviorSubject<{ sessionData: SessionData | undefined }>({
      sessionData: mockSessionData
    });

    const mockStore = {
      select: jasmine.createSpy('select').and.returnValue(sessionSubject.asObservable())
    };

    mockSessionStoreService = jasmine.createSpyObj('SessionStoreService', ['clearSessionData']);
    mockHeaderService = jasmine.createSpyObj('HeaderService', ['setHeaderType']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: Store, useValue: mockStore },
        { provide: SessionStoreService, useValue: mockSessionStoreService },
        { provide: HeaderService, useValue: mockHeaderService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockHandler.handle.and.returnValue(of(new HttpResponse({ status: 200 })));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add auth headers to a JSON request', () => {
    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, mockHandler);

    const interceptedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedReq.headers.get('Authorization')).toBe('Bearer bearer-auth-token');
    expect(interceptedReq.headers.get('session-token')).toBe('dir-session-token');
    expect(interceptedReq.headers.get('Content-Type')).toBe('application/json');
  });

  it('should skip auth headers when skip-auth header is present', () => {
    const req = new HttpRequest('GET', '/api/data', null, {
      headers: new HttpHeaders({ 'skip-auth': 'true' })
    });

    interceptor.intercept(req, mockHandler);

    const passedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    expect(passedReq.headers.has('Authorization')).toBeFalse();
  });

  it('should skip auth headers for i18n asset requests', () => {
    const req = new HttpRequest('GET', DFC.RelativePath.ASSETS_i18_PATH + 'es.json');

    interceptor.intercept(req, mockHandler);

    const passedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    expect(passedReq.headers.has('Authorization')).toBeFalse();
  });

  it('should only set session-token for FormData requests (no Content-Type override)', () => {
    const formData = new FormData();
    formData.append('file', 'test');
    const req = new HttpRequest('POST', '/api/upload', formData);

    interceptor.intercept(req, mockHandler);

    const interceptedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedReq.headers.get('session-token')).toBe('dir-session-token');
    // FormData should not set Content-Type (browser sets it with boundary)
    expect(interceptedReq.headers.has('Authorization')).toBeFalse();
  });

  it('should pass request through when no session data exists', () => {
    sessionSubject.next({ sessionData: undefined });
    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, mockHandler);

    const passedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    expect(passedReq.url).toBe('/api/data');
  });

  it('should pass request through when bearer token is missing', () => {
    sessionSubject.next({
      sessionData: {
        token: 'my-token',
        userAuth: {
          alias: 'john',
          email: 'john@test.com',
          fullName: 'John',
          sessionToken: 'dir-session-token',
          sessionTokenBkd: '',
          authorization: '',
          features: [],
          businesses: []
        }
      }
    });

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler);

    const passedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    expect(passedReq.url).toBe('/api/data');
  });

  describe('401 handling', () => {
    beforeEach(() => {
      mockHandler.handle.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))
      );
    });

    it('should clear session data on 401 response', () => {
      const req = new HttpRequest('GET', '/api/data');

      interceptor.intercept(req, mockHandler).subscribe({ error: () => {} });

      expect(mockSessionStoreService.clearSessionData).toHaveBeenCalledTimes(1);
    });

    it('should set header to GENERAL_HEADER on 401 response', () => {
      const req = new HttpRequest('GET', '/api/data');

      interceptor.intercept(req, mockHandler).subscribe({ error: () => {} });

      expect(mockHeaderService.setHeaderType).toHaveBeenCalledWith(HeaderType.GENERAL_HEADER);
    });

    it('should navigate to AUTH_PATH on 401 response', () => {
      const req = new HttpRequest('GET', '/api/data');

      interceptor.intercept(req, mockHandler).subscribe({ error: () => {} });

      expect(mockRouter.navigate).toHaveBeenCalledWith([DFC.RelativePath.STAGE_PATH]);
    });

    it('should re-throw the 401 error after handling', (done) => {
      const req = new HttpRequest('GET', '/api/data');

      interceptor.intercept(req, mockHandler).subscribe({
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          done();
        }
      });
    });

    it('should NOT clear session on non-401 errors', () => {
      mockHandler.handle.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }))
      );
      const req = new HttpRequest('GET', '/api/data');

      interceptor.intercept(req, mockHandler).subscribe({ error: () => {} });

      expect(mockSessionStoreService.clearSessionData).not.toHaveBeenCalled();
      expect(mockHeaderService.setHeaderType).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
