/**
 * Format a Date into a local date-time string suitable for backend payloads.
 *
 * Returns a string in the format: YYYY-MM-DDTHH:mm:ss (local time, midnight
 * when only a date is intended). If no date is provided returns `undefined`.
 *
 * Examples:
 *  formatDate(new Date('2025-11-27')) -> '2025-11-27T00:00:00'
 *  formatDate(undefined) -> undefined
 *
 * @param date Optional Date to format
 * @returns formatted local date-time string or undefined
 */
export function formatDate(date?: Date): string | undefined {
  const toLocalDateTime = (d?: Date): string | undefined => {
    if (!d) return undefined;
    const dt = new Date(d);
    // Set to local midnight
    dt.setHours(0, 0, 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  };

  return toLocalDateTime(date);
}
