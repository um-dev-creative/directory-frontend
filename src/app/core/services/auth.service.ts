import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuth(): void {
    const token = this.storageService.getLocal<string>('auth_token');
    const user = this.storageService.getLocal<User>('user_info');

    if (token && user && !this.isTokenExpired(token)) {
      this.setAuthenticatedUser(user);
      this.logger.info('User authenticated from storage');
    } else {
      this.logout();
    }
  }

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<boolean> {
    return this.httpService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        this.storageService.setLocal('auth_token', response.token);
        this.storageService.setLocal('user_info', response.user);
        this.setAuthenticatedUser(response.user);

        this.logger.info('User logged in successfully', { userId: response.user.id });
        this.notificationService.success(`Welcome back, ${response.user.name}!`);

        // Redirect to intended route or default
        const redirectUrl = this.storageService.getLocal<string>('redirect_url') || '/dashboard';
        this.storageService.removeLocal('redirect_url');
        this.router.navigate([redirectUrl]);
      }),
      map(() => true),
      catchError(error => {
        this.logger.error('Login failed', error);
        this.notificationService.error('Login failed. Please check your credentials.');
        return of(false);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.storageService.removeLocal('auth_token');
    this.storageService.removeLocal('user_info');
    this.storageService.removeLocal('redirect_url');

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    this.logger.info('User logged out');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<boolean> {
    return this.httpService.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => {
        this.storageService.setLocal('auth_token', response.token);
        this.storageService.setLocal('user_info', response.user);
        this.setAuthenticatedUser(response.user);

        this.logger.info('User registered successfully', { userId: response.user.id });
        this.notificationService.success(`Welcome, ${response.user.name}!`);

        this.router.navigate(['/dashboard']);
      }),
      map(() => true),
      catchError(error => {
        this.logger.error('Registration failed', error);
        this.notificationService.error('Registration failed. Please try again.');
        return of(false);
      })
    );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<boolean> {
    return this.httpService.post<AuthResponse>('/auth/refresh', {}).pipe(
      tap(response => {
        this.storageService.setLocal('auth_token', response.token);
        this.storageService.setLocal('user_info', response.user);
        this.setAuthenticatedUser(response.user);
        this.logger.debug('Token refreshed successfully');
      }),
      map(() => true),
      catchError(error => {
        this.logger.error('Token refresh failed', error);
        this.logout();
        return of(false);
      })
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.permissions.includes(permission) : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? permissions.some(permission => user.permissions.includes(permission)) : false;
  }

  /**
   * Set authenticated user
   */
  private setAuthenticatedUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      this.logger.error('Error decoding token', error);
      return true;
    }
  }

  /**
   * Get token from storage
   */
  getToken(): string | null {
    return this.storageService.getLocal<string>('auth_token');
  }

  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<boolean> {
    return this.httpService.put<User>('/auth/profile', userData).pipe(
      tap(updatedUser => {
        this.storageService.setLocal('user_info', updatedUser);
        this.setAuthenticatedUser(updatedUser);
        this.logger.info('Profile updated successfully');
        this.notificationService.success('Profile updated successfully!');
      }),
      map(() => true),
      catchError(error => {
        this.logger.error('Profile update failed', error);
        this.notificationService.error('Failed to update profile. Please try again.');
        return of(false);
      })
    );
  }
}
