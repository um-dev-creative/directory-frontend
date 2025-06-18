const axios = require('axios');
const {getApiEndpoint} = require('../shared/common-function');
const appConfig = require('../config/app.config');
const directoryVerifyCodeProxyConfig = appConfig.getDirectoryProxyConfig();
const logger = appConfig.getLoggerApp();
const {
  API_SERVICE_DIRECTORY_MAP
} = require("../shared/oauth-common-function");

const proxyApi = async (req, res, next) => {
  let response = null;
  try {
    const apiURL = getApiEndpoint(req.url, directoryVerifyCodeProxyConfig, API_SERVICE_DIRECTORY_MAP);
    const httpOptions = {
      method: req.method,
      url: apiURL,
      headers: {
        'Authorization': req.headers['authorization'],
        'session-token': req.headers['session-token'],
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
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

