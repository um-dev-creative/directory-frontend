import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OfferSlider } from '@app/offer-slider/offer-slider';
import { PartnerRegistrationStepper } from '@app/features/partner/components';
import { PartnerProfile, PartnerProfileService } from './services/partner-profile.service';
import { LoggerService } from '@app/core/services/logger.service';
import { SessionStoreService } from '@app/core/store/session/session-store.service';

// import {Modal} from '@app/modal/modal';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [CommonModule, OfferSlider, PartnerRegistrationStepper],
  templateUrl: './partner.html',
  styleUrl: './partner.css'
})
export class Partner implements OnInit, OnDestroy {
  protected readonly showModal = signal(false);
  protected readonly isRegistration = signal(false);
  protected readonly partnerSlug = signal<string | null>(null);
  protected readonly partnerProfile = signal<PartnerProfile | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly similarPartners = signal<PartnerProfile[]>([]);
  protected readonly showTermsAndConditions = signal(false);
  protected readonly isOwner = signal(false);

  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly partnerProfileService = inject(PartnerProfileService);
  private readonly sessionStore = inject(SessionStoreService);
  private readonly logger = inject(LoggerService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Check if this is a registration flow or viewing a partner profile
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.partnerSlug.set(params.get('slug'));
      // If partner slug is provided, show profile, otherwise show registration
      this.isRegistration.set(!this.partnerSlug());

      if (this.partnerSlug()) {
        this.loadPartnerProfile(this.partnerSlug()!);
      }
    });

    // Also check query params for registration flow
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['register'] === 'true') {
        this.isRegistration.set(true);
      }
    });

    // Subscribe to session to determine ownership
    this.sessionStore.session$.pipe(takeUntil(this.destroy$)).subscribe(sessionData => {
      const profile = this.partnerProfile();
      if (!sessionData || !profile) {
        this.isOwner.set(false);
        return;
      }
      const businesses = sessionData.userAuth?.businesses ?? [];
      this.isOwner.set(businesses.includes(String(profile.id)));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPartnerProfile(slug: string): void {
    this.isLoading.set(true);

    this.partnerProfileService.getPartnerBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.partnerProfile.set(profile);
          this.isLoading.set(false);

          if (profile) {
            this.loadSimilarPartners(profile.id);
            // Re-evaluate ownership now that the profile is available
            this.sessionStore.session$.pipe(takeUntil(this.destroy$)).subscribe(sessionData => {
              if (!sessionData) {
                this.isOwner.set(false);
                return;
              }
              const businesses = sessionData.userAuth?.businesses ?? [];
              this.isOwner.set(businesses.includes(String(profile.id)));
            });
          }
        },
        error: (error) => {
          this.logger.error('Error loading partner profile:', error);
          this.isLoading.set(false);
        }
      });
  }

  private loadSimilarPartners(partnerId: number): void {
    this.partnerProfileService.getSimilarPartners(partnerId, 6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partners) => {
          this.similarPartners.set(partners);
        },
        error: (error) => {
          this.logger.error('Error loading similar partners:', error);
        }
      });
  }

  toggleBookmark(): void {
    const profile = this.partnerProfile();
    if (!profile) return;

    this.partnerProfileService.toggleBookmark(profile.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isBookmarked) => {
          const current = this.partnerProfile();
          if (current) {
            this.partnerProfile.set({ ...current, isBookmarked });
          }
        },
        error: (error) => {
          this.logger.error('Error toggling bookmark:', error);
        }
      });
  }

  editPartner(): void {
    const profile = this.partnerProfile();
    if (!profile) return;

    this.router.navigate(['/partner/edit', profile.id])
      .catch(error => {
        this.logger.error('Error navigating to partner edit:', error);
      });
  }

  goBack(): void {
    this.router.navigate(['/partners']);
  }

  sharePartner(): void {
    // SSR: browser-only
    if (!isPlatformBrowser(this.platformId)) return;

    const profile = this.partnerProfile();
    if (profile && navigator.share) {
      navigator.share({
        title: profile.name,
        text: profile.shortDescription,
        url: window.location.href
      }).catch(err => {
        this.logger.debug('Error sharing:', err);
        // Fallback: copy to clipboard
        this.copyToClipboard(window.location.href);
      });
    } else {
      // Fallback: copy to clipboard
      // SSR: browser-only
      if (isPlatformBrowser(this.platformId)) {
        this.copyToClipboard(window.location.href);
      }
    }
  }

  private copyToClipboard(text: string): void {
    // SSR: browser-only
    navigator.clipboard.writeText(text).then(() => {
      this.logger.info('Link copied to clipboard');
      // Here you could show a toast notification
    }).catch(err => {
      this.logger.error('Could not copy text: ', err);
    });
  }

  redeemOnline(): void {
    // SSR: browser-only
    if (!isPlatformBrowser(this.platformId)) return;

    const profile = this.partnerProfile();
    if (profile?.website) {
      window.open(profile.website, '_blank');
    }
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  toggleTermsAndConditions(): void {
    this.showTermsAndConditions.set(!this.showTermsAndConditions());
  }
}
