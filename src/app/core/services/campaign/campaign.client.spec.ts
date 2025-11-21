import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {CampaignClient} from '@core/services';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('CampaignClient', () => {
  let service: CampaignClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CampaignClient,
        provideMockStore({
          initialState: {
            session: {
              userAuth: {
                sessionTokenBkd: 'test-session-token-bkd'
              }
            }
          }
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CampaignClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.clearCache();
  });

  it('should call /api/campaigns with page and per_page params', () => {
    /*
    items: Campaign[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
     */
    const mockCampaigns = [
      {
        id: 'a',
        title: 'A',
        description: 'Description A',
      },
      {
        id: 'b',
        title: 'B',
        description: 'Description B',
      }];
    const mockResponse: any = {
      data: [mockCampaigns],
      total_count: 2,
      page: 1,
      per_page: 5,
      total_pages: 1,
    }
    service.list({ page: 2, limit: 5 }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.items.length).toBe(2);
      expect(res.total_count).toBe(2);
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/campaigns'));
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('per_page')).toBe('5');

    req.flush(mockResponse);
  });

  it('should cache observables for same page/limit key', () => {
    const obs1 = service.list({ page: 1, limit: 10 });
    const obs2 = service.list({ page: 1, limit: 10 });

    expect(obs1).toBe(obs2);

    let called = 0;
    obs1.subscribe(() => called++);
    obs2.subscribe(() => called++);

    const req = httpMock.expectOne(r => r.url.includes('/campaigns') && r.params.get('page') === '1' && r.params.get('per_page') === '10');
    req.flush({ data: [{ id: 'a', title: 'A' }], total: 1 });

    expect(called).toBe(2);
  });
});
