import { getInitials } from './get-initials.helper';

describe('getInitials', () => {
  it('should return initials from first and last name', () => {
    expect(getInitials('Juan', 'Pérez')).toBe('JP');
  });

  it('should return single initial when only first name is provided', () => {
    expect(getInitials('Juan', '')).toBe('J');
  });

  it('should return single initial when only last name is provided', () => {
    expect(getInitials('', 'Pérez')).toBe('P');
  });

  it('should return empty string when both are empty', () => {
    expect(getInitials('', '')).toBe('');
  });

  it('should handle null-ish values gracefully', () => {
    expect(getInitials(null as any, undefined as any)).toBe('');
  });

  it('should uppercase lowercase initials', () => {
    expect(getInitials('ana', 'garcía')).toBe('AG');
  });
});
