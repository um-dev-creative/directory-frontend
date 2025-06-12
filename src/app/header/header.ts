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
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {Search} from '@app/search/search';
import { Button, Avatar } from '@app/components/ui';
import {AuthClient} from '@app/features/auth/auth.client';


/**
 * Header component
 */
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    Search,
    Button,
    Avatar
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
  protected sessionData: SessionData | undefined;
  protected readonly DFC = DFC;
  protected readonly HeaderType = HeaderType;
  private readonly authClient: AuthClient = inject(AuthClient);

  isPartnerMenuOpen = false; // Estado para controlar la apertura/cierre del submenú de partners
  isMenuOpen = false;  // Estado para controlar la apertura/cierre del menú móvil
  userLogger = {
    alias: '@',
    fullName: '',
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
    this.sessionStoreService.loadSessionData();

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
        this.userLogger.fullName = this.sessionData.userAuth.fullName;
        this.sessionData.userAuth.sessionToken ? this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER) : this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
        console.debug(`Getting sessionData on the header :: ${JSON.stringify(this.sessionData)}`);
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
          console.debug('BreakpointObserver result:', result);
          this.isMobile = result.matches;

          if (!this.isMobile && this.isMenuOpen) {
            this.isMenuOpen = false;
            console.debug('The screen is not mobile, closing the menu.');
            this.changeDetectorRefs.detectChanges(); // Forzar detección de cambios
          }
        });
    }
  }

  /**
   * Alternar visibilidad del menú móvil
   */
  openMenu() {
    console.debug('User clicked the menu');
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Alternar visibilidad del submenú de soporte
   */
  openPartnerSubmenu(open: boolean = true): void {
    this.isPartnerMenuOpen = open;
  }

  onSubMenuClick(event: Event, action: 'back' | 'partner'): void {
    event.preventDefault();
    if (action === 'partner') {
      this.openPartnerSubmenu(true);
    } else {
      this.openPartnerSubmenu(false);
    }
  }

  logout(): void {
    // Cambiar el header y navegar después de que los efectos de limpiar la sesión se completen
    setTimeout(() => {
      this.authClient.closeSession(this.sessionData?.userAuth?.sessionTokenBkd).subscribe({
        next: () => console.debug('User logged out successfully'),
        error: (error) => console.error('Error logging out:', error)
      });
      this.sessionStoreService.clearSessionData();
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
      console.debug('User logged out');
      this.router.navigate([DFC.RelativePath.STAGE_PATH]);
    }, 0);
  }

  get dynamicClasses(): string {
    return this.isOpaque
      ? 'tw-bg-white tw-shadow-lg'
      : 'tw-bg-white/90 tw-shadow-md';
  }

  get layoutClasses(): string {
    return this.validateHeader(HeaderType.CENTER_HEADER)
      ? 'tw-justify-center tw-py-2 tw-px-2'
      : 'tw-justify-between tw-gap-2 sm:tw-gap-4 md:tw-gap-8 tw-px-4 tw-py-3';
  }

  ngAfterViewInit(): void {
    console.debug(`Header component initialized :: ${this.sessionData?.token}`);
    this.changeDetectorRefs.detectChanges();
  }

  validateHeader(headerType: HeaderType): boolean {
    console.debug('Validating header type:', this.headerType);
    return (this.headerType as HeaderType) === headerType;
  }
}
