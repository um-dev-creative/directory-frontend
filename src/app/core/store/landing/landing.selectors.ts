import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LandingState } from './landing.state';

export const selectLandingState = createFeatureSelector<LandingState>('landing');

export const selectBanners = createSelector(selectLandingState, (s) => s.banners);
export const selectSlides = createSelector(selectLandingState, (s) => s.slides);
export const selectCards = createSelector(selectLandingState, (s) => s.cards);
export const selectPartnerLogos = createSelector(selectLandingState, (s) => s.partnerLogos);
export const selectFeaturedProducts = createSelector(selectLandingState, (s) => s.featuredProducts);
export const selectOffers = createSelector(selectLandingState, (s) => s.offers);
export const selectLandingIsLoading = createSelector(selectLandingState, (s) => s.isLoading);
export const selectLandingError = createSelector(selectLandingState, (s) => s.error);

export const selectIsLandingReady = createSelector(
  selectLandingIsLoading,
  selectBanners,
  (isLoading, banners) => !isLoading && banners !== null
);
