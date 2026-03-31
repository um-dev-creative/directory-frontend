import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleGuard, UserInfo } from './role.guard';
import { StorageMockService } from '../services/storage-mock.service';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStorage: jasmine.SpyObj<StorageMockService>;
  let mockLogger: jasmine.SpyObj<LoggerService>;
  let mockNotification: jasmine.SpyObj<NotificationService>;

  const mockUserInfo: UserInfo = {
    id: '1',
    email: 'test@test.com',
    roles: ['admin', 'user'],
    permissions: ['read', 'write']
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStorage = jasmine.createSpyObj('StorageMockService', ['getLocal', 'setLocal', 'removeLocal']);
    mockLogger = jasmine.createSpyObj('LoggerService', ['debug', 'info', 'warn', 'error']);
    mockNotification = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: Router, useValue: mockRouter },
        { provide: StorageMockService, useValue: mockStorage },
        { provide: LoggerService, useValue: mockLogger },
        { provide: NotificationService, useValue: mockNotification }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when no roles or permissions are required', () => {
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
  });

  it('should allow access when user has required role', () => {
    mockStorage.getLocal.and.returnValue(mockUserInfo);

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
    expect(mockLogger.debug).toHaveBeenCalledWith('Role/permission check passed');
  });

  it('should block access when user does not have required role', () => {
    mockStorage.getLocal.and.returnValue(mockUserInfo);

    const route = { data: { roles: ['super-admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
    expect(mockNotification.error).toHaveBeenCalledWith('Access denied - Insufficient permissions');
  });

  it('should block access when user info is not found', () => {
    mockStorage.getLocal.and.returnValue(null);

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(mockNotification.error).toHaveBeenCalledWith('Access denied - User information not found');
  });

  it('should allow access when user has required permission', () => {
    mockStorage.getLocal.and.returnValue(mockUserInfo);

    const route = { data: { permissions: ['write'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
  });

  it('should block access when user does not have required permission', () => {
    mockStorage.getLocal.and.returnValue(mockUserInfo);

    const route = { data: { permissions: ['delete'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should check both roles and permissions when both are required', () => {
    mockStorage.getLocal.and.returnValue(mockUserInfo);

    const route = {
      data: { roles: ['admin'], permissions: ['read'] }
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
  });

  it('should block when role matches but permission does not', () => {
    mockStorage.getLocal.and.returnValue(mockUserInfo);

    const route = {
      data: { roles: ['admin'], permissions: ['delete'] }
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
  });
});
