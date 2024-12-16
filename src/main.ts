import {bootstrapApplication} from '@angular/platform-browser';
import {App} from '@app/app';
import {environment} from '@env/environment';
import {enableProdMode} from "@angular/core";
import {appConfig} from "@app/app.config";

/**
 * Enable production mode
 */
if (environment.production) {
  enableProdMode();
}

/**
 * Bootstrap the application
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
