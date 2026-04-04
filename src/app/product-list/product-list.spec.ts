import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { provideLocationMocks } from '@angular/common/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { LandingFeaturedProduct } from '@shared/models/landing.model';

class MockLandingStoreService {
  featuredProducts$ = new BehaviorSubject<LandingFeaturedProduct[]>([]);
  banners$ = new BehaviorSubject<any>(null);
  slides$ = new BehaviorSubject<any[]>([]);
  cards$ = new BehaviorSubject<any[]>([]);
  partnerLogos$ = new BehaviorSubject<any[]>([]);
  offers$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  isReady$ = new BehaviorSubject<boolean>(false);
  loadLanding = jasmine.createSpy('loadLanding');
}

const mockProducts: LandingFeaturedProduct[] = [
  {
    id: 'prod-1',
    name: 'Product One',
    imageUrl: 'http://example.com/prod1.jpg',
    altText: 'Alt Product One',
    regularPrice: 100,
    discountedPrice: 80,
    currency: 'USD',
    isOnline: true,
    isInStore: false,
    businessName: 'Store A'
  },
  {
    id: 'prod-2',
    name: 'Product Two',
    imageUrl: 'http://example.com/prod2.jpg',
    altText: 'Alt Product Two',
    regularPrice: 200,
    discountedPrice: 150,
    currency: 'USD',
    isOnline: false,
    isInStore: true,
    businessName: 'Store B'
  }
];

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let landingStore: MockLandingStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductList,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideLocationMocks(),
        { provide: LandingStoreService, useClass: MockLandingStoreService }
      ]
    })
    .compileComponents();

    landingStore = TestBed.inject(LandingStoreService) as any;
    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty products array', () => {
    expect(component.products).toBeDefined();
    expect(Array.isArray(component.products)).toBeTrue();
    expect(component.products.length).toBe(0);
  });

  it('should populate products from featuredProducts$', () => {
    landingStore.featuredProducts$.next(mockProducts);

    expect(component.products.length).toBe(2);
    expect(component.products[0].id).toBe('prod-1');
    expect(component.products[0].name).toBe('Product One');
    expect(component.products[1].id).toBe('prod-2');
    expect(component.products[1].name).toBe('Product Two');
  });

  it('should map imageUrl to image', () => {
    landingStore.featuredProducts$.next(mockProducts);

    expect(component.products[0].image).toBe('http://example.com/prod1.jpg');
    expect(component.products[1].image).toBe('http://example.com/prod2.jpg');
  });

  it('should map altText to alt', () => {
    landingStore.featuredProducts$.next(mockProducts);

    expect(component.products[0].alt).toBe('Alt Product One');
    expect(component.products[1].alt).toBe('Alt Product Two');
  });
});
