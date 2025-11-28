import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {routes} from '@app/app.routes';
import {HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideStore} from '@ngrx/store';
import {sessionReducer} from '@app/core/store/session/session.reducer';
import {provideEffects} from '@ngrx/effects';
import {SessionEffects} from '@app/core/store/session/session-effects';
import {provideCore} from '@core/core.module';
import {SESSION_INITIALIZER_PROVIDER} from '@app/core/initializers/session.initializer';

function createTranslateLoader(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),

    // Translation
    TranslateModule.forRoot(
      {
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      }
    ).providers!,

    // Animations
    provideAnimations(),
    provideAnimationsAsync(),

    // HTTP Client with interceptors support
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi() // This enables class-based interceptors
    ),

    // NgRx Store
    provideStore({ session: sessionReducer}),
    provideEffects([SessionEffects]),

    // Session initialization
    SESSION_INITIALIZER_PROVIDER,

    // Core services and modules
    provideCore()
  ]
};
