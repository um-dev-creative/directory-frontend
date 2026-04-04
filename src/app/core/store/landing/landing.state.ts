import {
  LandingBanners,
  LandingCard,
  LandingFeaturedProduct,
  LandingOffer,
  LandingPartnerLogo,
  LandingSlide
} from '@shared/models/landing.model';

export interface LandingState {
  banners: LandingBanners | null;
  slides: LandingSlide[];
  cards: LandingCard[];
  partnerLogos: LandingPartnerLogo[];
  featuredProducts: LandingFeaturedProduct[];
  offers: LandingOffer[];
  isLoading: boolean;
  error: string | null;
}

export const initialLandingState: LandingState = {
  banners: null,
  slides: [],
  cards: [],
  partnerLogos: [],
  featuredProducts: [],
  offers: [],
  isLoading: false,
  error: null
};
