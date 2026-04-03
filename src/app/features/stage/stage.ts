import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Banner } from '@app/banner/banner';
import { Carousel } from '@app/carousel/carousel';
import { Cards } from '@app/cards/cards';
import { Marquee } from '@app/marquee/marquee';
import { ProductList } from '@app/product-list/product-list';
import { TrendCarousel } from '@app/trend-carousel/trend-carousel';
import { PromoSection } from '@app/promo-section/promo-section';
import { BackboneJwtPipe } from '@shared/pipes/backbone-jwt.pipe';
import { HeaderService } from '@app/header/header.service';
import { HeaderType } from '@shared/constants/header-type';
import { SessionData, SessionState } from '@app/core/store/session/session.state';
import { Store } from '@ngrx/store';
import { CardImage } from '@app/cards/services/cards.service';
import { LoggerService } from '@app/core/services/logger.service';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import { take } from 'rxjs/operators';

/**
 * Main stage component
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, Banner, Carousel, Cards, Marquee, ProductList, TrendCarousel, PromoSection],
  templateUrl: './stage.html',
  styleUrl: './stage.css',
  animations: [],
  providers: [BackboneJwtPipe]
})
export class Stage implements OnInit, AfterViewInit {

  private readonly headerService: HeaderService = inject(HeaderService);
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);
  private readonly logger = inject(LoggerService);
  private readonly landingStore = inject(LandingStoreService);

  private readonly store: Store<{ session: SessionState }> = inject(Store);

  sessionData: SessionData | undefined;
  isAuthenticated = false;

  constructor() {}

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData && this.sessionData.userAuth?.fullName) {
        this.isAuthenticated = true;
        this.logger.debug('User is authenticated:', this.sessionData.userAuth.fullName);
      } else {
        this.isAuthenticated = false;
      }
    });
    this.processSessionData();

    // Dispatch landing load only if data is not already in the store
    this.landingStore.isReady$.pipe(take(1)).subscribe(isReady => {
      if (!isReady) {
        this.landingStore.loadLanding();
      }
    });
  }

  ngAfterViewInit(): void {
    // Placeholder for AfterViewInit logic
  }

  protected processSessionData(): void {
    if (this.sessionData?.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
      this.logger.debug('User is authenticated');
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

  onCardClick(event: { card: CardImage, index: number }): void {
    this.logger.info('Card clicked', { title: event.card.title || event.card.alt, position: event.index });
  }

  onImageError(event: { card: CardImage, index: number }): void {
    this.logger.warn('Failed to load image for card:', event.card.title || event.card.alt);
  }
}
