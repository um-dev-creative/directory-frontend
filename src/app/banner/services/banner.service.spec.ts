import { TestBed } from '@angular/core/testing';
import { BannerService, BannerData } from './banner.service';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { LandingBanners } from '@shared/models/landing.model';
import { BehaviorSubject } from 'rxjs';

class MockLandingStoreService {
  banners$ = new BehaviorSubject<LandingBanners | null>(null);
  slides$ = new BehaviorSubject<any[]>([]);
  cards$ = new BehaviorSubject<any[]>([]);
  partnerLogos$ = new BehaviorSubject<any[]>([]);
  featuredProducts$ = new BehaviorSubject<any[]>([]);
  offers$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  isReady$ = new BehaviorSubject<boolean>(false);
  loadLanding = jasmine.createSpy('loadLanding');
}

const mockBanners: LandingBanners = {
  top: {
    id: 'top-1',
    imageDesktop: 'desktop-top.jpg',
    imageTablet: 'tablet-top.jpg',
    imageMobile: 'mobile-top.jpg',
    altText: 'Top Banner',
    route: '/promo-top'
  },
  mid: {
    id: 'mid-1',
    imageDesktop: 'desktop-mid.jpg',
    imageTablet: 'tablet-mid.jpg',
    imageMobile: 'mobile-mid.jpg',
    altText: 'Mid Banner',
    route: '/promo-mid'
  }
};

describe('BannerService', () => {
  let service: BannerService;
  let landingStore: MockLandingStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BannerService,
        { provide: LandingStoreService, useClass: MockLandingStoreService }
      ]
    });

    service = TestBed.inject(BannerService);
    landingStore = TestBed.inject(LandingStoreService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit BannerData when banners$ emits a non-null value', (done: DoneFn) => {
    service.getBannerData().subscribe((data: BannerData) => {
      expect(data).toBeTruthy();
      expect(data.title).toBe('');
      expect(data.categories).toEqual([]);
      done();
    });

    landingStore.banners$.next(mockBanners);
  });

  it('should NOT emit when banners$ emits null', () => {
    let emitted = false;
    service.getBannerData().subscribe(() => {
      emitted = true;
    });

    landingStore.banners$.next(null);
    expect(emitted).toBeFalse();
  });

  it('should map top banner correctly from LandingBanners to BannerData', (done: DoneFn) => {
    service.getBannerData().subscribe((data: BannerData) => {
      expect(data.banners.top).toBeDefined();
      expect(data.banners.top!.desktop).toBe('desktop-top.jpg');
      expect(data.banners.top!.tablet).toBe('tablet-top.jpg');
      expect(data.banners.top!.mobile).toBe('mobile-top.jpg');
      expect(data.banners.top!.alt).toBe('Top Banner');
      expect(data.banners.top!.route).toBe('/promo-top');
      done();
    });

    landingStore.banners$.next(mockBanners);
  });

  it('should map mid banner correctly from LandingBanners to BannerData', (done: DoneFn) => {
    service.getBannerData().subscribe((data: BannerData) => {
      expect(data.banners.mid).toBeDefined();
      expect(data.banners.mid!.desktop).toBe('desktop-mid.jpg');
      expect(data.banners.mid!.tablet).toBe('tablet-mid.jpg');
      expect(data.banners.mid!.mobile).toBe('mobile-mid.jpg');
      expect(data.banners.mid!.alt).toBe('Mid Banner');
      expect(data.banners.mid!.route).toBe('/promo-mid');
      done();
    });

    landingStore.banners$.next(mockBanners);
  });

  it('should have a no-op clearCache method', () => {
    expect(() => service.clearCache()).not.toThrow();
  });
});
