/**
 * Envelope the BFF puts around every answer of directory-backend (`getSimpleResponse` in `server/shared/common-function.js`):
 * the HTTP status of the backend call in `headers` and the backend body in `data` (`null` when the body is empty, e.g. a 204).
 */
export interface BffResponse<T> {
  headers: {
    status: number;
    statusText?: string;
  };
  data: T | null;
}
