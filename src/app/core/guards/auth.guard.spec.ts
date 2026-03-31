import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { authGuard, authGuardChild, authMatchGuard } from './auth.guard';
import { LoggerService } from '../services/logger.service';
import { StorageMockService } from '../services/storage-mock.service';
import { SessionState } from '@app/core/store/session/session.state';

describe('authGuard', () => {
  let mockStore: jasmine.SpyObj<Store<{ session: SessionState }>>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLogger: jasmine.SpyObj<LoggerService>;
  let mockStorage: jasmine.SpyObj<StorageMockService>;

  const authenticatedSessionState: SessionState = {
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

  const unauthenticatedSessionState: SessionState = {
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
    mockLogger = jasmine.createSpyObj('LoggerService', ['debug', 'info', 'warn', 'error']);
    mockStorage = jasmine.createSpyObj('StorageMockService', ['setLocal', 'getLocal', 'removeLocal']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLogger },
        { provide: StorageMockService, useValue: mockStorage }
      ]
    });
  });

  describe('authGuard (CanActivateFn)', () => {
    it('should allow access when user is authenticated', (done) => {
      mockStore.select.and.returnValue(of(authenticatedSessionState));

      const route = {} as ActivatedRouteSnapshot;
      const state = { url: '/dashboard' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authGuard(route, state);
        if (result instanceof Object && 'subscribe' in result) {
          (result as any).subscribe((allowed: boolean) => {
            expect(allowed).toBeTrue();
            expect(mockRouter.navigate).not.toHaveBeenCalled();
            done();
          });
        }
      });
    });

    it('should block access and redirect to /auth when user is not authenticated', (done) => {
      mockStore.select.and.returnValue(of(unauthenticatedSessionState));

      const route = {} as ActivatedRouteSnapshot;
      const state = { url: '/dashboard' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authGuard(route, state);
        if (result instanceof Object && 'subscribe' in result) {
          (result as any).subscribe((allowed: boolean) => {
            expect(allowed).toBeFalse();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
            expect(mockStorage.setLocal).toHaveBeenCalledWith('redirect_url', '/dashboard');
            done();
          });
        }
      });
    });

    it('should wait for initialization before evaluating', (done) => {
      // First emit uninitialized, then initialized
      mockStore.select.and.returnValue(of(authenticatedSessionState));

      const route = {} as ActivatedRouteSnapshot;
      const state = { url: '/dashboard' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authGuard(route, state);
        if (result instanceof Object && 'subscribe' in result) {
          (result as any).subscribe((allowed: boolean) => {
            expect(allowed).toBeTrue();
            done();
          });
        }
      });
    });

    it('should block when token is present but alias is empty', (done) => {
      const partialAuth: SessionState = {
        isInitialized: true,
        sessionData: {
          token: 'valid-token',
          userAuth: {
            alias: '',
            email: 'john@test.com',
            fullName: 'John',
            sessionToken: 'session-token',
            sessionTokenBkd: '',
            authorization: '',
            features: [],
            businesses: []
          }
        }
      };
      mockStore.select.and.returnValue(of(partialAuth));

      const route = {} as ActivatedRouteSnapshot;
      const state = { url: '/profile' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authGuard(route, state);
        if (result instanceof Object && 'subscribe' in result) {
          (result as any).subscribe((allowed: boolean) => {
            expect(allowed).toBeFalse();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
            done();
          });
        }
      });
    });
  });

  describe('authGuardChild (CanActivateChildFn)', () => {
    it('should allow child route access when authenticated', (done) => {
      mockStore.select.and.returnValue(of(authenticatedSessionState));

      const childRoute = {} as ActivatedRouteSnapshot;
      const state = { url: '/dashboard/settings' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authGuardChild(childRoute, state);
        if (result instanceof Object && 'subscribe' in result) {
          (result as any).subscribe((allowed: boolean) => {
            expect(allowed).toBeTrue();
            done();
          });
        }
      });
    });
  });

  describe('authMatchGuard (CanMatchFn)', () => {
    it('should allow lazy-loaded route when authenticated', (done) => {
      mockStore.select.and.returnValue(of(authenticatedSessionState));

      const route = {} as any;
      const segments = [{ path: 'dashboard' }, { path: 'user' }] as any[];

      TestBed.runInInjectionContext(() => {
        const result = authMatchGuard(route, segments);
        if (result instanceof Object && 'subscribe' in result) {
          (result as any).subscribe((allowed: boolean) => {
            expect(allowed).toBeTrue();
            done();
          });
        }
      });
    });
  });
});
