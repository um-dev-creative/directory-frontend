export interface LandingBanner {
  id: string;
  imageDesktop: string;
  imageTablet: string;
  imageMobile: string;
  altText: string;
  route: string;
}

export interface LandingBanners {
  top: LandingBanner;
  mid: LandingBanner;
}

export interface LandingSlide {
  id: string;
  imageDesktop: string;
  imageTablet: string;
  imageMobile: string;
  altText: string;
  route: string;
}

export interface LandingCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  internalLink: string;
}

export interface LandingPartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
  internalLink: string;
}

export interface LandingFeaturedProduct {
  id: string;
  name: string;
  imageUrl: string;
  altText: string;
  regularPrice: number;
  discountedPrice: number;
  currency: string;
  isOnline: boolean;
  isInStore: boolean;
  businessName: string;
}

export interface LandingOffer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  brandLogoUrl: string;
  internalLink: string;
  businessName: string;
}

export interface LandingResponse {
  banners: LandingBanners;
  slides: LandingSlide[];
  cards: LandingCard[];
  partnerLogos: LandingPartnerLogo[];
  featuredProducts: LandingFeaturedProduct[];
  offers: LandingOffer[];
}
