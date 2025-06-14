import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PartnerProfile, mockPartners } from '../../../../assets/mocks/partner-profiles.mock';

// Re-export PartnerProfile for external use
export type { PartnerProfile };

@Injectable({
  providedIn: 'root'
})
export class PartnerProfileService {
  private useMockData = true;

  constructor() {}

  getPartnerById(id: string): Observable<PartnerProfile | null> {
    if (this.useMockData) {
      const partner = mockPartners.find(p => p.id.toString() === id);
      console.log('🎯 Mock: Getting partner profile by ID:', partner);
      return of(partner || null).pipe(delay(800));
    }

    // In real implementation, this would be an HTTP request
    return of(null);
  }

  getPartnerBySlug(slug: string): Observable<PartnerProfile | null> {
    if (this.useMockData) {
      const partner = mockPartners.find(p => p.slug === slug);
      console.log('🎯 Mock: Getting partner profile by slug:', partner);
      return of(partner || null).pipe(delay(800));
    }

    // In real implementation, this would be an HTTP request
    return of(null);
  }

  getAllPartners(): Observable<PartnerProfile[]> {
    if (this.useMockData) {
      console.log('🎯 Mock: Getting all partner profiles');
      return of([...mockPartners]).pipe(delay(500));
    }

    return of([]);
  }

  toggleBookmark(partnerId: string | number): Observable<boolean> {
    if (this.useMockData) {
      const partner = mockPartners.find(p => p.id.toString() === partnerId.toString());
      if (partner) {
        partner.isBookmarked = !partner.isBookmarked;
        console.log('🎯 Mock: Toggled bookmark for partner:', partner.name, partner.isBookmarked);
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

      console.log('🎯 Mock: Getting similar partners');
      return of(similarPartners).pipe(delay(600));
    }

    return of([]);
  }
}
