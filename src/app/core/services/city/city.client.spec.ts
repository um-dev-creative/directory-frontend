import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {CityClient} from './city.client';
import {City} from '@shared/models/location.model';

describe('CityClient', () => {
  let client: CityClient;
  let http: HttpTestingController;
  const toronto: City = {id: 'c1', name: 'Toronto', province: 'Ontario', country: 'CA'};

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    client = TestBed.inject(CityClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the catalogue through the BFF and unwraps the envelope', () => {
    let result: City[] | undefined;
    client.getCities().subscribe((cities) => (result = cities));

    const request = http.expectOne('/drb/api/v1/general/cities');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush({headers: {status: 200}, data: [toronto]});

    expect(result).toEqual([toronto]);
  });

  it('sends only the filters that have a value', () => {
    client.getCities('CA', 'tor').subscribe();
    const request = http.expectOne((r) => r.url === '/drb/api/v1/general/cities');
    expect(request.request.params.get('country')).toBe('CA');
    expect(request.request.params.get('q')).toBe('tor');
    request.flush({headers: {status: 200}, data: []});

    client.getCities(undefined, '').subscribe();
    const second = http.expectOne((r) => r.url === '/drb/api/v1/general/cities');
    expect(second.request.params.keys()).toEqual([]);
    second.flush({headers: {status: 200}, data: []});
  });

  it('answers an empty list when the body is empty', () => {
    let result: City[] | undefined;
    client.getCities().subscribe((cities) => (result = cities));
    http.expectOne('/drb/api/v1/general/cities').flush({headers: {status: 200}, data: null});
    expect(result).toEqual([]);
  });

  it('normalizes a failure', () => {
    let error: { status: number } | undefined;
    client.getCities().subscribe({error: (e) => (error = e)});
    http.expectOne('/drb/api/v1/general/cities').flush({message: 'boom'}, {status: 500, statusText: 'Server Error'});
    expect(error?.status).toBe(500);
  });
});
