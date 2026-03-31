import { sanitizeError } from './error.handler';

describe('sanitizeError', () => {
  it('should normalize a typical HTTP error with nested error payload', () => {
    const result = sanitizeError({
      status: 401,
      error: { message: 'Unauthorized' }
    });

    expect(result.status).toBe(401);
    expect(result.message).toBe('Unauthorized');
    // When payload has no `.errors`, the entire payload is returned as errors
    expect(result.errors).toEqual({ message: 'Unauthorized' });
  });

  it('should extract validation errors from payload', () => {
    const result = sanitizeError({
      status: 422,
      error: {
        message: 'Validation failed',
        errors: { name: ['required'], email: ['invalid'] }
      }
    });

    expect(result.status).toBe(422);
    expect(result.message).toBe('Validation failed');
    expect(result.errors).toEqual({ name: ['required'], email: ['invalid'] });
  });

  it('should fall back to err.message when no error payload', () => {
    const result = sanitizeError({
      status: 500,
      message: 'Internal Server Error'
    });

    expect(result.status).toBe(500);
    expect(result.message).toBe('Internal Server Error');
  });

  it('should return "Unknown error" when no message is available', () => {
    const result = sanitizeError({ status: 503 });

    expect(result.status).toBe(503);
    expect(result.message).toBe('Unknown error');
  });

  it('should default status to 0 when not present', () => {
    const result = sanitizeError({});

    expect(result.status).toBe(0);
    expect(result.message).toBe('Unknown error');
  });

  it('should handle null input gracefully', () => {
    const result = sanitizeError(null);

    expect(result.status).toBe(0);
    expect(result.message).toBe('Unknown error');
    expect(result.errors).toBeNull();
  });

  it('should handle undefined input gracefully', () => {
    const result = sanitizeError(undefined);

    expect(result.status).toBe(0);
    expect(result.message).toBe('Unknown error');
    expect(result.errors).toBeNull();
  });

  it('should use error payload as errors when payload has no errors field', () => {
    const result = sanitizeError({
      status: 400,
      error: { message: 'Bad Request', detail: 'Missing field' }
    });

    expect(result.errors).toEqual({ message: 'Bad Request', detail: 'Missing field' });
  });

  it('should prefer payload.message over err.message', () => {
    const result = sanitizeError({
      status: 409,
      message: 'Outer message',
      error: { message: 'Inner message' }
    });

    expect(result.message).toBe('Inner message');
  });
});
