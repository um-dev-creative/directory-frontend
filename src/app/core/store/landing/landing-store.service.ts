import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadLanding } from './landing.actions';
import {
  selectBanners,
  selectCards,
  selectFeaturedProducts,
  selectIsLandingReady,
  selectLandingError,
  selectLandingIsLoading,
  selectOffers,
  selectPartnerLogos,
  selectSlides
} from './landing.selectors';

@Injectable({ providedIn: 'root' })
export class LandingStoreService {
  private readonly store = inject(Store);

  readonly banners$ = this.store.select(selectBanners);
  readonly slides$ = this.store.select(selectSlides);
  readonly cards$ = this.store.select(selectCards);
  readonly partnerLogos$ = this.store.select(selectPartnerLogos);
  readonly featuredProducts$ = this.store.select(selectFeaturedProducts);
  readonly offers$ = this.store.select(selectOffers);
  readonly isLoading$ = this.store.select(selectLandingIsLoading);
  readonly error$ = this.store.select(selectLandingError);
  readonly isReady$ = this.store.select(selectIsLandingReady);

  loadLanding(): void {
    this.store.dispatch(loadLanding());
  }
}
