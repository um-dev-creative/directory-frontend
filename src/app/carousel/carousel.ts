import {Component, OnInit, OnDestroy, Input, inject, signal, PLATFORM_ID} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoggerService } from '@app/core/services/logger.service';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { SkeletonComponent } from '@app/components/ui';
import {environment} from '@env/environment';

interface Slide {
  id: string;
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
  link: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './carousel.html',
})
export class Carousel implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);
  private readonly imageBucketUrl = environment.appImgBaseHref || ''; // Ensure apiUrl is set correctly

  private readonly landingStore = inject(LandingStoreService);
  private readonly destroy$ = new Subject<void>();

  // Inputs configurables
  @Input() index: number = 0;
  protected  currentSlide = 0;
  protected  isAutoPlaying = true;
  private autoplayInterval?: any;

  protected slides: Slide[] = [];
  readonly imageErrors = signal<Set<string>>(new Set());
  protected readonly loading$ = this.landingStore.isLoading$;

  ngOnInit() {
    this.landingStore.slides$.pipe(takeUntil(this.destroy$)).subscribe(slides => {
      this.slides = slides.map(s => ({
        id: s.id,
        desktop: `${this.imageBucketUrl}${s.imageDesktop}`,
        tablet: `${this.imageBucketUrl}${s.imageTablet}`,
        mobile: `${this.imageBucketUrl}${s.imageMobile}`,
        alt: s.altText,
        link: s.route
      }));
      if (this.slides.length > 0 && !this.autoplayInterval) {
        this.startAutoplay();
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoplay();
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextSlide(): void {
    if (this.slides.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    if (this.slides.length === 0) return;
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

  onImageError(slideId: string): void {
    this.imageErrors.update(s => new Set(s).add(slideId));
  }

  onSlideClick(): void {
    const currentSlideObj = this.slides[this.currentSlide];
    if (currentSlideObj && currentSlideObj.link) {
      if (currentSlideObj.link.startsWith('http')) {
        if (isPlatformBrowser(this.platformId)) {
          window.open(currentSlideObj.link, '_blank', 'noopener,noreferrer');
        }
      } else {
        this.logger.warn(`Navigating to internal link: ${currentSlideObj.link}`);
        this.router.navigateByUrl(currentSlideObj.link);
      }
    }
  }
}
