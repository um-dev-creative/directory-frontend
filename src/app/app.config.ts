import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {routes} from '@app/app.routes';
import {HttpClient, provideHttpClient, withFetch} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideStore} from '@ngrx/store';
import {sessionReducer} from '@shared/signals/session/session.reducer';
import {provideEffects} from '@ngrx/effects';
import {SessionEffects} from '@shared/signals/session/session-effects';

function createTranslateLoader(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
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
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideStore({ session: sessionReducer}),
    provideEffects([SessionEffects]),
  ]
};
