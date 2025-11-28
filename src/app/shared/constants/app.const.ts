/**
 * Application-level constants used across the Directory Frontend.
 *
 * This module centralizes string literals, header templates, relative backend
 * paths, and commonly-used HTTP status objects so the rest of the codebase
 * can import a single source of truth for these values.
 *
 * Guidelines:
 * - Use `SESSION_TOKEN_BACKEND` when attaching the backend session token header.
 * - Use values from `DirectoryFrontendConst.RelativePath` to construct backend URLs.
 * - Use `DirectoryFrontendConst.HttpHeader` for pre-built HttpHeaders when making
 *   HTTP requests from the frontend.
 */
import {HttpHeaders} from '@angular/common/http';

/**
 * Header key for the backend session token.
 * Use this when setting the session token header for backend requests.
 * Example: req.headers.set(SESSION_TOKEN_BACKEND, token)
 */
export const SESSION_TOKEN_BACKEND = 'session-token-bkd';

/**
 * Key used for bearer/authorization token headers. This constant represents
 * the canonical header key name for Authorization values in requests.
 */
export const AUTHORIZATION_TOKEN_KEY = 'authorization';


/**
 * DirectoryFrontendConst groups commonly reused constants and helper
 * generators for the Directory frontend application.
 *
 * - `RelativePath` provides base and path fragments used to build backend
 *   API URLs (keeps routes centralized).
 * - `GeneralConstant` contains miscellaneous general-purpose constants.
 * - `HttpStatus` provides common HTTP status objects and a helper to build
 *   custom status objects.
 * - `HttpHeader` contains prebuilt HttpHeaders instances and small helpers
 *   to construct headers with session/bearer tokens.
 */
export class DirectoryFrontendConst {
  /**
   * Relative paths used for backend service URLs. Use these constants to
   * construct HTTP endpoints and avoid duplicating path literals across the
   * codebase.
   *
   * Example usage:
   * const url = DirectoryFrontendConst.RelativePath.DIRECTORY_BACKEND_BASE_URL + DirectoryFrontendConst.RelativePath.GENERAL_PATH + '/campaigns';
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
    CATEGORY_PATH: '/categories',
    TIMEZONE_PATH: '/timezones'
  };

  /**
   * General frontend constants. Keep small, well-scoped values here.
   */
  public static readonly GeneralConstant = {
    STATUS: 'status'
  };

  /**
   * Common HTTP status objects and helpers used across the frontend.
   * Each entry contains a `code` and a human-friendly `message` (or array
   * of messages where applicable).
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
     * Build a custom HTTP status object with a numeric code and string
     * message. Useful in places where a non-standard status object is needed
     * for UI messaging or tests.
     *
     * @param code - the numeric HTTP status code
     * @param message - a short, human-readable message for the status
     * @returns an object with `code` and `message` fields
     */
    HTTP_STATUS_CUSTOM: function (code: number, message: string): object {
      return {
        code: code,
        message: message
      };
    }
  };

  /**
   * Collection of pre-built HttpHeaders and helper functions for common
   * header shapes used by the application.
   *
   * - `STANDARD` is a typical JSON content-type header used for most requests.
   * - `STANDARD_ARRAY_BUFFER` and `STANDARD_FILE` are slight variants used
   *   when binary responses or file uploads/downloads are involved.
   * - `STANDARD_TOKEN_BKD` / `STANDARD_SESSION_HEADER` generate headers that
   *   include backend session tokens or bearer tokens.
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
     * Returns an options object with headers containing the backend session token.
     * This is intended for calls that require a backend session token header
     * (the backend key expected is `session-token-bkd`).
     *
     * @param token - backend session token string
     * @returns an object with a `headers` property set to an HttpHeaders instance
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
     * Construct headers including a bearer authorization token and session token.
     * Useful for endpoints that require both an Authorization header and a
     * session token header.
     *
     * @param token - the session token
     * @param bearerToken - the bearer token (JWT)
     * @returns HttpHeaders containing Authorization and session-token fields
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
     * Build a headers object containing a user identifier header field.
     * @param uii - user identifier string
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
