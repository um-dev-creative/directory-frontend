import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LandingBanners } from '@shared/models/landing.model';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';

export interface Category {
  name: string;
  image: string;
}

export interface BannerImage {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
  route?: string;
}

export interface BannerData {
  title: string;
  categories: Category[];
  banners: {
    top?: BannerImage;
    mid?: BannerImage;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private readonly landingStore = inject(LandingStoreService);

  getBannerData(): Observable<BannerData> {
    return this.landingStore.banners$.pipe(
      filter((banners): banners is LandingBanners => banners !== null),
      map(banners => ({
        title: '',
        categories: [], // TODO: add categories to LandingResponse when backend ready
        banners: {
          top: banners.top ? {
            desktop: banners.top.imageDesktop,
            tablet: banners.top.imageTablet,
            mobile: banners.top.imageMobile,
            alt: banners.top.altText,
            route: banners.top.route
          } : undefined,
          mid: banners.mid ? {
            desktop: banners.mid.imageDesktop,
            tablet: banners.mid.imageTablet,
            mobile: banners.mid.imageMobile,
            alt: banners.mid.altText,
            route: banners.mid.route
          } : undefined
        }
      }))
    );
  }

  // No-op: caching is handled by the NgRx store
  clearCache(): void {}
}
