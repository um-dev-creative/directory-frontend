import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from '@env/environment';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl || '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request', (done) => {
    const mockData = { id: 1, name: 'Test' };
    service.get<typeof mockData>('/test').subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockData);
  });

  it('should perform POST request with body', (done) => {
    const postData = { name: 'New Item' };
    const responseData = { id: 1, name: 'New Item' };

    service.post<typeof responseData>('/items', postData).subscribe(data => {
      expect(data).toEqual(responseData);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/items`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(responseData);
  });

  it('should perform PUT request', (done) => {
    const putData = { name: 'Updated' };
    service.put<any>('/items/1', putData).subscribe(data => {
      expect(data).toEqual(putData);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/items/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(putData);
  });

  it('should perform DELETE request', (done) => {
    service.delete<void>('/items/1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/items/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should perform PATCH request', (done) => {
    const patchData = { name: 'Patched' };
    service.patch<any>('/items/1', patchData).subscribe(data => {
      expect(data).toEqual(patchData);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/items/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(patchData);
  });

  it('should handle HTTP errors on GET', (done) => {
    spyOn(console, 'error');
    service.get('/fail').subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        done();
      }
    });

    // GET has retry(1): first request fails, retry fires, second request also fails
    const req1 = httpMock.expectOne(`${baseUrl}/fail`);
    req1.flush('Error', { status: 500, statusText: 'Server Error' });

    const req2 = httpMock.expectOne(`${baseUrl}/fail`);
    req2.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle HTTP errors on POST', (done) => {
    service.post('/fail', {}).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        done();
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/fail`);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should set default headers with Accept: application/json', (done) => {
    service.get('/test').subscribe(() => done());

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });
});
