const assert = require('assert');
const axios = require('axios');
const constants = require("../config/constants.util");

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
    assert.ok(config, "BackboneClient: config is not defined");
    assert.ok(config.url, "BackboneClient: config.url is not defined");
    this.url = config.url;
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
    let options = {
      method: constants.POST_METHOD,
      headers: {
        'Content-Type': constants.CONTENT_TYPE_DEFAULT,
        'Authorization': constants.BEARER + bearerToken
      },
      data: {
        'email': email,
        'password': password,
        'applicationId': applicationId
      },
      url: this.url
    }

    const backboneResponse = await axios(options);
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
    let options = {
      method: constants.GET_METHOD,
      headers: {
        'Content-Type': constants.CONTENT_TYPE_DEFAULT,
        'Authorization': constants.BEARER + bearToken,
        'session-token': sessionTokenBkd
      },
      url: this.url
    }
    try {
      const backboneResponse = await axios(options);
      return backboneResponse.data;
    } catch (error) {
      console.error("Error in getNewToken:", error);
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
