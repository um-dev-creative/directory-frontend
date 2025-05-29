import {bootstrapApplication} from '@angular/platform-browser';
import {App} from '@app/app';
import {config} from '@app/app.config.server';

/**
 * Bootstrap the application
 */
const bootstrap = () => bootstrapApplication(App, config);

/** Export the bootstrap function */
export { bootstrap };
export default bootstrap;
