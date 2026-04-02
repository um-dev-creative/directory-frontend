import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { businessOwnerGuard } from './business-owner.guard';
import { SessionState } from '@app/core/store/session/session.state';

function makeSession(token = '', sessionToken = '', alias = '', businesses: string[] = []): SessionState {
  return {
    isInitialized: true,
    sessionData: {
      token,
      userAuth: {
        alias,
        email: '',
        fullName: '',
        sessionToken,
        sessionTokenBkd: '',
        authorization: '',
        features: [],
        businesses
      }
    }
  };
}

describe('businessOwnerGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let sessionSubject: BehaviorSubject<SessionState>;

  function buildRoute(id: string): ActivatedRouteSnapshot {
    return { paramMap: { get: (key: string) => (key === 'id' ? id : null) } } as any;
  }

  function runGuard(businessId: string): Observable<boolean> {
    return TestBed.runInInjectionContext(() =>
      businessOwnerGuard(buildRoute(businessId), {} as any)
    ) as Observable<boolean>;
  }

  beforeEach(() => {
    sessionSubject = new BehaviorSubject<SessionState>(makeSession());
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: { select: () => sessionSubject.asObservable() } },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should redirect to /auth when not authenticated (no token)', (done) => {
    sessionSubject.next(makeSession('', '', ''));

    runGuard('biz-1').subscribe(result => {
      expect(result).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
      done();
    });
  });

  it('should redirect to /partner/:id when authenticated but not owner', (done) => {
    sessionSubject.next(makeSession('tok', 'sess-tok', 'user', ['other-biz']));

    runGuard('my-biz').subscribe(result => {
      expect(result).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/partner', 'my-biz']);
      done();
    });
  });

  it('should return true when authenticated and is owner', (done) => {
    sessionSubject.next(makeSession('tok', 'sess-tok', 'user', ['my-biz']));

    runGuard('my-biz').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });
});
