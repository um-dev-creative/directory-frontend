import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateModule} from '@ngx-translate/core';
import {Search} from '@app/search/search';
import {SessionStoreService} from '@shared/store/session-store.service';
import {JwtPipe} from '@shared/services/jwt.pipe';
import {SessionData} from '@shared/state/session.state';
import {Store} from '@ngrx/store';

/**
 * Header component
 */
@Component({
  selector: 'app-header',
  standalone: true, // Use standalone components for modularity
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    Search,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'], // Ensure the correct plural naming
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [JwtPipe]
})
export class Header implements OnInit, OnDestroy, AfterViewInit {
  @Input() isSimple: boolean = false;
  isOpaque = false; // Controla si el header es opaco
  offset = 50;
  isMobile = false;

  /**
   * Change detector reference
   * @private
   */
  protected changeDetectorRefs = inject(ChangeDetectorRef);

  private readonly router: Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private scrollListener!: () => void;
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);
  private readonly store: Store<{ session: SessionData }> = inject(Store);
  protected sessionData: SessionData | undefined;

  isSupportMenuOpen = false; // Estado para controlar la apertura/cierre del submenú de soporte
  isMenuOpen = false;  // Estado para controlar la apertura/cierre del menú móvil
  userLogger = {
    alias: '@',
    fullName: '',
  }

  constructor(
    private readonly renderer: Renderer2,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // Configura el evento scroll
    this.sessionStoreService.loadSessionData();
    this.store.select('session').subscribe(sessionData => {
      this.sessionData = sessionData;
      if (this.sessionData?.userAuth) {
        this.userLogger.alias = this.sessionData.userAuth.alias;
        this.userLogger.fullName = this.sessionData.userAuth.fullName;
        this.userLogger.alias = this.sessionData.userAuth.alias;
        this.userLogger.fullName = this.sessionData.userAuth.fullName;
        console.debug(`Getting sessionData on the header :: ${JSON.stringify(this.sessionData)}`);
      }
    });
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      const scrollY = window.scrollY;
      const shouldBeOpaque = scrollY > this.offset;
      if (this.isOpaque !== shouldBeOpaque) {
        this.isOpaque = shouldBeOpaque;
        this.cdr.markForCheck(); // Optimiza la detección de cambios
      }
    });
    ;
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
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        console.log('BreakpointObserver result:', result);
        this.isMobile = result.matches;

        if (!this.isMobile && this.isMenuOpen) {
          this.isMenuOpen = false;
          console.log('The screen is not mobile, closing the menu.');
          this.cdr.detectChanges(); // Forzar detección de cambios
        }
      });
  }

  /**
   * Establecer si el header es simple
   */
  setSimple(value: boolean): void {
    this.isSimple = value;
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  /**
   * Alternar visibilidad del menú móvil
   */
  openMenu() {
    console.log('User clicked the menu');
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Alternar visibilidad del submenú de soporte
   */
  openSupportSubMenu(open: boolean = true): void {
    this.isSupportMenuOpen = open;
  }

  onSubMenuClick(event: Event, action: 'support' | 'back'): void {
    event.preventDefault();
    if (action === 'support') {
      this.openSupportSubMenu(true);
    } else {
      this.openSupportSubMenu(false);
    }
  }

  logout(): void {
    this.sessionStoreService.clearSessionData();
    console.log('User logged out');
    this.router.navigate(['/stage']);
  }

  signup() {
    console.log('signup click it'); // Mensaje de consola para depuración.
  }

  /**
   * Devuelve el estado actual de autenticación.
   */
  get isAuthenticated(): boolean {
    return (this.sessionData?.token !== null && this.sessionData?.token !== undefined && this.sessionData?.token !== '');
  }

  get dynamicClasses(): string {
    return this.isOpaque ? 'tw-bg-white' : 'tw-bg-white/60';
  }

  get layoutClasses(): string {
    return this.isSimple
      ? 'tw-justify-center tw-py-2 tw-px-2'
      : 'tw-justify-between tw-gap-2 sm:tw-gap-4 md:tw-gap-8 tw-px-4 tw-py-3';
  }

  ngAfterViewInit(): void {
    console.log(`Header component initialized :: ${this.sessionData?.token}`);
    this.changeDetectorRefs.detectChanges();
  }
}
