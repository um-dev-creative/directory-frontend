import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '@app/core/services/loading.service';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['showGlobal', 'hideGlobal']);

    TestBed.configureTestingModule({
      providers: [
        LoadingInterceptor,
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    });

    interceptor = TestBed.inject(LoadingInterceptor);
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call showGlobal when request starts', () => {
    const response = new HttpResponse({ status: 200 });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe();

    expect(mockLoadingService.showGlobal).toHaveBeenCalledTimes(1);
  });

  it('should call hideGlobal after request completes via finalize', () => {
    const response = new HttpResponse({ status: 200 });
    mockHandler.handle.and.returnValue(of(response));

    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, mockHandler).subscribe();

    // finalize runs synchronously after of() completes
    expect(mockLoadingService.hideGlobal).toHaveBeenCalledTimes(1);
  });

  it('should skip loading when skip-loading header is present', () => {
    const response = new HttpResponse({ status: 200 });
    mockHandler.handle.and.returnValue(of(response));

    const reqWithSkip = new HttpRequest('GET', '/api/data');
    const headers = reqWithSkip.headers.set('skip-loading', 'true');
    const skippedReq = reqWithSkip.clone({ headers });

    interceptor.intercept(skippedReq, mockHandler).subscribe();

    expect(mockLoadingService.showGlobal).not.toHaveBeenCalled();
    expect(mockLoadingService.hideGlobal).not.toHaveBeenCalled();
  });

  it('should handle multiple concurrent requests correctly', () => {
    const response = new HttpResponse({ status: 200 });
    mockHandler.handle.and.returnValue(of(response));

    const req1 = new HttpRequest('GET', '/api/data1');
    const req2 = new HttpRequest('GET', '/api/data2');

    interceptor.intercept(req1, mockHandler).subscribe();
    interceptor.intercept(req2, mockHandler).subscribe();

    expect(mockLoadingService.showGlobal).toHaveBeenCalledTimes(2);
    expect(mockLoadingService.hideGlobal).toHaveBeenCalledTimes(2);
  });

  it('should call hideGlobal even when request errors', () => {
    mockHandler.handle.and.returnValue(
      new Observable((subscriber) => {
        subscriber.error(new Error('Network error'));
      })
    );

    const req = new HttpRequest('GET', '/api/fails');
    interceptor.intercept(req, mockHandler).subscribe({
      error: () => { /* expected */ }
    });

    expect(mockLoadingService.showGlobal).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.hideGlobal).toHaveBeenCalledTimes(1);
  });
});
