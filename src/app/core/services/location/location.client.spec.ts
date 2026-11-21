import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {LocationClient} from './location.client';
import {Location} from '@shared/models/location.model';

describe('LocationClient', () => {
  let client: LocationClient;
  let http: HttpTestingController;
  const base = '/drb/api/v1/general/businesses/b1/locations';
  const location = {id: 'l1', businessId: 'b1', main: true, addressLine: '1 Main St'} as Location;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    client = TestBed.inject(LocationClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists the locations of a business', () => {
    let result: Location[] | undefined;
    client.list('b1').subscribe((locations) => (result = locations));
    const request = http.expectOne(base);
    expect(request.request.method).toBe('GET');
    request.flush({headers: {status: 200}, data: [location]});
    expect(result).toEqual([location]);
  });

  it('answers an empty list when the body is empty', () => {
    let result: Location[] | undefined;
    client.list('b1').subscribe((locations) => (result = locations));
    http.expectOne(base).flush({headers: {status: 200}, data: null});
    expect(result).toEqual([]);
  });

  it('creates a location with the request as body', () => {
    let result: Location | undefined;
    client.create('b1', {cityId: 'c1', addressLine: '1 Main St', main: true}).subscribe((l) => (result = l));
    const request = http.expectOne(base);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({cityId: 'c1', addressLine: '1 Main St', main: true});
    request.flush({headers: {status: 201}, data: location});
    expect(result).toEqual(location);
  });

  it('patches a location', () => {
    let result: Location | undefined;
    client.update('b1', 'l1', {main: true}).subscribe((l) => (result = l));
    const request = http.expectOne(`${base}/l1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({main: true});
    request.flush({headers: {status: 200}, data: location});
    expect(result).toEqual(location);
  });

  it('deletes a location', () => {
    let completed = false;
    client.delete('b1', 'l1').subscribe({complete: () => (completed = true)});
    const request = http.expectOne(`${base}/l1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({headers: {status: 204}, data: null});
    expect(completed).toBeTrue();
  });

  it('encodes the ids it puts in the URL', () => {
    client.list('a/b').subscribe();
    http.expectOne('/drb/api/v1/general/businesses/a%2Fb/locations').flush({headers: {status: 200}, data: []});
  });

  it('normalizes the failures of every operation (403 for a user who is not the owner)', () => {
    const statuses: number[] = [];
    const record = {error: (e: { status: number }) => statuses.push(e.status)};
    client.list('b1').subscribe(record);
    client.create('b1', {cityId: 'c1', addressLine: 'x'}).subscribe(record);
    client.update('b1', 'l1', {main: true}).subscribe(record);
    client.delete('b1', 'l1').subscribe(record);
    http.match(() => true).forEach((request) => request.flush({}, {status: 403, statusText: 'Forbidden'}));
    expect(statuses).toEqual([403, 403, 403, 403]);
  });
});
