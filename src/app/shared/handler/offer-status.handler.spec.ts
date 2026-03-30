import { getOfferStatus } from './offer-status.handler';
import { OfferStatus } from '@app/features/partner/components/settings/offers';

describe('getOfferStatus', () => {
  it('should return ACTIVE for "ACTIVE"', () => {
    expect(getOfferStatus('ACTIVE')).toBe(OfferStatus.ACTIVE);
  });

  it('should return ACTIVE for lowercase "active"', () => {
    expect(getOfferStatus('active')).toBe(OfferStatus.ACTIVE);
  });

  it('should return ACTIVE for mixed case "Active"', () => {
    expect(getOfferStatus('Active')).toBe(OfferStatus.ACTIVE);
  });

  it('should return EXPIRED for "EXPIRED"', () => {
    expect(getOfferStatus('EXPIRED')).toBe(OfferStatus.EXPIRED);
  });

  it('should return EXPIRED for lowercase "expired"', () => {
    expect(getOfferStatus('expired')).toBe(OfferStatus.EXPIRED);
  });

  it('should return EXPIRED for trimmed " EXPIRED "', () => {
    expect(getOfferStatus(' EXPIRED ')).toBe(OfferStatus.EXPIRED);
  });

  it('should return INACTIVE for unknown status', () => {
    expect(getOfferStatus('UNKNOWN')).toBe(OfferStatus.INACTIVE);
  });

  it('should return INACTIVE for empty string', () => {
    expect(getOfferStatus('')).toBe(OfferStatus.INACTIVE);
  });

  it('should return INACTIVE for null', () => {
    expect(getOfferStatus(null as any)).toBe(OfferStatus.INACTIVE);
  });

  it('should return INACTIVE for undefined', () => {
    expect(getOfferStatus(undefined as any)).toBe(OfferStatus.INACTIVE);
  });

  it('should handle whitespace-only input as INACTIVE', () => {
    expect(getOfferStatus('   ')).toBe(OfferStatus.INACTIVE);
  });

  it('should return INACTIVE for "INACTIVE"', () => {
    expect(getOfferStatus('INACTIVE')).toBe(OfferStatus.INACTIVE);
  });
});
