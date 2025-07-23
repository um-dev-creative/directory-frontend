const assert = require('assert');
const axios = require('axios');
const constants = require("../config/constants.util");
const appConfig = require("../config/app.config");
const logger = appConfig.getLoggerApp();
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_DIRECTORY_BACKEND_MULTIMEDIA}] :::`;

/**
 * BackboneClient class to interact with the backbone API to get the
 * token for the user to access the API endpoints in the backbone.
 */
class BackboneClient {

  /**
   * Constructor for BackboneClient class.
   * @param config - Configuration object for the backbone API.
   */
  constructor(config) {
    logger.debug(`${LOGGER_TAG_ID} Initializing BackboneClient with config: ${JSON.stringify(config)}`);
    assert.ok(config, "BackboneClient: config is not defined");
    assert.ok(config.url, "BackboneClient: config.url is not defined");
    this.url = config.url;
    logger.debug(`${LOGGER_TAG_ID} BackboneClient initialized with URL: ${this.url}`);
  }

  /**
   * Get the token from the backbone API for the user to access the API endpoints.
   * @param email - User email to get the token.
   * @param password - Password for the user.
   * @param applicationId - Application ID to get the token.
   * @param bearerToken - Bearer token to access the backbone API.
   * @returns {Promise<any>} - Promise object represents the token.
   */
  getToken = async (email, password, applicationId, bearerToken) => {
    logger.debug(`${LOGGER_TAG_ID} getToken called with email: ${email}, applicationId: ${applicationId}`);
    let options = {
      method: constants.POST_METHOD,
      headers: {
        [constants.CONTENT_TYPE]: constants.CONTENT_TYPE_APPLICATION_JSON,
        [constants.AUTHORIZATION]: constants.BEARER + bearerToken
      },
      data: {
        [constants.EMAIL_ATTRIBUTE]: email,
        [constants.PASSWORD_ATTRIBUTE]: password,
        [constants.APPLICATION_ID_ATTRIBUTE]: applicationId
      },
      url: this.url
    }
    logger.debug(`${LOGGER_TAG_ID} Options for getToken: ${JSON.stringify(options)}`);
    const backboneResponse = await axios(options);
    logger.debug(`${LOGGER_TAG_ID} Response from getToken: ${JSON.stringify(backboneResponse.data)}`);
    return backboneResponse.data;
  };

  /**
   * Asynchronously retrieves a new token by making an HTTP GET request.
   *
   * @param {string} bearToken - The bearer token required for authorization.
   * @param {string} sessionTokenBkd - The session token used for backend communication.
   * @returns {Promise<Object>} A promise that resolves to the data from the response.
   * @throws {Error} Throws an error if the HTTP request fails.
   */
  getNewToken = async (bearToken, sessionTokenBkd) => {
    logger.debug(`${LOGGER_TAG_ID} getNewToken called with bearToken: ${bearToken}, sessionTokenBkd: ${sessionTokenBkd}`);
    let options = {
      method: constants.GET_METHOD,
      headers: {
        [constants.CONTENT_TYPE]: constants.CONTENT_TYPE_APPLICATION_JSON,
        [constants.AUTHORIZATION]: constants.BEARER + bearToken,
        [constants.SESSION_TOKEN_DIR]: sessionTokenBkd
      },
      url: this.url
    }
    try {
      const backboneResponse = await axios(options);
      return backboneResponse.data;
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error in getNewToken: ${error.message}`);
      throw error;
    }
  };
}


/**
 * Retrieves the API endpoint for a given path.
 * @param backboneConfig - Backbone configuration object.
 * @returns {BackboneClient} - BackboneClient object.
 */
module.exports.getInstance = function (backboneConfig) {
  return new BackboneClient(backboneConfig);
};
