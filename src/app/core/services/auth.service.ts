import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';
import { ServiceTemplate } from './service-template';
import { DFC } from '@app/shared/constants/app.const';

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
export class AuthService extends ServiceTemplate {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private readonly CONTENT_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL +
    DFC.RelativePath.AUTH_PATH;

  constructor(
    private readonly httpService: HttpService,
    private readonly storageService: StorageService,
    private readonly logger: LoggerService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    super();
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
      this.clearAuthData();
    }
  }

  /**
   * Login user
   * @param credentials - User credentials for login
   * @returns Observable<boolean> - True if login is successful, false otherwise
   * @throws Error - If login fails, an error is thrown and handled
   * @description This method sends a login request to the server with the provided credentials.
   * It stores the authentication token and user information in local storage upon successful login.
   * It also updates the current user state and navigates to the intended route or default dashboard.
   * If the login fails, it logs the error and shows a notification to the user.
   * It also handles any errors that occur during the login process.
   * @example
   * authService.login({ email: 'hello@gmail.com', password: 'password123' })
   *   .subscribe(success => {
   *     if (success) {
   *       console.log('Login successful');
   *     } else {
   *       console.log('Login failed');
   *     }
   *   });
   */
  login(credentials: LoginCredentials): Observable<boolean> {
    return this.httpService.post<AuthResponse>(`${this.CONTENT_PATH}/login`, credentials).pipe(
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
        this.handlerError(error); // Using inherited error handler
        return of(false);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.logger.info('User logged out');
    this.router.navigate(['/stage']);
  }

  /**
   * Clear authentication data without navigation
   */
  private clearAuthData(): void {
    this.storageService.removeLocal('auth_token');
    this.storageService.removeLocal('user_info');
    this.storageService.removeLocal('redirect_url');

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

  }

  /**
   * Register new user...
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
        this.handlerError(error);
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
        this.handlerError(error);
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
    return this.httpService.put<User>('/auth/member', userData).pipe(
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
        this.handlerError(error);
        return of(false);
      })
    );
  }
}
