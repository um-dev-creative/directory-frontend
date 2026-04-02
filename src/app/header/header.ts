import {
  AfterViewInit,
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
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateModule} from '@ngx-translate/core';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
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
import { HeaderMenu } from '@app/header/menu/header-menu';


/**
 * Header component
 */
@Component({
  selector: 'app-header',
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
  styleUrls: ['./header.css'], // Ensure the correct plural naming
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BackboneJwtPipe]
})
export class Header implements OnInit, OnDestroy, AfterViewInit {
  headerType$: Observable<HeaderType>;
  headerType: HeaderType | undefined;
  isOpaque = false; // Controla si el header es opaco
  offset = 50;
  isMobile = false;

  /**
   * Change detector reference
   * @private
   */
  protected changeDetectorRefs = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router: Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private scrollListener!: () => void;
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly backboneJwtPipe: BackboneJwtPipe = inject(BackboneJwtPipe);
  protected sessionData: SessionData | undefined;
  protected readonly DFC = DFC;
  protected readonly HeaderType = HeaderType;
  private readonly authClient: AuthClient = inject(AuthClient);
  private readonly logger = inject(LoggerService);

  private businessAssigned: any = []; // Indica si el usuario tiene un negocio asignado

  isMenuOpen = false;  // Estado para controlar la apertura/cierre del menú móvil
  userLogger = {
    alias: '@',
    fullName: '',
    avatarUrl: '',
    initials: ''
  }

  constructor(
    private readonly headerService: HeaderService,
    private readonly renderer: Renderer2,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.headerType$ = this.headerService.headerType$;
    this.headerType$.subscribe(headerType => {
      this.headerType = headerType;
      this.changeDetectorRefs.markForCheck();
    });
  }

  ngOnInit(): void {
    // Removed: APP_INITIALIZER is the single source of truth for session loading

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
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData?.userAuth) {
        this.userLogger.alias = this.sessionData.userAuth.alias;
        this.userLogger.fullName = this.sessionData.userAuth.fullName;
        this.userLogger.avatarUrl = this.sessionData.userAuth?.avatarUrl || '';
        this.userLogger.initials = this.sessionData.userAuth?.initials || '';
        this.sessionData.userAuth.sessionToken ? this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER) : this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
        this.businessAssigned = this.backboneJwtPipe.transform(this.sessionData?.userAuth.sessionTokenBkd ?? "")?.roles||[];
        this.logger.debug('Getting sessionData on the header', this.sessionData);
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

  /**
   * Alternar visibilidad del menú móvil
   */
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

  ngAfterViewInit(): void {
    this.logger.debug('Header component initialized', {token: this.sessionData?.token});
    this.changeDetectorRefs.detectChanges();
  }

  validateHeader(headerType: HeaderType): boolean {
    this.logger.debug('Validating header type', {current: this.headerType, expected: headerType});
    return (this.headerType as HeaderType) === headerType;
  }

  /**
   * Checks if the user has business role assigned.
   * Handles multiple role format shapes:
   * - Array<string> containing business role ID
   * - JSON string representation of array
   * - Comma-separated string
   * - Single string
   * @returns {boolean} true if user has business role
   */
  get hasBusiness(): boolean {
    const BUSINESS_ROLE_ID = '9a232260-a2e3-4990-b062-b6966efb25f8';
    const roles = this.businessAssigned;

    // Handle null/undefined
    if (!roles) {
      return false;
    }

    // Handle array
    if (Array.isArray(roles)) {
      return roles.includes(BUSINESS_ROLE_ID);
    }

    // Handle string
    if (typeof roles === 'string') {
      // Try to parse as JSON array
      try {
        const parsed = JSON.parse(roles);
        if (Array.isArray(parsed)) {
          return parsed.includes(BUSINESS_ROLE_ID);
        }
      } catch {
        // Not valid JSON, continue with string parsing
      }

      // Handle comma-separated or single string
      const normalized = roles.replaceAll(/\s/g, '');
      const items = normalized.includes(',') ? normalized.split(',') : [normalized];
      return items.includes(BUSINESS_ROLE_ID);
    }

    return false;
  }
}
