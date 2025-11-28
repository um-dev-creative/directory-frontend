// Mapper service for Campaign normalization

import {Injectable} from '@angular/core';
import {Offer, OfferStatus} from '@app/features/partner/components/settings/offers/services/partner-offers.service';
import {Campaign, CampaignCreateRequest} from '@shared/models/campaign.model';
import {getOfferStatus} from '@shared/handler/offer-status.handler';
import {formatDate} from '@shared/handler/date.handler';

/**
 * CampaignHandler is an injectable service that centralizes conversion logic
 * between backend Campaign DTOs and frontend models (Campaign and Offer).
 *
 * Use this service when you need to normalize backend responses or convert
 * a Campaign into an Offer for UI components.
 */
@Injectable({ providedIn: 'root' })
export class CampaignMapper {

  constructor() {}

  /**
   * Normalize a backend DTO into a Campaign object.
   * Accepts varied backend shapes and returns a consistent Campaign shape.
   * @param dto Raw backend object
   */
  mapToCampaign(dto: any): Campaign {
    const src = dto ?? {};
    return {
      id: String(src.id ?? src.uuid ?? ''),
      title: src.title ?? '',
      description: src.description ?? src.summary ?? src.desc ?? '',
      categoryId: src.categoryId ?? src.category ?? null,
      categoryName: src.categoryName ?? src.category ?? null,
      startDate: src.startDate ?? src.validFrom ?? null,
      endDate: src.endDate ?? src.validUntil ?? null,
      discount: Number(src.discount ?? 0),
      status: src.status ?? src.state ?? null,
      terms: src.terms ?? null
    } as Campaign;
  }

  /**
   * Convert a Campaign into an Offer used by the partner offers UI.
   * @param campaign Campaign object
   * @param opts Optional mapping options: provide index to set the `_id` field (1-based)
   */
  mapCampaignToOffer(campaign: Campaign, opts?: { index?: number }): Offer {
    const idx = typeof opts?.index === 'number' ? opts.index : 0;

    const normalizedStatus = (s: any): OfferStatus => {
      // Prefer the OfferStatusPipe for consistent transformation if available
      const transformed = getOfferStatus(s);
      if (transformed) return transformed;
      const val = (s ?? '').toString().trim().toUpperCase();
      if (val === OfferStatus.ACTIVE) return OfferStatus.ACTIVE;
      if (val === OfferStatus.EXPIRED) return OfferStatus.EXPIRED;
      return OfferStatus.INACTIVE;
    };

    return {
      _id: idx || 0,
      id: String(campaign.id ?? ''),
      title: campaign.title ?? '',
      description: campaign.description ?? '',
      discount: Number(campaign.discount ?? 0),
      validUntil: campaign.endDate ? new Date(campaign.endDate) : new Date(),
      status: normalizedStatus(campaign.status),
      categoryId: campaign.categoryId ?? '',
      categoryName: campaign.categoryName ?? undefined,
      createdAt: campaign.startDate ? new Date(campaign.startDate) : new Date(),
      terms: campaign.terms ?? ''
    } as Offer;
  }

  /**
   * Convert a CampaignCreateRequest into a backend DTO.
   * @param offer Offer object
   * @param businessId Business ID to associate the campaign with.
   */
  mapToCampaignCreateRequest(offer: Partial<Offer>, businessId: string): CampaignCreateRequest {
    return {
      title: offer.title,
      description: offer.description,
      startDate: formatDate(new Date()),
      endDate:  formatDate(offer.validUntil as Date),
      discount: offer.discount,
      businessId: businessId,
      categoryId: offer.categoryId,
      terms: offer.terms,
      status: offer.status,
      active: true
    } as CampaignCreateRequest;
  }
}
