import {HttpHeaders} from '@angular/common/http';

/**
 * Constant for the session token header key used in backend communication.
 */
export const SESSION_TOKEN_BACKEND = 'session-token-bkd';


/**
 * Class containing various constants used throughout the directory frontend.
 */
export class DirectoryFrontendConst {
  /**
   * Relative paths used for backend service URLs.
   */
  public static readonly RelativePath = {
    DIRECTORY_BACKEND_SERVICE_BASE_URL: '/api/v1',
    BACKBONE_SERVICE_BASE_URL: 'backbone/api',
    AUTH_PATH: '/auth',
    USERS_PATH: '/users'
  };

  /**
   * Options for enabling or disabling simple headers.
   */
  public static readonly HeaderOption = {
    SIMPLE_HEADER_ENABLED: true,
    SIMPLE_HEADER_DISABLED: false
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
    /**
     * Generates HTTP headers with a session token.
     * @param {string} token - The session token.
     * @returns {Object} The HTTP headers object with the session token.
     */
    STANDARD_TOKEN: function (token: string): object {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'session-token-bkd': token,
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
