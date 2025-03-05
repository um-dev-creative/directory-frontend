import {Component, OnInit, OnDestroy, Input, inject, PLATFORM_ID} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Slide {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
}

@Component({
  selector: 'app-carousel',
  imports: [
    CommonModule,
  ],
  templateUrl: './carousel.html',
})
export class Carousel implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  @Input() index: number = 0;
  currentSlide = 0;
  isAutoPlaying = true;
  private autoplayInterval?: any;

  slides: Slide[] = [
    {
      desktop: "https://storage.spccard.ca/HomepageBanner_W_TimHortons_01062025_EN.webp",
      tablet: "https://storage.spccard.ca/HomepageBanner_T_TimHortons_01062025_EN.webp",
      mobile: "https://storage.spccard.ca/HomepageBanner_M_TimHortons_01062025_EN.webp",
      alt: "Save 20% after 2pm at Tim Hortons"
    },
    {
      desktop: "https://storage.spccard.ca/W_WebBanner_FrostWeek_12202024_EN.png",
      tablet: "https://storage.spccard.ca/T_WebBanner_FrostWeek_12202024_EN.png",
      mobile: "https://storage.spccard.ca/M_WebBanner_FrostWeek_12202024_EN.png",
      alt: "Winter Campus Tour"
    },
    {
      desktop: "https://storage.spccard.ca/HomepageBanner_W_StudentSnapshots_Generic_EN.png",
      tablet: "https://storage.spccard.ca/HomepageBanner_T_StudentSnapshots_Generic_EN.png",
      mobile: "https://storage.spccard.ca/HomepageBanner_M_StudentSnapshots_Generic_EN.png",
      alt: "Capture your SPC moment"
    }
  ];

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  private startAutoplay(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isAutoPlaying) {
        this.autoplayInterval = setInterval(() => {
          this.nextSlide();
        }, 5000);
      }
    }
  }

  private stopAutoplay(): void {
    if (isPlatformBrowser(this.platformId) && this.autoplayInterval) {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
    }
  }

  pauseAutoplay(): void {
    this.isAutoPlaying = false;
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.isAutoPlaying = true;
    this.startAutoplay();
  }
}
