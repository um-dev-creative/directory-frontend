import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  PLATFORM_ID
} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {isPlatformBrowser, NgClass} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateModule} from '@ngx-translate/core';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {Store} from '@ngrx/store';
import {DFC} from '@app/shared/constants/app.const';
import {HeaderType} from '@shared/constants/header-type';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {HeaderService} from '@app/header/header.service';
import {Search} from '@app/features/search/search';
import { Button } from '@app/components/ui/buttons/button';
import { Avatar } from '@app/components/ui/avatars/avatar';
import {AuthClient} from '@app/features/auth/auth.client';
import {LoggerService} from '@app/core/services/logger.service';
import {HeaderMenu, UserLogger} from '@app/header/menu/header-menu';
import {getInitials} from '@shared/utils/get-initials.helper';


/**
 * Header component
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    TranslateModule,
    Search,
    Button,
    Avatar,
    HeaderMenu
  ],
    templateUrl: './header.html',
    styleUrls: ['./header.css'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
  export class Header implements OnInit, OnDestroy {
  headerType: HeaderType | undefined;
    isOpaque = false;
  offset = 50;
  isMobile = false;

  /**
   * Change detector reference
   * @private
   */
  protected readonly changeDetectorRefs = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router: Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private scrollListener!: () => void;
  private readonly sessionStoreService = inject(SessionStoreService);
  private readonly store = inject(Store<{ session: SessionState }>);
  protected sessionData: SessionData | undefined;
  protected readonly DFC = DFC;
  protected readonly HeaderType = HeaderType;
  private readonly authClient = inject(AuthClient);
  private readonly logger = inject(LoggerService);
  private readonly headerService = inject(HeaderService);
  private readonly renderer = inject(Renderer2);
  private readonly breakpointObserver = inject(BreakpointObserver);

  isMenuOpen = false;
  protected userLogger: UserLogger = {
    alias: '@',
    fullName: '',
    displayName: '',
    avatarUrl: '',
    initials: '',
    firstName: '',
    lastName: '',
    avatarVersion: ''
  };

  ngOnInit(): void {
    this.headerService.headerType$.pipe(takeUntil(this.destroy$)).subscribe(headerType => {
      this.headerType = headerType;
      this.changeDetectorRefs.markForCheck();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = this.renderer.listen('window', 'scroll', () => {
        const scrollY = window.scrollY;
        const shouldBeOpaque = scrollY > this.offset;
        if (this.isOpaque !== shouldBeOpaque) {
          this.isOpaque = shouldBeOpaque;
          this.changeDetectorRefs.markForCheck(); // Optimiza la detección de cambios
        }
      });
    }
    // Configura el evento scroll
    this.store.select(state => state.session).pipe(takeUntil(this.destroy$)).subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData?.userAuth) {
        this.userLogger = this.buildUserLogger(this.sessionData);
        this.sessionData.userAuth.sessionToken ? this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER) : this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
        this.logger.debug('Getting sessionData on the header', this.sessionData);
        this.changeDetectorRefs.markForCheck();
      }
    });
    this.setupBreakpointObserver();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configura un observador para detectar dispositivos móviles.
   */
  private setupBreakpointObserver(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small])
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          this.logger.debug('BreakpointObserver result:', result);
          this.isMobile = result.matches;

          if (!this.isMobile && this.isMenuOpen) {
            this.isMenuOpen = false;
            this.logger.debug('The screen is not mobile, closing the menu.');
            this.changeDetectorRefs.detectChanges(); // Forzar detección de cambios
          }
        });
    }
  }

  openMenu() {
    this.logger.debug('User clicked the menu');
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    // Cambiar el header y navegar después de que los efectos de limpiar la sesión se completen
    setTimeout(() => {
      this.authClient.closeSession(this.sessionData?.userAuth?.sessionTokenBkd).subscribe({
        next: () => this.logger.info('User logged out successfully'),
        error: (error) => this.logger.error('Error logging out:', error)
      });
      this.sessionStoreService.clearSessionData();
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
      this.logger.info('User logged out');
      this.router.navigate([DFC.RelativePath.STAGE_PATH]);
    }, 0);
  }

  get dynamicClasses(): string {
    return this.isOpaque
      ? 'bg-white shadow-lg'
      : 'bg-white/90 shadow-md';
  }

  get layoutClasses(): string {
    return this.validateHeader(HeaderType.CENTER_HEADER)
      ? 'justify-center py-2 px-2'
      : 'justify-between gap-2 sm:gap-4 md:gap-8 px-4 py-3';
  }

  validateHeader(headerType: HeaderType): boolean {
    this.logger.debug('Validating header type', {current: this.headerType, expected: headerType});
    return (this.headerType as HeaderType) === headerType;
  }

  /**
   * Checks if the user has one or more businesses assigned.
   * @returns {boolean} true if userAuth.businesses array has at least one element
   */
  get hasBusiness(): boolean {
    return this.sessionData?.userAuth?.businesses != undefined
      && this.sessionData?.userAuth?.businesses
      && Array.isArray(this.sessionData.userAuth.businesses)
      && this.sessionData.userAuth.businesses.length > 0;
  }

  private buildUserLogger(sessionData: SessionData): UserLogger {
    const userAuth = sessionData.userAuth;
    const fullName = this.resolveFullName(userAuth);
    const displayName = this.resolveDisplayName(userAuth, fullName);
    const avatarUrl = this.resolveAvatarUrl(userAuth.avatarUrl ?? '');
    const initials = userAuth.initials || getInitials(userAuth.firstName ?? '', userAuth.lastName ?? '') || this.resolveInitialsFromName(displayName);

    return {
      alias: userAuth.alias || '@',
      fullName,
      displayName,
      avatarUrl,
      initials,
      firstName: userAuth.firstName ?? '',
      lastName: userAuth.lastName ?? '',
      avatarVersion: userAuth.avatarVersion ?? ''
    };
  }

  private resolveFullName(userAuth: SessionData['userAuth']): string {
    if (userAuth.fullName?.trim()) {
      return userAuth.fullName.trim();
    }

    const composedName = `${userAuth.firstName ?? ''} ${userAuth.lastName ?? ''}`.trim();
    return composedName || userAuth.displayName?.trim() || '';
  }

  private resolveDisplayName(userAuth: SessionData['userAuth'], fallbackName: string): string {
    return userAuth.displayName?.trim() || fallbackName;
  }

  private resolveAvatarUrl(avatarUrl: string): string {
    if (!avatarUrl) {
      return '';
    }

    if (avatarUrl.includes('v=')) {
      return avatarUrl;
    }

    const version = this.sessionData?.userAuth?.avatarVersion;
    if (!version) {
      return avatarUrl;
    }

    const separator = avatarUrl.includes('?') ? '&' : '?';
    return `${avatarUrl}${separator}v=${encodeURIComponent(version)}`;
  }

  private resolveInitialsFromName(displayName: string): string {
    const [first = '', second = ''] = displayName.trim().split(/\s+/);
    return getInitials(first, second);
  }
}
