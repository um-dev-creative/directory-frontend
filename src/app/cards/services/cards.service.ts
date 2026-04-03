import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';

export interface CardImage {
  src: string;
  alt: string;
  id?: string;
  title?: string;
  description?: string;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private readonly landingStore = inject(LandingStoreService);

  getCards(): Observable<CardImage[]> {
    return this.landingStore.cards$.pipe(
      map(cards => cards.map(card => ({
        id: card.id,
        src: card.imageUrl,
        alt: card.name,
        title: card.name,
        description: card.description,
        link: card.internalLink
      })))
    );
  }

  // No-op: caching is handled by the NgRx store
  clearCache(): void {}
}
