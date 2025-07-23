import {HttpHeaders} from '@angular/common/http';

/**
 * Constant for the session token header key used in backend communication.
 */
export const SESSION_TOKEN_BACKEND = 'session-token-bkd';
export const AUTHORIZATION_TOKEN_KEY = 'authorization';


/**
 * Class containing various constants used throughout the directory frontend.
 */
export class DirectoryFrontendConst {
  /**
   * Relative paths used for backend service URLs.
   */
  public static readonly RelativePath = {
    DIRECTORY_BACKEND_BASE_URL: '/drb/api/v1',
    BACKBONE_BASE_URL: 'bkd/api/v1',
    AUTH_PATH: '/auth',
    USERS_PATH: '/users',
    PROFILE_PATH: '/profile',
    D_IMAGE_PATH: '/d-image',
    BUSINESS_PATH: '/businesses',
    GENERAL_PATH: '/general',
    VERIFY_CODE_PATH: '/verify-code',
    USER_CREATE_PATH: '/create-user',
    STAGE_PATH: '/stage',
    STAGE_UI_PATH: 'stage',
    ASSETS_i18_PATH: '/assets/i18n/',
  };

  /**
   * HTTP status codes and their corresponding messages.
   */
  public static readonly HttpStatus = {
    HTTP_STATUS_BAD_REQUEST: {code: 400, message: 'Bad Request'},
    HTTP_STATUS_UNAUTHORIZED: {code: 401, message: 'Unauthorized'},
    HTTP_STATUS_FORBIDDEN: {code: 403, message: 'Forbidden'},
    HTTP_STATUS_NOT_FOUND: {code: 404, message: 'Not Found'},
    HTTP_STATUS_CONFLICT: {code: 409, message: 'Conflict'},
    HTTP_STATUS_SUCCESS: {code: 200, message: ['Success', 'OK']},
    HTTP_STATUS_CREATED: {code: 201, message: 'Created'},
    HTTP_STATUS_NO_CONTENT: {code: 204, message: 'No Content'},
    HTTP_STATUS_INTERNAL_SERVER_ERROR: {code: 500, message: 'Internal Server Error'},
    HTTP_STATUS_SERVICE_UNAVAILABLE: {code: 503, message: 'Service Unavailable'},
    HTTP_STATUS_GATEWAY_TIMEOUT: {code: 504, message: 'Gateway Timeout'},
    HTTP_STATUS_UNKNOWN: {code: 0, message: 'Unknown'},
    /**
     * Custom HTTP status code and message.
     * @param {number} code - The HTTP status code.
     * @param {string} message - The message corresponding to the status code.
     * @returns {Object} The custom HTTP status object.
     */
    HTTP_STATUS_CUSTOM: function (code: number, message: string): object {
      return {
        code: code,
        message: message
      };
    }
  };

  /**
   * Predefined HTTP headers used in various requests.
   */
  public static readonly HttpHeader = {
    STANDARD: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    STANDARD_ARRAY_BUFFER: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'responseType': 'arraybuffer'
    }),
    STANDARD_FILE: new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'responseType': 'arraybuffer',
      'Accept': 'application/octet-stream'
    }),
    FORM_DATA: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      'responseType': 'application/json'
    }),
    /**
     * Generates HTTP headers with a session token.
     * @param {string} token - The session token.
     * @returns {Object} The HTTP headers object with the session token.
     */
    STANDARD_TOKEN_BKD: function (token: string): object {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'session-token-bkd': token,
          'Access-Control-Allow-Origin': '*'
        })
      };
    },
    /**
     * Generates HTTP headers with a session token.
     * @param {string} token - The session token.
     * @param {string} bearerToken - The bearer token.
     * @returns {Object} The HTTP headers object with the session token.
     */
    STANDARD_SESSION_HEADER: function (token: string, bearerToken: string): object {
      return new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          'session-token': token,
          'Access-Control-Allow-Origin': '*'
      });
    },
    /**
     * Generates HTTP headers with a session token.
     * @param {string} uii - User ID.
     * @returns {Object} The HTTP headers object with the session token.
     */
    STANDARD_TOKEN_DIR: function (uii: string): object {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'uii': uii,
          'Access-Control-Allow-Origin': '*'
        })
      };
    }
  };
}

export const DFC = DirectoryFrontendConst;
// tslint:disable-next-line:no-namespace
export namespace AppConstants {
}
