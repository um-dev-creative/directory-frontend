import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {BusinessStatsClient} from './business-stats.client';
import {BusinessStats} from '@shared/models/business-stats.model';

describe('BusinessStatsClient', () => {
  let client: BusinessStatsClient;
  let http: HttpTestingController;
  const base = '/drb/api/v1/general/businesses/b1';
  const stats: BusinessStats = {
    businessId: 'b1', from: '2026-11-15', to: '2026-11-21', totalViews: 3, viewsToday: 1, viewsLast7Days: 3,
    daily: [{date: '2026-11-21', views: 1}]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    client = TestBed.inject(BusinessStatsClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('counts a view with a POST that carries nothing about the visitor', () => {
    let completed = false;
    client.recordView('b1').subscribe({complete: () => (completed = true)});
    const request = http.expectOne(`${base}/views`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({});
    request.flush({headers: {status: 204}, data: null});
    expect(completed).toBeTrue();
  });

  it('reads the summary of a window and unwraps the envelope', () => {
    let result: BusinessStats | undefined;
    client.getStats('b1', 7).subscribe((s) => (result = s));
    const request = http.expectOne((r) => r.url === `${base}/stats`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('days')).toBe('7');
    request.flush({headers: {status: 200}, data: stats});
    expect(result).toEqual(stats);
  });

  it('encodes the business id', () => {
    client.recordView('a/b').subscribe();
    const request = http.expectOne('/drb/api/v1/general/businesses/a%2Fb/views');
    expect(request.request.url).toBe('/drb/api/v1/general/businesses/a%2Fb/views');
    request.flush({headers: {status: 204}, data: null});
  });

  it('normalizes the failures (403 when the caller is not the owner)', () => {
    const statuses: number[] = [];
    client.getStats('b1', 30).subscribe({error: (e) => statuses.push(e.status)});
    client.recordView('b1').subscribe({error: (e) => statuses.push(e.status)});
    http.match(() => true).forEach((r) => r.flush({}, {status: 403, statusText: 'Forbidden'}));
    expect(statuses).toEqual([403, 403]);
  });
});
