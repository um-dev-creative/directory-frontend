import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { noAuthGuard } from './no-auth.guard';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

describe('noAuthGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let sessionSubject: BehaviorSubject<any>;

  function configureWithSession(sessionState: any) {
    sessionSubject = new BehaviorSubject(sessionState);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    const mockStore = jasmine.createSpyObj('Store', ['select']);
    mockStore.select.and.returnValue(sessionSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ]
    });
  }

  it('should allow access when user is NOT authenticated', (done) => {
    configureWithSession({ isInitialized: true, sessionData: {} });

    TestBed.runInInjectionContext(() => {
      const result = noAuthGuard(mockRoute);
      (result as Observable<boolean>).subscribe(allowed => {
        expect(allowed).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('should redirect to /stage when user IS authenticated', (done) => {
    configureWithSession({
      isInitialized: true,
      sessionData: {
        token: 'jwt-token',
        userAuth: { sessionToken: 'session-tok', alias: 'user1' }
      }
    });

    TestBed.runInInjectionContext(() => {
      const result = noAuthGuard(mockRoute);
      (result as Observable<boolean>).subscribe(allowed => {
        expect(allowed).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/deals']);
        done();
      });
    });
  });

  it('should wait for initialization before deciding', (done) => {
    configureWithSession({ isInitialized: false, sessionData: {} });

    let emitted = false;

    TestBed.runInInjectionContext(() => {
      const result = noAuthGuard(mockRoute);
      (result as Observable<boolean>).subscribe(() => { emitted = true; });
    });

    // Should not have emitted yet
    expect(emitted).toBeFalse();

    // Now mark initialized
    sessionSubject.next({ isInitialized: true, sessionData: {} });

    setTimeout(() => {
      expect(emitted).toBeTrue();
      done();
    }, 0);
  });
});
