import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import {
  AuthService,
  HttpService,
  LoggerService,
  LoadingService,
  NotificationService,
  StorageMockService,
  ThemeService
} from './services';

// Interceptors
import {
  AuthInterceptor,
  CacheInterceptor,
  ErrorInterceptor,
  LoadingInterceptor
} from './interceptors';

// Guards
import {
  RoleGuard,
  UnsavedChangesGuard
} from './guards';

/**
 * Provides core services
 */
export function provideCoreServices(): Provider[] {
  return [
    AuthService,
    HttpService,
    LoggerService,
    LoadingService,
    NotificationService,
    StorageMockService,
    ThemeService
  ];
}

/**
 * Provides guards
 */
export function provideCoreGuards(): Provider[] {
  return [
    RoleGuard,
    UnsavedChangesGuard
  ];
}

/**
 * Provides HTTP interceptors
 */
export function provideCoreInterceptors(): Provider[] {
  return [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    }
  ];
}

/**
 * Provides all core functionality
 */
export function provideCore(): Provider[] {
  return [
    ...provideCoreServices(),
    ...provideCoreGuards(),
    ...provideCoreInterceptors()
  ];
}
