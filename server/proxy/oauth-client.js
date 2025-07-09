const assert = require('assert');
const axios = require('axios');
const appConfig = require("../config/app.config");
const logger = appConfig.getLoggerApp();
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_OAUTH_CLIENT}] :::`;
const constants = require('../config/constants.util.js');
const AuthenticationType = {
  OPAQUE: "OPAQUE",
  JWT: "JWT"
}

/**
 * Class representing an OAuth client.
 */
class OAuthClient {
  clientId;
  clientSecret;
  grantType;
  tokenUrl;
  authenticationType;
  tokenCachePeriod = 1800;
  cacheToken;
  lastRequestTime = 0;

  /**
   * Creates an OAuth client.
   * @param {Object} config - The configuration object.
   * @param {string} config.clientId - The client ID.
   * @param {string} config.clientSecret - The client secret.
   * @param {string} config.grantType - The grant type.
   * @param {string} config.tokenUrl - The token URL.
   * @param {string} config.authenticationType - The authentication type.
   * @param {string} config.username - The username.
   * @param {string} config.password - The password.
   */
  constructor(config) {
    assert.ok(config, `${LOGGER_TAG_ID} config is not defined`);
    assert.ok(config.clientId, `${LOGGER_TAG_ID} config.clientId is not provided for Auth Type: ${config.clientId}`);
    assert.ok(config.clientSecret, `${LOGGER_TAG_ID} config.clientSecret is not provided for Auth Type: ${config.clientSecret}`);
    assert.ok(config.grantType, `${LOGGER_TAG_ID} config.grantType is not provided for Auth Type: ${config.grantType}`);
    assert.ok(config.tokenUrl, `${LOGGER_TAG_ID} config.tokenUrl is not provided for Auth Type: ${config.tokenUrl}`);
    assert.ok(config.username, `${LOGGER_TAG_ID} config.username is not provided for Auth Type: ${config.username}`);
    assert.ok(config.password, `${LOGGER_TAG_ID} config.password is not provided for Auth Type: ${config.password}`);

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.grantType = config.grantType;
    this.tokenUrl = config.tokenUrl;
    this.username = config.username;
    this.password = config.password;
    this.authenticationType = config.authenticationType;
  }

  /**
   * Retrieves the bearer token.
   * @returns {Promise<string>} The bearer token.
   */
  getBearerToken = async() => {
    const requestTime = new Date().getTime();
    if(this.cacheToken === undefined || this.cacheToken === "" || (requestTime - this.lastRequestTime) / 1000 > this.tokenCachePeriod) {
      let options = {};
      if(this.authenticationType === AuthenticationType.OPAQUE) {
        options = {
          headers: {
            'Content-Type': constants.CONTENT_TYPE_X_FORM_URLENCODED,
          },
          data: new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: this.grantType,
            username:this.username,
            password:this.password
          }),
          url: this.tokenUrl
        };
      } else  {
        options = {
          method: constants.POST_METHOD,
          headers: {
            'Content-Type': constants.CONTENT_TYPE_X_FORM_URLENCODED,
          },
          data: {
            grant_type: this.grantType,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            username:this.username,
            password:this.password
          },
          url: this.tokenUrl
        };
      }
      logger.debug(`${LOGGER_TAG_ID} Requesting token from ${this.tokenUrl} with clientId: ${this.clientId},
       authenticationType: ${this.authenticationType} and grantType: ${this.grantType}`);
      // Call OAuth service
      logger.debug(`${LOGGER_TAG_ID} Request options: ${JSON.stringify(options)}`);
      const oauthResponse = await axios(options);
      logger.debug(`${LOGGER_TAG_ID} Received token response: ${JSON.stringify(oauthResponse.data)}`);
      // Cache token in local variable.
      this.cacheToken = oauthResponse.data.access_token;
      this.lastRequestTime = requestTime;
      return this.cacheToken;
    } else {
      return this.cacheToken;
    }
  };
}

/**
 * Retrieves an OAuth client instance.
 * @param {Object} oauthClientConfig - The OAuth client configuration.
 * @returns {OAuthClient} The OAuth client instance.
 */
module.exports.getOAuthClient = function(oauthClientConfig) {
  return new OAuthClient(oauthClientConfig);
}
