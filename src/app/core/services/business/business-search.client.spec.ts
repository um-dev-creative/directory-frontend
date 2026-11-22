import {TestBed} from '@angular/core/testing';
import {provideHttpClient, withXhr} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {BusinessSearchClient} from './business-search.client';
import {BusinessSearchResponse} from '@shared/models/location.model';

describe('BusinessSearchClient', () => {
  let client: BusinessSearchClient;
  let http: HttpTestingController;
  const url = '/drb/api/v1/general/businesses/search';

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(withXhr()), provideHttpClientTesting()]});
    client = TestBed.inject(BusinessSearchClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends every filter with the names the backend expects and unwraps the envelope', () => {
    const body: BusinessSearchResponse = {total_count: 1, page: 2, per_page: 5, total_pages: 3, data: []};
    let result: BusinessSearchResponse | undefined;
    client.search({cityId: 'c1', category: 'k1', q: '  pan ', page: 2, perPage: 5}).subscribe((r) => (result = r));

    const request = http.expectOne((r) => r.url === url);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('city_id')).toBe('c1');
    expect(request.request.params.get('category_id')).toBe('k1');
    expect(request.request.params.get('q')).toBe('pan');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('per_page')).toBe('5');
    request.flush({headers: {status: 200}, data: body});

    expect(result).toEqual(body);
  });

  it('sends nothing for the filters that are empty', () => {
    client.search({cityId: null, category: '', q: '   '}).subscribe();
    const request = http.expectOne((r) => r.url === url);
    expect(request.request.params.keys()).toEqual([]);
    request.flush({headers: {status: 200}, data: null});
  });

  it('answers an empty page when the body is empty', () => {
    let result: BusinessSearchResponse | undefined;
    client.search({perPage: 20}).subscribe((r) => (result = r));
    http.expectOne((r) => r.url === url).flush({headers: {status: 200}, data: null});
    expect(result).toEqual({total_count: 0, page: 1, per_page: 20, total_pages: 0, data: []});
  });

  it('normalizes a failure', () => {
    let status = 0;
    client.search({}).subscribe({error: (e) => (status = e.status)});
    http.expectOne((r) => r.url === url).flush({}, {status: 400, statusText: 'Bad Request'});
    expect(status).toBe(400);
  });
});
