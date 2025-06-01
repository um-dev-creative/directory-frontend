import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
import {TrendCarousel} from '@app/trend-carousel/trend-carousel';
import {JwtPipe} from '@app/shared/pipes/jwt.pipe';
import {HeaderService} from '@app/header/header.service';
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
  imports: [CommonModule, Banner, TrendCarousel],
  templateUrl: './deals.html',
  styleUrl: './deals.css',
  animations: [],
  providers: [JwtPipe]
})
export class Deals implements OnInit, OnAfterViewInit {

  private readonly headerService: HeaderService = inject(HeaderService);
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
      console.debug('User is authenticated');
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

}
