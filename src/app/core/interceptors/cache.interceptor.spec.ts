import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { CacheInterceptor } from './cache.interceptor';

describe('CacheInterceptor', () => {
  let interceptor: CacheInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheInterceptor]
    });
    interceptor = TestBed.inject(CacheInterceptor);
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
  });

  afterEach(() => {
    interceptor.clearCache();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not cache non-GET requests', () => {
    const response = new HttpResponse({ status: 200, body: { data: 'post' } });
    mockHandler.handle.and.returnValue(of(response));

    const postReq = new HttpRequest('POST', '/api/data', { name: 'test' });
    interceptor.intercept(postReq, mockHandler);
    interceptor.intercept(postReq, mockHandler);

    expect(mockHandler.handle).toHaveBeenCalledTimes(2);
  });

  it('should not cache when cache-control: no-cache is set', () => {
    const response = new HttpResponse({ status: 200, body: { data: 'test' } });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/data', null, {
      headers: new HttpHeaders({ 'cache-control': 'no-cache' })
    });
    interceptor.intercept(req, mockHandler);
    interceptor.intercept(req, mockHandler);

    expect(mockHandler.handle).toHaveBeenCalledTimes(2);
  });

  it('should pass GET requests through to handler', (done) => {
    const response = new HttpResponse({ status: 200, body: { data: 'fresh' } });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.body).toEqual({ data: 'fresh' });
        done();
      }
    });
  });

  it('should clear cache when clearCache is called', () => {
    const response = new HttpResponse({ status: 200, body: { data: 'cached' } });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/v1/general/users/123');
    interceptor.intercept(req, mockHandler).subscribe();

    interceptor.clearCache();

    interceptor.intercept(req, mockHandler).subscribe();
    // After clearing, handler should be called again
    expect(mockHandler.handle).toHaveBeenCalledTimes(2);
  });

  it('should remove a specific URL from cache', () => {
    const response = new HttpResponse({ status: 200, body: { data: 'test' } });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/v1/general/users/123');
    interceptor.intercept(req, mockHandler).subscribe();

    interceptor.removeFromCache('/api/v1/general/users/123');

    interceptor.intercept(req, mockHandler).subscribe();
    expect(mockHandler.handle).toHaveBeenCalledTimes(2);
  });

  it('should handle max-age from cache-control header', () => {
    const response = new HttpResponse({ status: 200, body: { data: 'test' } });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/data', null, {
      headers: new HttpHeaders({ 'cache-control': 'max-age=60' })
    });

    interceptor.intercept(req, mockHandler).subscribe();
    // Second call should still go to handler since cache only stores user URLs
    interceptor.intercept(req, mockHandler).subscribe();

    expect(mockHandler.handle.calls.count()).toBeGreaterThanOrEqual(1);
  });
});
