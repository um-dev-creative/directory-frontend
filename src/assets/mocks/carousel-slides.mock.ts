export interface Slide {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
  link?: string;
}

export const CAROUSEL_SLIDES: Slide[] = [
  {
    desktop: "https://storage.spccard.ca/HomepageBanner_W_TimHortons_01062025_EN.webp",
    tablet: "https://storage.spccard.ca/HomepageBanner_T_TimHortons_01062025_EN.webp",
    mobile: "https://storage.spccard.ca/HomepageBanner_M_TimHortons_01062025_EN.webp",
    alt: "Save 20% after 2pm at Tim Hortons",
    link: "/auth/login"
  },
  {
    desktop: "https://storage.spccard.ca/W_WebBanner_FrostWeek_12202024_EN.png",
    tablet: "https://storage.spccard.ca/T_WebBanner_FrostWeek_12202024_EN.png",
    mobile: "https://storage.spccard.ca/M_WebBanner_FrostWeek_12202024_EN.png",
    alt: "Winter Campus Tour",
    link: "/deals"
  },
  {
    desktop: "https://storage.spccard.ca/HomepageBanner_W_StudentSnapshots_Generic_EN.png",
    tablet: "https://storage.spccard.ca/HomepageBanner_T_StudentSnapshots_Generic_EN.png",
    mobile: "https://storage.spccard.ca/HomepageBanner_M_StudentSnapshots_Generic_EN.png",
    alt: "Capture your SPC moment",
    link: "https://www.instagram.com/latinhub.info/"
  }
];
