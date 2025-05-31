import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import {
  AuthService,
  HttpService,
  LoggerService,
  LoadingService,
  NotificationService,
  StorageService,
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
  authGuard,
  RoleGuard,
  UnsavedChangesGuard
} from './guards';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [
    // Services
    AuthService,
    HttpService,
    LoggerService,
    LoadingService,
    NotificationService,
    StorageService,
    ThemeService,

    // Guards
    RoleGuard,
    UnsavedChangesGuard,

    // Interceptors
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
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
