import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.agent.guard';
import { StorageMockService } from '../services/storage-mock.service';
import { LoggerService } from '../services/logger.service';

describe('AuthGuard (auth.agent)', () => {
  let guard: AuthGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStorage: jasmine.SpyObj<StorageMockService>;
  let mockLogger: jasmine.SpyObj<LoggerService>;

  // Create a valid JWT with exp in the future
  function createToken(exp: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp }));
    return `${header}.${payload}.signature`;
  }

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStorage = jasmine.createSpyObj('StorageMockService', ['getLocal', 'setLocal', 'removeLocal']);
    mockLogger = jasmine.createSpyObj('LoggerService', ['debug', 'info', 'warn', 'error']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: StorageMockService, useValue: mockStorage },
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when token is valid and not expired', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    mockStorage.getLocal.and.returnValue(createToken(futureExp));

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith('User is authenticated');
  });

  it('should block access and redirect when no token exists', () => {
    mockStorage.getLocal.and.returnValue(null);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
    expect(mockStorage.setLocal).toHaveBeenCalledWith('redirect_url', '/dashboard');
  });

  it('should block access when token is expired', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    mockStorage.getLocal.and.returnValue(createToken(pastExp));

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/profile' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should block access when token is malformed', () => {
    mockStorage.getLocal.and.returnValue('not-a-valid-jwt');

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/settings' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should store redirect URL before navigating to auth', () => {
    mockStorage.getLocal.and.returnValue(null);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/my/nested/route' } as RouterStateSnapshot;

    guard.canActivate(route, state);

    expect(mockStorage.setLocal).toHaveBeenCalledWith('redirect_url', '/my/nested/route');
  });

  it('should delegate canActivateChild to canActivate', () => {
    mockStorage.getLocal.and.returnValue(null);

    const childRoute = {} as ActivatedRouteSnapshot;
    const state = { url: '/parent/child' } as RouterStateSnapshot;

    const result = guard.canActivateChild(childRoute, state);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
