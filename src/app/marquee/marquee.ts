import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';

interface MarqueeImage {
  id: string;
  src: string;
  alt: string;
  link: string;
}

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee implements OnInit, OnDestroy {
  images: MarqueeImage[] = [];

  private readonly landingStore = inject(LandingStoreService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.landingStore.partnerLogos$.pipe(takeUntil(this.destroy$)).subscribe(logos => {
      this.images = logos.map(logo => ({
        id: logo.id,
        src: logo.logoUrl,
        alt: logo.name,
        link: logo.internalLink
      }));

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.style.setProperty('--number-of-items', this.images.length.toString());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
