import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {routes} from '@app/app.routes';
import {HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideStore} from '@ngrx/store';
import {sessionReducer} from '@shared/signals/session/session.reducer';
import {provideEffects} from '@ngrx/effects';
import {SessionEffects} from '@shared/signals/session/session-effects';
import {CoreModule} from './core/core.module';

function createTranslateLoader(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    
    // Import CoreModule providers
    importProvidersFrom(CoreModule),
    
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
  ]
};
