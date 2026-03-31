import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { smoothAuthGuard } from './smooth-auth.guard';
import { SessionState } from '@app/core/store/session/session.state';

describe('smoothAuthGuard', () => {
  let mockStore: jasmine.SpyObj<Store<{ session: SessionState }>>;
  let mockRouter: jasmine.SpyObj<Router>;

  const authenticatedState: SessionState = {
    isInitialized: true,
    sessionData: {
      token: 'valid-token',
      userAuth: {
        alias: 'john',
        email: 'john@test.com',
        fullName: 'John Doe',
        sessionToken: 'session-token',
        sessionTokenBkd: 'bkd-token',
        authorization: 'bearer-auth',
        features: [],
        businesses: []
      }
    }
  };

  const unauthenticatedState: SessionState = {
    isInitialized: true,
    sessionData: {
      token: '',
      userAuth: {
        alias: '',
        email: '',
        fullName: '',
        sessionToken: '',
        sessionTokenBkd: '',
        authorization: '',
        features: [],
        businesses: []
      }
    }
  };

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access when user is authenticated after delay', fakeAsync(() => {
    mockStore.select.and.returnValue(of(authenticatedState));

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    let result: boolean | undefined;
    TestBed.runInInjectionContext(() => {
      const obs = smoothAuthGuard(route, state);
      (obs as any).subscribe((val: boolean) => result = val);
    });

    tick(50); // Wait for the delay(50)
    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should block access and redirect to /auth when not authenticated', fakeAsync(() => {
    mockStore.select.and.returnValue(of(unauthenticatedState));

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    let result: boolean | undefined;
    TestBed.runInInjectionContext(() => {
      const obs = smoothAuthGuard(route, state);
      (obs as any).subscribe((val: boolean) => result = val);
    });

    tick(50);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  }));

  it('should block when token exists but sessionToken is empty', fakeAsync(() => {
    const partialState: SessionState = {
      isInitialized: true,
      sessionData: {
        token: 'valid-token',
        userAuth: {
          alias: 'john',
          email: 'john@test.com',
          fullName: 'John',
          sessionToken: '',
          sessionTokenBkd: '',
          authorization: '',
          features: [],
          businesses: []
        }
      }
    };
    mockStore.select.and.returnValue(of(partialState));

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/settings' } as RouterStateSnapshot;

    let result: boolean | undefined;
    TestBed.runInInjectionContext(() => {
      const obs = smoothAuthGuard(route, state);
      (obs as any).subscribe((val: boolean) => result = val);
    });

    tick(50);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  }));

  it('should block when all auth fields are whitespace-only', fakeAsync(() => {
    const whitespaceState: SessionState = {
      isInitialized: true,
      sessionData: {
        token: '   ',
        userAuth: {
          alias: '  ',
          email: '',
          fullName: '',
          sessionToken: '  ',
          sessionTokenBkd: '',
          authorization: '',
          features: [],
          businesses: []
        }
      }
    };
    mockStore.select.and.returnValue(of(whitespaceState));

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/home' } as RouterStateSnapshot;

    let result: boolean | undefined;
    TestBed.runInInjectionContext(() => {
      const obs = smoothAuthGuard(route, state);
      (obs as any).subscribe((val: boolean) => result = val);
    });

    tick(50);
    expect(result).toBeFalse();
  }));
});
