import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {OfferSlider} from '@app/offer-slider/offer-slider';
import {PartnerRegistrationStepper} from '@app/features/partner/components';
import {PartnerProfile, PartnerProfileService} from './services/partner-profile.service';
import {LoggerService} from '@app/core/services/logger.service';

// import {Modal} from '@app/modal/modal';

@Component({
  selector: 'app-partner',
  imports: [CommonModule, OfferSlider, PartnerRegistrationStepper],
  templateUrl: './partner.html',
  styleUrl: './partner.css'
})
export class Partner implements OnInit, OnDestroy {
  showModal = false;
  isRegistration = false;
  partnerSlug: string | null = null;
  partnerProfile: PartnerProfile | null = null;
  isLoading = false;
  similarPartners: PartnerProfile[] = [];
  showTermsAndConditions = false;

  private destroy$ = new Subject<void>();
  private readonly logger = inject(LoggerService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnerProfileService: PartnerProfileService
  ) {}

  ngOnInit(): void {
    // Check if this is a registration flow or viewing a partner profile
    this.route.paramMap.subscribe(params => {
      this.partnerSlug = params.get('slug');
      // If partner slug is provided, show profile, otherwise show registration
      this.isRegistration = !this.partnerSlug;

      if (this.partnerSlug) {
        this.loadPartnerProfile(this.partnerSlug);
      }
    });

    // Also check query params for registration flow
    this.route.queryParams.subscribe(params => {
      if (params['register'] === 'true') {
        this.isRegistration = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPartnerProfile(partnerSlug: string): void {
    this.isLoading = true;

    this.partnerProfileService.getPartnerBySlug(partnerSlug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.partnerProfile = profile;
          this.isLoading = false;

          if (profile) {
            this.loadSimilarPartners(profile.id);
          }
        },
        error: (error) => {
          this.logger.error('Error loading partner profile:', error);
          this.isLoading = false;
        }
      });
  }

  private loadSimilarPartners(partnerId: number): void {
    this.partnerProfileService.getSimilarPartners(partnerId, 6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partners) => {
          this.similarPartners = partners;
        },
        error: (error) => {
          this.logger.error('Error loading similar partners:', error);
        }
      });
  }  toggleBookmark(): void {
    if (!this.partnerProfile) return;

    this.partnerProfileService.toggleBookmark(this.partnerProfile.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isBookmarked) => {
          if (this.partnerProfile) {
            this.partnerProfile.isBookmarked = isBookmarked;
          }
        },
        error: (error) => {
          this.logger.error('Error toggling bookmark:', error);
        }
      });
  }

  editPartner(): void {
    if (!this.partnerProfile) return;

    // Navigate to partner settings page using the partner slug
    this.router.navigate(['/partner/settings', 'general'])
      .catch(error => {
        this.logger.error('Error navigating to partner settings:', error);
      });
  }

  goBack(): void {
    this.router.navigate(['/partners']);
  }

  sharePartner(): void {
    if (this.partnerProfile && navigator.share) {
      navigator.share({
        title: this.partnerProfile.name,
        text: this.partnerProfile.shortDescription,
        url: window.location.href
      }).catch(err => {
        this.logger.debug('Error sharing:', err);
        // Fallback: copy to clipboard
        this.copyToClipboard(window.location.href);
      });
    } else {
      // Fallback: copy to clipboard
      this.copyToClipboard(window.location.href);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.logger.info('Link copied to clipboard');
      // Here you could show a toast notification
    }).catch(err => {
      this.logger.error('Could not copy text: ', err);
    });
  }

  redeemOnline(): void {
    if (this.partnerProfile?.website) {
      window.open(this.partnerProfile.website, '_blank');
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  toggleTermsAndConditions(): void {
    this.showTermsAndConditions = !this.showTermsAndConditions;
  }
}
