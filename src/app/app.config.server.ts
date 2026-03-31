import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Suppress DOM-dependent animations on the server
    provideNoopAnimations()
    // NOTE: provideZoneChangeDetection is intentionally omitted here.
    // appConfig already provides it; a second call via mergeApplicationConfig
    // instantiates a second NgZone outside the first zone's context → NG0908.
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
