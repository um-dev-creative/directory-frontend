import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpResponse, HttpHeaders } from '@angular/common/http';
import { of, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthInterceptor } from './auth.interceptor';
import { SessionState, SessionData } from '@app/core/store/session/session.state';
import { DFC } from '@shared/constants/app.const';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
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

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: Store, useValue: mockStore }
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
    // Wait for subscription to update
    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, mockHandler);

    const passedReq: HttpRequest<any> = mockHandler.handle.calls.mostRecent().args[0];
    // Original request should pass through without auth headers set by interceptor
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
});
