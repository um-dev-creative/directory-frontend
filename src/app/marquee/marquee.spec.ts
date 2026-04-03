import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Marquee } from './marquee';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { provideLocationMocks } from '@angular/common/testing';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { LandingPartnerLogo } from '@shared/models/landing.model';

class MockLandingStoreService {
  partnerLogos$ = new BehaviorSubject<LandingPartnerLogo[]>([]);
  banners$ = new BehaviorSubject<any>(null);
  slides$ = new BehaviorSubject<any[]>([]);
  cards$ = new BehaviorSubject<any[]>([]);
  featuredProducts$ = new BehaviorSubject<any[]>([]);
  offers$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  isReady$ = new BehaviorSubject<boolean>(false);
  loadLanding = jasmine.createSpy('loadLanding');
}

const mockLogos: LandingPartnerLogo[] = [
  { id: 'logo-1', name: 'Partner One', logoUrl: 'http://example.com/logo1.png', internalLink: '/partner/one' },
  { id: 'logo-2', name: 'Partner Two', logoUrl: 'http://example.com/logo2.png', internalLink: '/partner/two' }
];

describe('Marquee', () => {
  let component: Marquee;
  let fixture: ComponentFixture<Marquee>;
  let landingStore: MockLandingStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marquee],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideLocationMocks(),
        { provide: LandingStoreService, useClass: MockLandingStoreService }
      ]
    })
    .compileComponents();

    landingStore = TestBed.inject(LandingStoreService) as any;
    fixture = TestBed.createComponent(Marquee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty images array', () => {
    expect(component.images).toBeDefined();
    expect(component.images.length).toBe(0);
  });

  it('should populate images from partnerLogos$', () => {
    landingStore.partnerLogos$.next(mockLogos);

    expect(component.images.length).toBe(2);
    expect(component.images[0].id).toBe('logo-1');
    expect(component.images[1].id).toBe('logo-2');
  });

  it('should map logoUrl to src', () => {
    landingStore.partnerLogos$.next(mockLogos);

    expect(component.images[0].src).toBe('http://example.com/logo1.png');
    expect(component.images[1].src).toBe('http://example.com/logo2.png');
  });

  it('should map name to alt', () => {
    landingStore.partnerLogos$.next(mockLogos);

    expect(component.images[0].alt).toBe('Partner One');
    expect(component.images[1].alt).toBe('Partner Two');
  });

  it('should map internalLink to link', () => {
    landingStore.partnerLogos$.next(mockLogos);

    expect(component.images[0].link).toBe('/partner/one');
    expect(component.images[1].link).toBe('/partner/two');
  });
});
