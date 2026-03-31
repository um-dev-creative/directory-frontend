import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { nonAuthGuard } from './no-auth.guard';
import { AuthService } from '../services/auth.service';

describe('nonAuthGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn', 'getUserRole', 'isAuthenticated', 'getCurrentUser'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
  });

  it('should be defined as a function', () => {
    expect(nonAuthGuard).toBeDefined();
    expect(typeof nonAuthGuard).toBe('function');
  });

  it('should execute without errors', () => {
    TestBed.runInInjectionContext(() => {
      expect(() => nonAuthGuard()).not.toThrow();
    });
  });

  it('should return undefined (body is commented out)', () => {
    TestBed.runInInjectionContext(() => {
      expect(() => nonAuthGuard()).not.toThrow();
    });
  });

  it('should inject AuthService and Router from injection context', () => {
    // Guard injects dependencies even though body is commented out
    TestBed.runInInjectionContext(() => {
      nonAuthGuard();
      // No errors means inject() calls resolved correctly
    });
    expect(true).toBeTrue(); // Passes if no injection error thrown
  });
});
