import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
import {Carousel} from '@app/carousel/carousel';
import {Cards} from '@app/cards/cards';
import {Marquee} from '@app/marquee/marquee';
import {ProductList} from '@app/product-list/product-list';
import {OffersCarousel} from '@app/offers-carousel/offers-carousel';
import {PromoSection} from '@app/promo-section/promo-section';

import {JwtPipe} from '@shared/services/jwt.pipe';
import {HeaderService} from '@app/header/header.service';
import {HeaderType} from '@shared/constants/header-type';
import {SessionStoreService} from '@shared/signals/session/session-store.service';

interface OnAfterViewInit {
}

/**
 * Main stage component
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, Banner, Carousel, Cards, Marquee, ProductList, OffersCarousel, PromoSection],
  templateUrl: './stage.html',
  styleUrl: './stage.css',
  animations: [],
  providers: [JwtPipe]
})
export class Stage implements OnInit, OnAfterViewInit {

  private readonly headerService: HeaderService = inject(HeaderService);
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);


  constructor() {
  }

  ngOnInit(): void {
    this.processSessionData();
  }

  private processSessionData(): void  {
    let session = this.sessionStoreService.session;
    if (session.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
      console.debug('User is authenticated');
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

}
