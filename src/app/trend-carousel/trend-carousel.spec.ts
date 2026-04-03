import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrendCarousel } from './trend-carousel';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { BehaviorSubject, of } from 'rxjs';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { LandingOffer } from '@shared/models/landing.model';
import { LoggerService } from '@app/core/services/logger.service';

class MockLandingStoreService {
  offers$ = new BehaviorSubject<LandingOffer[]>([]);
  banners$ = new BehaviorSubject<any>(null);
  slides$ = new BehaviorSubject<any[]>([]);
  cards$ = new BehaviorSubject<any[]>([]);
  partnerLogos$ = new BehaviorSubject<any[]>([]);
  featuredProducts$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  isReady$ = new BehaviorSubject<boolean>(false);
  loadLanding = jasmine.createSpy('loadLanding');
}

const mockOffers: LandingOffer[] = [
  {
    id: 'offer-1',
    name: 'Offer One',
    description: 'Desc one',
    imageUrl: 'http://example.com/offer1.jpg',
    brandLogoUrl: 'http://example.com/brand1.png',
    internalLink: '/offer/one',
    businessName: 'Biz A'
  },
  {
    id: 'offer-2',
    name: 'Offer Two',
    description: 'Desc two',
    imageUrl: 'http://example.com/offer2.jpg',
    brandLogoUrl: 'http://example.com/brand2.png',
    internalLink: '/offer/two',
    businessName: 'Biz B'
  }
];

describe('TrendCarousel', () => {
  let component: TrendCarousel;
  let fixture: ComponentFixture<TrendCarousel>;
  let landingStore: MockLandingStoreService;
  let router: Router;
  const mockLogger = { info: jasmine.createSpy('info'), debug: jasmine.createSpy('debug'), warn: jasmine.createSpy('warn'), error: jasmine.createSpy('error') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendCarousel],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideLocationMocks(),
        { provide: LandingStoreService, useClass: MockLandingStoreService },
        { provide: LoggerService, useValue: mockLogger }
      ]
    })
    .compileComponents();

    landingStore = TestBed.inject(LandingStoreService) as any;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TrendCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty trends array', () => {
    expect(component.trends).toBeDefined();
    expect(Array.isArray(component.trends)).toBeTrue();
    expect(component.trends.length).toBe(0);
  });

  it('should populate trends from offers$', () => {
    landingStore.offers$.next(mockOffers);

    expect(component.trends.length).toBe(2);
    expect(component.trends[0].title).toBe('Offer One');
    expect(component.trends[1].title).toBe('Offer Two');
  });

  it('should map imageUrl to image', () => {
    landingStore.offers$.next(mockOffers);

    expect(component.trends[0].image).toBe('http://example.com/offer1.jpg');
    expect(component.trends[1].image).toBe('http://example.com/offer2.jpg');
  });

  it('should map brandLogoUrl to brandLogo', () => {
    landingStore.offers$.next(mockOffers);

    expect(component.trends[0].brandLogo).toBe('http://example.com/brand1.png');
    expect(component.trends[1].brandLogo).toBe('http://example.com/brand2.png');
  });

  it('should map name to title', () => {
    landingStore.offers$.next(mockOffers);

    expect(component.trends[0].title).toBe('Offer One');
    expect(component.trends[1].title).toBe('Offer Two');
  });

  it('should navigate to internalLink on card click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const trend = { title: 'Test', description: 'Desc', image: 'img.png', brandLogo: 'logo.png', internalLink: '/offer/one' };

    component.onCardClick(trend);

    expect(navigateSpy).toHaveBeenCalledWith(['/offer/one']);
  });

  it('should log warning when card click has no internalLink', () => {
    mockLogger.warn.calls.reset();
    const trend = { title: 'Test', description: 'Desc', image: 'img.png', brandLogo: 'logo.png', internalLink: '' };

    component.onCardClick(trend);

    expect(mockLogger.warn).toHaveBeenCalledWith('No internal link provided for trend:', 'Test');
  });

  it('should stop scroll on stopScroll call', () => {
    expect(() => component.stopScroll()).not.toThrow();
  });
});
