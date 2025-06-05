const axios = require('axios');
const {getStandardHeader, getApiEndpoint} = require('../shared/common-function');
const appConfig = require('../config/app.config');
const directoryVerifyCodeProxyConfig = appConfig.getDirectoryVerifyCodeProxyConfig();
const {getOAuthClient} = require("../proxy/oauth-client");
const {
  OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_GRANT_TYPE, OAUTH_TOKEN_URL, OAUTH_AUTHENTICATION_TYPE,
  OAUTH_USER_ALIAS, OAUTH_USER_PASSWORD, API_SERVICE_DIRECTORY_MAP
} = require("../shared/oauth-common-function");
const {backboneSessionToken} = require("./backbone.controller");
const {getUserSession} = require('../shared/user-session-store');

/**
 * Directory OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const directoryOauthClientConfig = {
  clientId: OAUTH_CLIENT_ID,
  clientSecret: OAUTH_CLIENT_SECRET,
  grantType: OAUTH_GRANT_TYPE,
  tokenUrl: OAUTH_TOKEN_URL,
  authenticationType: OAUTH_AUTHENTICATION_TYPE,
  username: OAUTH_USER_ALIAS,
  password: OAUTH_USER_PASSWORD
};

const proxyApi = async (req, res) => {
  let response = null;
  try {
    // Obtener el identificador de usuario (alias o email)
    const userId = req.body.alias || req.body.email;
    // Recuperar la sesión del usuario
    const session = getUserSession(userId);
    // Obtener el bearer token de Directory
    const dsBearToken = session?.dsBearToken || await getOAuthClient(directoryOauthClientConfig).getBearerToken();
    // Obtener el session-token si existe
    const sessionToken = session?.directorySession;
    // Construir headers correctamente
    const headers = getStandardHeader(req, dsBearToken, 'application/json');
    if (sessionToken) {
      headers['session-token'] = sessionToken;
    }
    if (dsBearToken) {
      headers['Authorization'] = `Bearer ${dsBearToken}`;
    }
    // Validar formato correcto del token
    if (dsBearToken && !dsBearToken.startsWith('Bearer ')) {
      headers['Authorization'] = `Bearer ${dsBearToken}`;
    }
    // Validar que el session-token no esté vacío o inválido
    if (!headers['session-token'] || typeof headers['session-token'] !== 'string' || headers['session-token'].length < 10) {
      return res.status(401).json({error: 'Invalid or missing session-token'});
    }
    if (!headers['Authorization'] || typeof headers['Authorization'] !== 'string' || headers['Authorization'].length < 20) {
      return res.status(401).json({error: 'Invalid or missing Authorization token'});
    }
    if (!headers['session-token'] || !headers['Authorization']) {
      return res.status(401).json({error: 'Missing authentication tokens'});
    }
    const apiURL = getApiEndpoint(req.url, directoryVerifyCodeProxyConfig, API_SERVICE_DIRECTORY_MAP);
    const httpOptions = {
      method: req.method,
      url: apiURL,
      headers: headers,
      data: req.body
    };
    const axiosResponse = await axios(httpOptions);
    response = axiosResponse.data;
    res.status(axiosResponse.status);
  } catch (error) {
    if (error.response != null) {
      response = error.response.data;
      res.status(error.response.status);
    } else if (error.errors != null) {
      response = error;
      res.status(500);
    }
  }
  res.send(response);
};

module.exports = {
  proxyApi
};

