export interface Slide {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
  link?: string;
}

export const CAROUSEL_SLIDES: Slide[] = [
  {
    desktop: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_W_slide1.webp",
    tablet: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_T_slide1.webp",
    mobile: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_M_slide1.webp",
    alt: "Big annual super sale",
    link: "/auth/login"
  },
  {
    desktop: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_W_slide2.webp",
    tablet: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_T_slide2.webp",
    mobile: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_M_slide2.webp",
    alt: "Feliz Regreso a Clases",
    link: "/deals"
  },
  {
    desktop: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_W_slide3.webp",
    tablet: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_T_slide3.webp",
    mobile: "https://prx-qa.tst/latinhub/media/assets/HomepageBanner_M_slide3.webp",
    alt: "Ofertas especiales de Verano",
    link: "https://www.instagram.com/latinhub.info/"
  }
];
