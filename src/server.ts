import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine, isMainModule} from '@angular/ssr/node';
import express from 'express';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import bootstrap from './main.server';
import rateLimit from 'express-rate-limit';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
//const indexHtml = join(serverDistFolder, 'index.html');
const indexHtml = join(browserDistFolder, 'index.html');


const app = express();
app.disable("x-powered-by");
const commonEngine = new CommonEngine();

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

app.use(limiter);
/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] ?? 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on https://localhost:${port}`);
  });
}
