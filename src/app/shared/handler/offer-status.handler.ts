/**
 * Utilities to normalize and map raw backend status values into the
 * application's OfferStatus enum.
 *
 * Backend APIs may return status values in different formats (lower/upper
 * case, null/undefined, or missing). The helpers in this file provide a
 * single place to normalize those values reliably.
 */
import {OfferStatus} from '@app/features/partner/components/settings/offers';

/**
 * Normalize an arbitrary status-like value into the frontend OfferStatus enum.
 *
 * This function is defensive: it accepts any string (including null/undefined)
 * and returns one of the OfferStatus enum members. The normalization rules are:
 * - Convert the input to a trimmed, uppercased string.
 * - If it equals `OfferStatus.ACTIVE` -> return `OfferStatus.ACTIVE`.
 * - If it equals `OfferStatus.EXPIRED` -> return `OfferStatus.EXPIRED`.
 * - Otherwise return `OfferStatus.INACTIVE` as a safe default.
 *
 * @param {string} value - Raw status value from backend or other sources.
 *                        May be null/undefined; it will be handled gracefully.
 * @returns {OfferStatus} One of the OfferStatus enum values (ACTIVE, EXPIRED, INACTIVE).
 *
 * @example
 * getOfferStatus('active') === OfferStatus.ACTIVE
 * getOfferStatus(' EXPIRED ') === OfferStatus.EXPIRED
 * getOfferStatus(null) === OfferStatus.INACTIVE
 */
export function getOfferStatus(value: string): OfferStatus {
    const normalizeStatus = (s: any): OfferStatus => {
      const val = (s ?? '').toString().trim().toUpperCase();
      if (val === OfferStatus.ACTIVE) return OfferStatus.ACTIVE;
      if (val === OfferStatus.EXPIRED) return OfferStatus.EXPIRED;
      return OfferStatus.INACTIVE;
    };
    return normalizeStatus(value);
  }
