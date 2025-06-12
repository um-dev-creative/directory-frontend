import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardsService, CardImage } from './services/cards.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.html',
  styleUrls: ['./cards.css']
})
export class Cards implements OnInit, OnDestroy {
  @Output() cardClick = new EventEmitter<{card: CardImage, index: number}>();
  @Output() imageError = new EventEmitter<{card: CardImage, index: number}>();

  cardsData$ = new BehaviorSubject<CardImage[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  private destroy$ = new Subject<void>();
  private currentFocusIndex = -1;

  constructor(private readonly cardsService: CardsService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const cards = this.cardsData$.value;
    if (!cards.length) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigatePrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateNext();
        break;
      case 'Home':
        event.preventDefault();
        this.focusCard(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusCard(cards.length - 1);
        break;
    }
  }

  private navigatePrevious(): void {
    const cards = this.cardsData$.value;
    if (this.currentFocusIndex > 0) {
      this.focusCard(this.currentFocusIndex - 1);
    } else {
      this.focusCard(cards.length - 1); // Wrap to last card
    }
  }

  private navigateNext(): void {
    const cards = this.cardsData$.value;
    if (this.currentFocusIndex < cards.length - 1) {
      this.focusCard(this.currentFocusIndex + 1);
    } else {
      this.focusCard(0); // Wrap to first card
    }
  }

  private focusCard(index: number): void {
    this.currentFocusIndex = index;
    const cardElement = document.querySelector(`[data-card-index="${index}"]`) as HTMLElement;
    if (cardElement) {
      cardElement.focus();
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  loadCards(): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.cardsService.getCards()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cards) => {
          this.cardsData$.next(cards);
          this.loading$.next(false);
        },
        error: (error) => {
          this.error$.next(error.message || 'Unable to load campaigns. Please try again.');
          this.loading$.next(false);
          console.error('Cards loading error:', error);
        }
      });
  }

  onCardClick(card: CardImage, index: number): void {
    this.currentFocusIndex = index;
    this.cardClick.emit({ card, index });
  }

  onImageError(event: Event, card: CardImage, index: number): void {
    this.imageError.emit({ card, index });
    // Set fallback image
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://placehold.co/389x180/f3f4f6/6b7280/webp?text=Image+Not+Found';
    }
  }

  trackByCardSrc(index: number, card: CardImage): string {
    return card.src;
  }
}
