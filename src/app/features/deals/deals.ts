import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
import {OfferSlider} from '@app/offer-slider/offer-slider';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {HeaderService} from '@app/header/header.service';
import {LoggerService} from '@app/core/services/logger.service';
import {HeaderType} from '@shared/constants/header-type';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {Store} from '@ngrx/store';

interface OnAfterViewInit {
}

/**
 * Main deals component
 */
@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, Banner, OfferSlider],
  templateUrl: './deals.html',
  styleUrl: './deals.css',
  animations: [],
  providers: [BackboneJwtPipe]
})
export class Deals implements OnInit, OnAfterViewInit {

  private readonly headerService: HeaderService = inject(HeaderService);
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);
  private readonly logger = inject(LoggerService);

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
  protected isAuthenticated = false;
  protected userFullName: string | undefined;


  constructor() {
  }

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData && this.sessionData.userAuth?.fullName) {
        this.isAuthenticated = true;
        this.userFullName = this.sessionData.userAuth.fullName;
      } else {
        this.isAuthenticated = false;
        this.userFullName = undefined;
      }
    });
    this.processSessionData();
  }

  private processSessionData(): void  {
    if (this.sessionData?.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
      this.logger.debug('User is authenticated');
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

}
