import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Override zone configuration for server-side rendering
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
