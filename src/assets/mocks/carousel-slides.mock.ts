import {environment} from '@env/environment';

export interface Slide {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
  link?: string;
}

const imageBucketUrl = environment.appImgBaseHref || ''; // Ensure apiUrl is set correctly

export const CAROUSEL_SLIDES: Slide[] = [
  {
    desktop: `${imageBucketUrl}HomepageBanner_W_slide1.webp`,
    tablet: `${imageBucketUrl}HomepageBanner_T_slide1.webp`,
    mobile: `${imageBucketUrl}HomepageBanner_M_slide1.webp`,
    alt: "Big annual super sale",
    link: "/auth/login"
  },
  {
    desktop: `${imageBucketUrl}HomepageBanner_W_slide2.webp`,
    tablet: `${imageBucketUrl}HomepageBanner_T_slide2.webp`,
    mobile: `${imageBucketUrl}HomepageBanner_M_slide2.webp`,
    alt: "Feliz Regreso a Clases",
    link: "/deals"
  },
  {
    desktop: `${imageBucketUrl}HomepageBanner_W_slide3.webp`,
    tablet: `${imageBucketUrl}HomepageBanner_T_slide3.webp`,
    mobile: `${imageBucketUrl}HomepageBanner_M_slide3.webp`,
    alt: "Ofertas especiales de Verano",
    link: "https://www.instagram.com/latinhub.info/"
  }
];
