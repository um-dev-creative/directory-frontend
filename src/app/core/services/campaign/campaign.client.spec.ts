import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CampaignClient} from '@core/services';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {BehaviorSubject} from 'rxjs';
import {SESSION_TOKEN_BACKEND} from '@app/shared/constants/app.const';

describe('CampaignClient', () => {
  let client: CampaignClient;
  let httpMock: HttpTestingController;

  // Minimal mock for SessionStoreService exposing session$ observable
  class MockSessionStore {
    private subj = new BehaviorSubject<any>({});
    session$ = this.subj.asObservable();
    set(value: any) { this.subj.next(value); }
  }

  let mockSession: MockSessionStore;

  beforeEach(() => {
    mockSession = new MockSessionStore();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CampaignClient,
        {provide: SessionStoreService, useValue: mockSession}
      ]
    });

    client = TestBed.inject(CampaignClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should PATCH campaign and return normalized 202 response when successful', (done) => {
    const campaignId = '64d0648d-a3ff-4fa6-83e1-649cea48bc09';
    const payload = {
      title: 'Octava oferta',
      description: 'Descripcion',
      businessId: '1a24da99-78d0-4221-96fa-64aa79a47bd1',
      categoryId: 'b1468341-1f30-463f-b22d-7d4a882fa870',
      startDate: '2025-11-25T00:00:00',
      endDate: '2025-12-31T23:59:34',
      discount: 55.00,
      active: true,
      terms: 'nuevos terminos y condiciones'
    };

    // set a backend session token so header is attached
    mockSession.set({userAuth: {sessionTokenBkd: 'backend-token-123'}});

    client.patchCampaign(campaignId, payload).subscribe({
      next: (res) => {
        try {
          expect(res.status).toBe(202);
          expect(res.body).toBeTruthy();
          expect(res.body.id).toBe('64d0648d-a3ff-4fa6-83e1-649cea48bc09');
          expect(res.body.lastUpdate).toBeDefined();
          done();
        } catch (err: any) {
          done.fail(err);
        }
      },
      error: (err) => done.fail(err)
    });

    const req = httpMock.expectOne((req) => req.method === 'PATCH' && req.url.endsWith(`/campaigns/${campaignId}`));
    expect(req.request.method).toBe('PATCH');
    // header present
    expect(req.request.headers.has(SESSION_TOKEN_BACKEND)).toBeTrue();
    // body equals payload
    expect(req.request.body).toEqual(payload);

    // respond with 202 and body
    req.flush({id: campaignId, lastUpdate: '2025-11-23T16:18:22'}, {status: 202, statusText: 'Accepted'});
  });

  it('should surface normalized 401 auth error', (done) => {
    const campaignId = 'abc-123';
    const payload = {title: 'x'};

    mockSession.set({userAuth: {sessionTokenBkd: 'token'}});

    client.patchCampaign(campaignId, payload).subscribe({
      next: () => done.fail('expected error'),
      error: (err) => {
        try {
          expect(err).toBeTruthy();
          expect(err.status).toBe(401);
          expect(err.message).toBe('Unauthorized');
          done();
        } catch (e: any) {
          done.fail(e);
        }
      }
    });

    const req = httpMock.expectOne((req) => req.method === 'PATCH' && req.url.endsWith(`/campaigns/${campaignId}`));
    req.flush({message: 'Unauthorized'}, {status: 401, statusText: 'Unauthorized'});
  });

  it('should surface normalized 5xx server error', (done) => {
    const campaignId = 'abc-500';
    const payload = {title: 'x'};

    mockSession.set({userAuth: {}}); // no backend token

    client.patchCampaign(campaignId, payload).subscribe({
      next: () => done.fail('expected error'),
      error: (err) => {
        try {
          expect(err).toBeTruthy();
          expect(err.status).toBe(500);
          expect(err.message).toBe('Internal Server Error');
          done();
        } catch (e: any) {
          done.fail(e);
        }
      }
    });

    const req = httpMock.expectOne((req) => req.method === 'PATCH' && req.url.endsWith(`/campaigns/${campaignId}`));
    // header should NOT have backend token
    expect(req.request.headers.has(SESSION_TOKEN_BACKEND)).toBeFalse();

    req.flush({message: 'Internal Server Error'}, {status: 500, statusText: 'Server Error'});
  });

});

