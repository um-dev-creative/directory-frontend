import {bootstrapApplication, BootstrapContext} from '@angular/platform-browser';
import {App} from '@app/app';
import {config} from '@app/app.config.server';

/**
 * Bootstrap the application
 */
const bootstrap = (context: BootstrapContext) => {
    if (!context || typeof context !== 'object') {
        throw new Error('Invalid BootstrapContext: context must be a non-null object');
    }
    return bootstrapApplication(App, config, context);
};

/** Export the bootstrap function */
export { bootstrap };
export default bootstrap;
