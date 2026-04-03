import { createReducer, on } from '@ngrx/store';
import { loadLanding, loadLandingFailure, loadLandingSuccess } from './landing.actions';
import { initialLandingState } from './landing.state';

const _landingReducer = createReducer(
  initialLandingState,
  on(loadLanding, (state) => ({ ...state, isLoading: true, error: null })),
  on(loadLandingSuccess, (state, { data }) => ({
    ...state,
    banners: data.banners,
    slides: data.slides,
    cards: data.cards,
    partnerLogos: data.partnerLogos,
    featuredProducts: data.featuredProducts,
    offers: data.offers,
    isLoading: false,
    error: null
  })),
  on(loadLandingFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);

export function landingReducer(state: any, action: any) {
  return _landingReducer(state, action);
}
