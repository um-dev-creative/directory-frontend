import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, User } from './auth.service';
import { HttpService } from './http.service';
import { StorageMockService } from './storage-mock.service';
import { NotificationService } from './notification.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockStorage: jasmine.SpyObj<StorageMockService>;
  let mockNotification: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    roles: ['admin', 'user'],
    permissions: ['read', 'write', 'delete']
  };

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete', 'patch']);
    mockStorage = jasmine.createSpyObj('StorageMockService', [
      'getLocal', 'setLocal', 'removeLocal', 'clearLocal'
    ]);
    mockNotification = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Default: no stored token/user
    mockStorage.getLocal.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HttpService, useValue: mockHttpService },
        { provide: StorageMockService, useValue: mockStorage },
        { provide: NotificationService, useValue: mockNotification },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially when no stored token', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should check if user has a specific role', () => {
    // Set user via public subject access
    (service as any).setAuthenticatedUser(mockUser);

    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole('super-admin')).toBeFalse();
  });

  it('should check if user has a specific permission', () => {
    (service as any).setAuthenticatedUser(mockUser);

    expect(service.hasPermission('read')).toBeTrue();
    expect(service.hasPermission('execute')).toBeFalse();
  });

  it('should check if user has any of the specified roles', () => {
    (service as any).setAuthenticatedUser(mockUser);

    expect(service.hasAnyRole(['admin', 'super-admin'])).toBeTrue();
    expect(service.hasAnyRole(['super-admin', 'moderator'])).toBeFalse();
  });

  it('should check if user has any of the specified permissions', () => {
    (service as any).setAuthenticatedUser(mockUser);

    expect(service.hasAnyPermission(['read', 'execute'])).toBeTrue();
    expect(service.hasAnyPermission(['execute', 'deploy'])).toBeFalse();
  });

  it('should return false for role/permission checks when no user', () => {
    expect(service.hasRole('admin')).toBeFalse();
    expect(service.hasPermission('read')).toBeFalse();
    expect(service.hasAnyRole(['admin'])).toBeFalse();
    expect(service.hasAnyPermission(['read'])).toBeFalse();
  });

  it('should clear auth data and navigate on logout', () => {
    (service as any).setAuthenticatedUser(mockUser);
    expect(service.isAuthenticated()).toBeTrue();

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
    expect(mockStorage.removeLocal).toHaveBeenCalledWith('auth_token');
    expect(mockStorage.removeLocal).toHaveBeenCalledWith('user_info');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/stage']);
  });

  it('should return token from storage via getToken', () => {
    mockStorage.getLocal.and.returnValue('stored-token');
    expect(service.getToken()).toBe('stored-token');
  });

  it('should emit isAuthenticated$ changes', (done) => {
    const values: boolean[] = [];
    service.isAuthenticated$.subscribe(val => {
      values.push(val);
      if (values.length === 2) {
        expect(values[0]).toBeFalse();
        expect(values[1]).toBeTrue();
        done();
      }
    });
    (service as any).setAuthenticatedUser(mockUser);
  });
});
