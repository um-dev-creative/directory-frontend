/**
 * Error handling helpers
 *
 * Small utilities that normalize various shapes of errors coming from
 * backend HTTP calls or other runtime exceptions into a predictable
 * structure the UI and services can consume.
 *
 * The exported helpers are intentionally defensive: they accept `any`
 * input and produce a best-effort normalized object with `status`,
 * `message` and `errors` fields.
 */

/**
 * Normalize an error object originating from an HTTP request or other
 * runtime sources into a consistent, lightweight payload.
 *
 * Behavior/Normalization rules:
 * - If `err` contains an `error` property, it will be treated as the
 *   backend payload; otherwise `err` is used directly.
 * - `status` is taken from `err.status` if available, otherwise `0`.
 * - `message` prefers `payload.message`, then `err.message`, and falls
 *   back to `'Unknown error'` when none are present.
 * - `errors` is populated from `payload.errors` when present, otherwise
 *   the entire payload is returned (may be `null`).
 *
 * @param {any} err - The raw error object (HTTP error response, exception, etc.).
 * @returns {{status:number, message:string, errors:any}} A normalized error payload.
 *
 * @example
 * // Typical HTTP error shape
 * const normalized = sanitizeError({ status: 401, error: { message: 'Unauthorized' } });
 * // normalized -> { status: 401, message: 'Unauthorized', errors: null }
 *
 * @example
 * // Backend with validation errors
 * const normalized = sanitizeError({ status: 422, error: { message: 'Validation failed', errors: { name: ['required'] } } });
 * // normalized -> { status: 422, message: 'Validation failed', errors: { name: ['required'] } }
 */
export function sanitizeError(err: any): any{
  const payload = err?.error ?? null;
  return {
    status: err?.status ?? 0,
    message: payload?.message ?? err?.message ?? 'Unknown error',
    errors: payload?.errors ?? payload
  }
}
