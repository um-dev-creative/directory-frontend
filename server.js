process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.NODE_CONFIG_DIR = __dirname + "/server/config";

const httpContext = require('express-http-context');
const RateLimit = require('express-rate-limit');
const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const appConfig = require('./server/config/app.config');
const compression = require('compression');
const cors = require('cors');
const fs = require('fs');

// Importar el servidor SSR de Angular
let angularApp;

const options = {
  key: fs.readFileSync('./ssl/backbone.key'),
  cert: fs.readFileSync('./ssl/backbone.crt')
}

// Función para inicializar la aplicación Angular SSR
async function initAngularSSR() {
  try {
    const serverPath = './dist/directory-frontend/server/main.js';
    console.log(`Loading SSR from: ${serverPath}`);

    if (fs.existsSync(serverPath)) {
      // Limpiar cache de require para desarrollo
      delete require.cache[require.resolve(serverPath)];
      const serverModule = require(serverPath);

      console.log('Server module loaded successfully');

      // Crear aplicación Express para SSR
      const app = express();
      const DIST_FOLDER = path.join(process.cwd(), 'dist/directory-frontend');

      // Configurar archivos estáticos
      app.use(express.static(path.join(DIST_FOLDER, 'browser')));

      // Configurar SSR para rutas Angular
      app.get('*', async (req, res) => {
        try {
          const indexHtml = fs.readFileSync(
            path.join(DIST_FOLDER, 'browser/index.html'),
            'utf-8'
          );

          // Usar la función bootstrap de Angular
          if (serverModule.renderApplication && (serverModule.default || serverModule.bootstrap)) {
            const bootstrap = serverModule.default || serverModule.bootstrap;
            const html = await serverModule.renderApplication(bootstrap, {
              document: indexHtml,
              url: req.url,
              platformProviders: [],
            });
            res.send(html);
          } else {
            console.warn('SSR bootstrap or renderApplication not found. Falling back to static index.html');
            res.send(indexHtml);
          }
        } catch (error) {
          console.error('SSR rendering error:', error);
          // Fallback a index.html estático
          const indexFileName = fs.existsSync(path.join(DIST_FOLDER, 'browser/index.html'))
            ? 'index.html'
            : 'index.csr.html';

          const indexHtml = fs.readFileSync(
            path.join(DIST_FOLDER, 'browser', indexFileName),
            'utf-8'
          );
          console.warn(`SSR failed, serving static ${indexFileName}`);
          res.send(indexHtml);
        }
      });

      return app;
    }
  } catch (error) {
    console.error('Error setting up Angular SSR:', error);
  }

  return null;
}

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // max 1000 requests per windowMs
});

// Call bootstrap method which calls iConfig
appConfig.bootstrapConfiguration().then(
  async config => {
    appConfig.createDirectoryProxyConfig();

    let logger = appConfig.getLoggerApp();

    // Inicializar Angular SSR
    angularApp = await initAngularSSR();

    if (angularApp) {
      // Configurar middlewares en la app de Angular
      angularApp.use(limiter);
      angularApp.use(httpContext.middleware);
      angularApp.use(compression());
      angularApp.use(bodyParser.json({limit: '50mb'}));
      angularApp.use(cors());

      // Agregar las rutas de backend ANTES de las rutas de Angular
      angularApp.use("/", require("./server/routes/directory-backend.routes"));

      // Get port from environment and store in Express.
      const port = '7001';

      const server = https.createServer(options, angularApp);
      server.listen(port, () => logger.info(`UI running with SSR on localhost:${port}`));
    } else {
      // Fallback a configuración SPA si SSR falla
      const app = express();
      app.use(limiter);
      app.use(httpContext.middleware);
      app.use(compression());
      app.use(bodyParser.json({limit: '50mb'}));
      app.use(cors());

      app.use("/", require("./server/routes/directory-backend.routes"));
      app.use(express.static("dist/directory-frontend/browser"));
      app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/directory-frontend/browser", "index.html"));
      });

      const port = '7001';
      const server = https.createServer(options, app);
      server.listen(port, () => logger.info(`UI running in SPA mode on localhost:${port} (SSR failed)`));
    }
  },
  err => {
    logger.error("Error in bootstrapping application", err);
  }
);
