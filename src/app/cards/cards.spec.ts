import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Cards } from './cards';
import { CardsService, CardImage as Image } from './services/cards.service';

describe('CardsComponent', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;
  let cardsService: jasmine.SpyObj<CardsService>;

  const mockCards: Image[] = [
    {
      id: 'test1',
      src: 'https://example.com/image1.jpg',
      alt: 'Test Image 1',
      title: 'Test Card 1',
      description: 'Test Description 1'
    },
    {
      id: 'test2',
      src: 'https://example.com/image2.jpg',
      alt: 'Test Image 2',
      title: 'Test Card 2',
      description: 'Test Description 2'
    }
  ];

  beforeEach(async () => {
    const cardsServiceSpy = jasmine.createSpyObj('CardsService', ['getCards']);

    await TestBed.configureTestingModule({
      imports: [Cards, HttpClientTestingModule],
      providers: [
        { provide: CardsService, useValue: cardsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    cardsService = TestBed.inject(CardsService) as jasmine.SpyObj<CardsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cards on init', () => {
    cardsService.getCards.and.returnValue(of(mockCards));

    component.ngOnInit();

    expect(cardsService.getCards).toHaveBeenCalled();
    expect(component.cardsData$.value).toEqual(mockCards);
    expect(component.loading$.value).toBeFalse();
  });

  it('should show loading state initially', () => {
    component.loading$.next(true);
    component.error$.next(null);

    expect(component.loading$.value).toBeTrue();
  });

  it('should handle error state', () => {
    cardsService.getCards.and.returnValue(throwError(() => new Error()));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error$.value).toContain('Unable to load campaigns');
    expect(component.loading$.value).toBeFalse();
  });

  it('should emit cardClick event when card is clicked', () => {
    spyOn(component.cardClick, 'emit');
    cardsService.getCards.and.returnValue(of(mockCards));

    component.cardsData$.next(mockCards);
    fixture.detectChanges();

    component.onCardClick(mockCards[0], 0);

    expect(component.cardClick.emit).toHaveBeenCalledWith({
      card: mockCards[0],
      index: 0
    });
  });

  it('should handle keyboard navigation', () => {
    cardsService.getCards.and.returnValue(of(mockCards));
    component.cardsData$.next(mockCards);

    const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    spyOn(keyboardEvent, 'preventDefault');

    component.onKeyDown(keyboardEvent);

    expect(keyboardEvent.preventDefault).toHaveBeenCalled();
  });

  it('should show empty state when no cards', () => {
    cardsService.getCards.and.returnValue(of([]));

    component.cardsData$.next([]);
    component.loading$.next(false);
    component.error$.next(null);
    fixture.detectChanges();

    const emptyStateElement = fixture.debugElement.query(By.css('.text-center'));
    expect(emptyStateElement.nativeElement.textContent).toContain('No campaigns available');
  });

  it('should retry loading on retry button click', () => {
    cardsService.getCards.and.returnValue(throwError(() => new Error('Test error')));

    component.ngOnInit();
    fixture.detectChanges();

    cardsService.getCards.calls.reset();
    cardsService.getCards.and.returnValue(of(mockCards));

    const retryButton = fixture.debugElement.query(By.css('button'));
    retryButton.nativeElement.click();

    expect(cardsService.getCards).toHaveBeenCalledTimes(1);
  });
});
