import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Carousel } from './carousel';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { LandingSlide } from '@shared/models/landing.model';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LoggerService } from '@app/core/services/logger.service';

class MockLandingStoreService {
  slides$ = new BehaviorSubject<LandingSlide[]>([
    { id: 's1', imageDesktop: 'd1.jpg', imageTablet: 't1.jpg', imageMobile: 'm1.jpg', altText: 'Slide 1', route: '/promo1' },
    { id: 's2', imageDesktop: 'd2.jpg', imageTablet: 't2.jpg', imageMobile: 'm2.jpg', altText: 'Slide 2', route: '/promo2' },
    { id: 's3', imageDesktop: 'd3.jpg', imageTablet: 't3.jpg', imageMobile: 'm3.jpg', altText: 'Slide 3', route: '/promo3' }
  ]);
  banners$ = new BehaviorSubject<any>(null);
  cards$ = new BehaviorSubject<any[]>([]);
  partnerLogos$ = new BehaviorSubject<any[]>([]);
  featuredProducts$ = new BehaviorSubject<any[]>([]);
  offers$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  isReady$ = new BehaviorSubject<boolean>(false);
  loadLanding = jasmine.createSpy('loadLanding');
}

describe('CarouselComponent', () => {
  let component: Carousel;
  let fixture: ComponentFixture<Carousel>;
  const mockLogger = { info: jasmine.createSpy('info'), debug: jasmine.createSpy('debug'), warn: jasmine.createSpy('warn'), error: jasmine.createSpy('error') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carousel],
      providers: [
        { provide: LandingStoreService, useClass: MockLandingStoreService },
        { provide: ActivatedRoute, useValue: { params: new BehaviorSubject({}), snapshot: { paramMap: convertToParamMap({}) } } },
        { provide: LoggerService, useValue: mockLogger }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with first slide', () => {
    expect((component as any).currentSlide).toBe(0);
  });

  it('should have slides loaded', () => {
    expect((component as any).slides.length).toBeGreaterThan(0);
  });

  it('should advance to next slide', () => {
    component.nextSlide();
    expect((component as any).currentSlide).toBe(1);
  });

  it('should wrap to first slide when going past last', () => {
    (component as any).currentSlide = (component as any).slides.length - 1;
    component.nextSlide();
    expect((component as any).currentSlide).toBe(0);
  });

  it('should go to previous slide', () => {
    (component as any).currentSlide = 1;
    component.prevSlide();
    expect((component as any).currentSlide).toBe(0);
  });

  it('should wrap to last slide when going before first', () => {
    (component as any).currentSlide = 0;
    component.prevSlide();
    expect((component as any).currentSlide).toBe((component as any).slides.length - 1);
  });

  it('should go to a specific slide', () => {
    component.goToSlide(1);
    expect((component as any).currentSlide).toBe(1);
  });

  it('should pause autoplay', () => {
    component.pauseAutoplay();
    expect((component as any).isAutoPlaying).toBeFalse();
  });

  it('should resume autoplay', () => {
    component.pauseAutoplay();
    component.resumeAutoplay();
    expect((component as any).isAutoPlaying).toBeTrue();
  });
});
