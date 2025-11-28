import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PartnerProfile, mockPartners } from 'assets/mocks/partner-profiles.mock';
import { LoggerService } from '@core/services';

// Re-export PartnerProfile for external use
export type { PartnerProfile };

@Injectable({
  providedIn: 'root'
})
export class PartnerProfileService {
  private readonly useMockData = true;
  private readonly logger = inject(LoggerService);

  constructor() {}

  getPartnerById(id: string): Observable<PartnerProfile | null> {
    if (this.useMockData) {
      const partner = mockPartners.find(p => p.id.toString() === id);
      this.logger.debug('Mock: Getting partner profile by ID', partner);
      return of(partner || null).pipe(delay(800));
    }

    // In real implementation, this would be an HTTP request
    return of(null);
  }

  getPartnerBySlug(slug: string): Observable<PartnerProfile | null> {
    if (this.useMockData) {
      const partner = mockPartners.find(p => p.slug === slug);
      this.logger.debug('Mock: Getting partner profile by slug', partner);
      return of(partner || null).pipe(delay(800));
    }

    // In real implementation, this would be an HTTP request
    return of(null);
  }

  getAllPartners(): Observable<PartnerProfile[]> {
    if (this.useMockData) {
      this.logger.debug('Mock: Getting all partner profiles');
      return of([...mockPartners]).pipe(delay(500));
    }

    return of([]);
  }

  toggleBookmark(partnerId: string | number): Observable<boolean> {
    if (this.useMockData) {
      const partner = mockPartners.find(p => p.id.toString() === partnerId.toString());
      if (partner) {
        partner.isBookmarked = !partner.isBookmarked;
        this.logger.debug('Mock: Toggled bookmark for partner', {name: partner.name, isBookmarked: partner.isBookmarked});
        return of(partner.isBookmarked).pipe(delay(300));
      }
    }

    return of(false);
  }

  getSimilarPartners(partnerId: string | number, limit: number = 6): Observable<PartnerProfile[]> {
    if (this.useMockData) {
      const similarPartners = mockPartners
        .filter(p => p.id.toString() !== partnerId.toString())
        .slice(0, limit);

      this.logger.debug('Mock: Getting similar partners');
      return of(similarPartners).pipe(delay(600));
    }

    return of([]);
  }
}
