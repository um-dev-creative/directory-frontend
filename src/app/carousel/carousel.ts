import {Component, OnInit, OnDestroy, Input, inject, PLATFORM_ID} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Slide, CAROUSEL_SLIDES } from '../../assets/mocks/carousel-slides.mock';

@Component({
  selector: 'app-carousel',
  imports: [
    CommonModule,
  ],
  templateUrl: './carousel.html',
})
export class Carousel implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  // Inputs configurables
  @Input() index: number = 0;
  currentSlide = 0;
  isAutoPlaying = true;
  private autoplayInterval?: any;

  slides: Slide[] = CAROUSEL_SLIDES;

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

  onSlideClick(): void {
    const currentSlideObj = this.slides[this.currentSlide];
    if (currentSlideObj && currentSlideObj.link) {
      if (currentSlideObj.link.startsWith('http')) {
        if (isPlatformBrowser(this.platformId)) {
          window.open(currentSlideObj.link, '_blank', 'noopener,noreferrer');
        }
      } else {
        this.router.navigateByUrl(currentSlideObj.link);
      }
    }
  }
}
