import { Component, OnInit, OnDestroy, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BannerService, BannerData, BannerImage, Category } from './services/banner.service';
import { SkeletonComponent } from '@app/components/ui';
import {environment} from '@env/environment';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonComponent],
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class Banner implements OnInit, OnDestroy {
  @Input() bannerType?: 'top' | 'mid';

  readonly imageError = signal(false);
  protected readonly bannerData$ = new BehaviorSubject<BannerData | null>(null);
  protected readonly loading$ = new BehaviorSubject<boolean>(false);
  protected readonly error$ = new BehaviorSubject<string | null>(null);
  imageBucketUrl = environment.appImgBaseHref || ''; // Ensure apiUrl is set correctly

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBannerData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentBanner(): BannerImage | null {
    const data = this.bannerData$.value;
    if (!this.bannerType || !data?.banners) return null;
    return data.banners[this.bannerType] || null;
  }

  get title(): string {
    return this.bannerData$.value?.title || '';
  }

  get categories(): Category[] {
    return this.bannerData$.value?.categories || [];
  }

  getRouteForBanner(): string[] {
    const banner = this.currentBanner;
    if (banner?.route) {
      return [banner.route];
    }
    // Default routes based on banner type
    return this.bannerType === 'top' ? ['/seasonal-offers'] : ['/auth'];
  }

  onImageError(): void {
    this.imageError.set(true);
  }

  private loadBannerData(): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.bannerService.getBannerData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.bannerData$.next(data);
          this.loading$.next(false);
        },
        error: (error) => {
          this.error$.next('Failed to load banner. Please try again.');
          this.loading$.next(false);
          console.error('Banner loading error:', error);
        }
      });
  }
}
