import {ApplicationConfig, PLATFORM_ID, REQUEST, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {routes} from '@app/app.routes';
import {isPlatformServer} from '@angular/common';
import {HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideStore} from '@ngrx/store';
import {sessionReducer} from '@app/core/store/session/session.reducer';
import {landingReducer} from '@app/core/store/landing/landing.reducer';
import {provideEffects} from '@ngrx/effects';
import {SessionEffects} from '@app/core/store/session/session-effects';
import {LandingEffects} from '@app/core/store/landing/landing.effects';
import {provideCore} from '@core/core.module';
import {SESSION_INITIALIZER_PROVIDER} from '@app/core/initializers/session.initializer';

function createTranslateLoader(
  httpClient: HttpClient,
  platformId: object,
  request: Request | null
): TranslateHttpLoader {
  let prefix = '/assets/i18n/';

  if (isPlatformServer(platformId) && request?.url) {
    try {
      const origin = new URL(request.url).origin;
      prefix = `${origin}/assets/i18n/`;
    } catch {
      // Keep relative path as fallback if request URL cannot be parsed.
    }
  }

  return new TranslateHttpLoader(httpClient, prefix, '.json');
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
          deps: [HttpClient, PLATFORM_ID, REQUEST]
        }
      }
    ).providers!,

    // Animations — use async variant only; provideNoopAnimations() overrides this on the server
    provideAnimationsAsync(),

    // HTTP Client with interceptors support
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi() // This enables class-based interceptors
    ),

    // NgRx Store
    provideStore({ session: sessionReducer, landing: landingReducer }),
    provideEffects([SessionEffects, LandingEffects]),

    // Session initialization
    SESSION_INITIALIZER_PROVIDER,

    // Core services and modules
    provideCore()
  ]
};
