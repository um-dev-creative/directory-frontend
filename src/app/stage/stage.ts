import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
import {Carousel} from '@app/carousel/carousel';
import {Cards} from '@app/cards/cards';
import {Marquee} from '@app/marquee/marquee';
import {ProductList} from '@app/product-list/product-list';
import {TrendCarousel} from '@app/trend-carousel/trend-carousel';
import {PromoSection} from '@app/promo-section/promo-section';

import {JwtPipe} from '@shared/services/jwt.pipe';
import {HeaderService} from '@app/header/header.service';
import {HeaderType} from '@shared/constants/header-type';
import {SessionStoreService} from '@shared/signals/session/session-store.service';
import {SessionData, SessionState} from '@shared/signals/session/session.state';
import {Store} from '@ngrx/store';

interface OnAfterViewInit {
}

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
  providers: [JwtPipe]
})
export class Stage implements OnInit, OnAfterViewInit {

  private readonly headerService: HeaderService = inject(HeaderService);
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);

  /**
   * Store services for session data management
   * @type {Store<{ session: SessionData }>}
   */
  private readonly store: Store<{ session: SessionState }> = inject(Store);

  /**
   * Session data
   * @type {SessionData | undefined}
   */
  protected sessionData: SessionData | undefined;


  constructor() {
  }

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
    });
    this.processSessionData();
  }

  private processSessionData(): void  {
    if (this.sessionData?.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
      console.debug('User is authenticated');
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

}
