import { TestBed } from '@angular/core/testing';
import { CardsService, CardImage } from './cards.service';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { LandingCard } from '@shared/models/landing.model';
import { BehaviorSubject } from 'rxjs';

class MockLandingStoreService {
  cards$ = new BehaviorSubject<LandingCard[]>([]);
  banners$ = new BehaviorSubject<any>(null);
  slides$ = new BehaviorSubject<any[]>([]);
  partnerLogos$ = new BehaviorSubject<any[]>([]);
  featuredProducts$ = new BehaviorSubject<any[]>([]);
  offers$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  isReady$ = new BehaviorSubject<boolean>(false);
  loadLanding = jasmine.createSpy('loadLanding');
}

const mockCards: LandingCard[] = [
  {
    id: 'card-1',
    name: 'Card One',
    description: 'Description one',
    altText: 'Card One',
    imageUrl: 'http://example.com/card1.jpg',
    internalLink: '/category/one'
  },
  {
    id: 'card-2',
    name: 'Card Two',
    description: 'Description two',
    altText: 'Card Two',
    imageUrl: 'http://example.com/card2.jpg',
    internalLink: '/category/two'
  }
];

describe('CardsService', () => {
  let service: CardsService;
  let landingStore: MockLandingStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CardsService,
        { provide: LandingStoreService, useClass: MockLandingStoreService }
      ]
    });

    service = TestBed.inject(CardsService);
    landingStore = TestBed.inject(LandingStoreService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map LandingCard[] to CardImage[] correctly', (done: DoneFn) => {
    landingStore.cards$.next(mockCards);

    service.getCards().subscribe((cards: CardImage[]) => {
      expect(cards.length).toBe(2);

      expect(cards[0].id).toBe('card-1');
      expect(cards[0].src).toBe('http://example.com/card1.jpg');
      expect(cards[0].alt).toBe('Card One');
      expect(cards[0].title).toBe('Card One');
      expect(cards[0].description).toBe('Description one');
      expect(cards[0].link).toBe('/category/one');

      expect(cards[1].id).toBe('card-2');
      expect(cards[1].src).toBe('http://example.com/card2.jpg');
      expect(cards[1].alt).toBe('Card Two');
      expect(cards[1].title).toBe('Card Two');
      expect(cards[1].link).toBe('/category/two');

      done();
    });
  });

  it('should map imageUrl to src', (done: DoneFn) => {
    landingStore.cards$.next([mockCards[0]]);

    service.getCards().subscribe((cards: CardImage[]) => {
      expect(cards[0].src).toBe(mockCards[0].imageUrl);
      done();
    });
  });

  it('should map name to alt and title', (done: DoneFn) => {
    landingStore.cards$.next([mockCards[0]]);

    service.getCards().subscribe((cards: CardImage[]) => {
      expect(cards[0].alt).toBe(mockCards[0].name);
      expect(cards[0].title).toBe(mockCards[0].name);
      done();
    });
  });

  it('should map internalLink to link', (done: DoneFn) => {
    landingStore.cards$.next([mockCards[0]]);

    service.getCards().subscribe((cards: CardImage[]) => {
      expect(cards[0].link).toBe(mockCards[0].internalLink);
      done();
    });
  });

  it('should emit empty array when store cards$ is empty', (done: DoneFn) => {
    landingStore.cards$.next([]);

    service.getCards().subscribe((cards: CardImage[]) => {
      expect(cards).toEqual([]);
      done();
    });
  });

  it('should have a no-op clearCache method', () => {
    expect(() => service.clearCache()).not.toThrow();
  });
});
