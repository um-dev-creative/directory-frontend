/**
 * Returns the uppercase initials from a first and last name.
 * Example: "Juan", "Pérez" → "JP"
 * If both values are empty, returns "".
 */
export function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? '';
  const last = lastName?.charAt(0)?.toUpperCase() ?? '';
  return first + last;
}
