import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Button, SkeletonComponent } from '@app/components/ui';
import { LoggerService } from '@app/core/services/logger.service';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';

interface Trend {
  title: string;
  description: string;
  image: string;
  altText: string;
  brandLogo: string;
  brandLogoAlt: string;
  internalLink: string;
}

@Component({
  selector: 'app-trend-carousel',
  standalone: true,
  imports: [CommonModule, Button, SkeletonComponent],
  templateUrl: './trend-carousel.html',
  styleUrl: './trend-carousel.css'
})
export class TrendCarousel implements OnInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  trends: Trend[] = [];
  readonly loading$ = inject(LandingStoreService).isLoading$;

  private scrollInterval: any;
  private readonly scrollSpeed = 200;
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);
  private readonly landingStore = inject(LandingStoreService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.landingStore.offers$.pipe(takeUntil(this.destroy$)).subscribe(offers => {
      this.trends = offers.map(o => ({
        title: o.name,
        description: o.description,
        image: o.imageUrl,
        altText: o.altText,
        brandLogo: o.brandLogoUrl,
        brandLogoAlt: o.altTextLogo ?? o.name,
        internalLink: o.internalLink
      }));
    });
  }

  ngOnDestroy(): void {
    this.stopScroll();
    this.destroy$.next();
    this.destroy$.complete();
  }

  startScroll(direction: 'left' | 'right'): void {
    this.stopScroll();
    this.scrollInterval = setInterval(() => {
      const scrollAmount = direction === 'left' ? -this.scrollSpeed : this.scrollSpeed;
      this.carousel.nativeElement.scrollBy({ left: scrollAmount, behavior: 'auto' });
    }, 100);
  }

  stopScroll(): void {
    clearInterval(this.scrollInterval);
  }

  navigateToDeals(): void {
    this.router.navigate(['/deals']);
  }

  onCardClick(trend: Trend): void {
    if (trend.internalLink) {
      this.router.navigate([trend.internalLink]);
    } else {
      this.logger.warn('No internal link provided for trend:', trend.title);
    }
  }

  readonly fallbackImage = 'assets/images/placeholder.svg';

  onImageError(trend: Trend): void {
    trend.image = this.fallbackImage;
  }

  onBrandLogoError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder-logo.svg';
  }
}
