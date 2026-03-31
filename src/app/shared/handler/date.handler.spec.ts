import { formatDate } from './date.handler';

describe('formatDate', () => {
  it('should return undefined when no date is provided', () => {
    expect(formatDate(undefined)).toBeUndefined();
  });

  it('should format a date to YYYY-MM-DDTHH:mm:ss at midnight', () => {
    const date = new Date(2025, 10, 27); // Nov 27, 2025 (month is 0-indexed)
    const result = formatDate(date);

    expect(result).toBe('2025-11-27T00:00:00');
  });

  it('should reset time to midnight regardless of input time', () => {
    const date = new Date(2025, 5, 15, 14, 30, 45); // Jun 15, 2025 14:30:45
    const result = formatDate(date);

    expect(result).toBe('2025-06-15T00:00:00');
  });

  it('should pad single-digit months and days', () => {
    const date = new Date(2025, 0, 5); // Jan 5, 2025
    const result = formatDate(date);

    expect(result).toBe('2025-01-05T00:00:00');
  });

  it('should handle end-of-year dates', () => {
    const date = new Date(2025, 11, 31); // Dec 31, 2025
    const result = formatDate(date);

    expect(result).toBe('2025-12-31T00:00:00');
  });

  it('should handle beginning-of-year dates', () => {
    const date = new Date(2026, 0, 1); // Jan 1, 2026
    const result = formatDate(date);

    expect(result).toBe('2026-01-01T00:00:00');
  });

  it('should not mutate the original date object', () => {
    const date = new Date(2025, 5, 15, 14, 30, 45);
    const originalTime = date.getTime();
    formatDate(date);

    expect(date.getTime()).toBe(originalTime);
  });
});
