if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
process.env.NODE_CONFIG_DIR = __dirname + "/server/config";

const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const httpContext = require('express-http-context');
const appConfig = require('./server/config/app.config');

const PORT = process.env.PORT || '7001';
const DIST_FOLDER = path.join(process.cwd(), 'dist/directory-frontend');
const SSL_OPTIONS = {
  key: fs.readFileSync('./ssl/backbone.key'),
  cert: fs.readFileSync('./ssl/backbone.crt')
};

// Cargar archivo index.html o index.csr.html dinámicamente
function getIndexHtml() {
  const htmlPath = fs.existsSync(path.join(DIST_FOLDER, 'browser/index.html'))
    ? 'index.html'
    : 'index.csr.html';
  return fs.readFileSync(path.join(DIST_FOLDER, 'browser', htmlPath), 'utf-8');
}

async function initAngularSSR() {
  try {
    const serverPath = './dist/directory-frontend/server/main.js';
    console.log(`Loading SSR from: ${serverPath}`);

    if (!fs.existsSync(serverPath)) return null;

    delete require.cache[require.resolve(serverPath)];
    const serverModule = require(serverPath);
    const bootstrap = serverModule.default || serverModule.bootstrap;

    if (!bootstrap || !serverModule.renderApplication) return null;

    const app = express();
    app.use(express.static(path.join(DIST_FOLDER, 'browser')));

    app.get('*', async (req, res) => {
      try {
        const html = await serverModule.renderApplication(bootstrap, {
          document: getIndexHtml(),
          url: req.url,
          platformProviders: []
        });
        res.send(html);
      } catch (err) {
        console.error('❌ SSR error. Falling back to static HTML.');
        res.send(getIndexHtml());
      }
    });

    return app;
  } catch (err) {
    console.error('Error initializing Angular SSR:', err);
    return null;
  }
}

appConfig.bootstrapConfiguration().then(async config => {
  const logger = appConfig.getLoggerApp();
  appConfig.createDirectoryProxyConfig();

  const ssrApp = await initAngularSSR();
  const app = ssrApp || express();

  app.use(RateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }));
  app.use(httpContext.middleware);
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(cors());

  // Rutas backend
  if (!ssrApp) {
    app.use("/", require("./server/routes/auth-directory-backend.routes"));
    app.use("/", require("./server/routes/backbone.routes"));
    app.use(express.static(path.join(DIST_FOLDER, 'browser')));
    app.get("/*", (req, res) => {
      res.sendFile(path.join(DIST_FOLDER, 'browser', 'index.html'));
    });
  }

  https.createServer(SSL_OPTIONS, app).listen(PORT, () => {
    logger.info(`UI running ${ssrApp ? 'with SSR' : 'in SPA mode'} on https://localhost:${PORT}`);
  });
}, err => {
  console.error("Error during bootstrapConfiguration:", err);
});
