import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Input, Renderer2 } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { Search } from '@app/search/search';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  @Input() isSimple: boolean = false;
  isOpaque = false; // Controla si el header es opaco
  offset = 50;
  isMobile = false;
  // Simulación de autenticación
  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();
  private destroy$ = new Subject<void>();
  private scrollListener!: () => void;

  isSupportMenuOpen = false; // Estado para controlar la apertura/cierre del submenú de soporte
  isMenuOpen = false;  // Estado para controlar la apertura/cierre del menú móvil

  constructor(
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    // Configura el evento scroll
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      const scrollY = window.scrollY;
      const shouldBeOpaque = scrollY > this.offset;
      if (this.isOpaque !== shouldBeOpaque) {
        this.isOpaque = shouldBeOpaque;
        this.cdr.markForCheck(); // Optimiza la detección de cambios
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

  logout(event: Event): void {
    event.preventDefault();
    console.log('User logged out');
    this.authState.next(false); // Actualiza el estado de autenticación a no autenticado.
  }

  login(): void {
    console.log('User logged in');
    this.authState.next(true); // Actualiza el estado de autenticación a autenticado.
  }

  signup() {
    console.log('signup click it'); // Mensaje de consola para depuración.
  }

  /**
   * Devuelve el estado actual de autenticación.
   */
  get isAuthenticated(): boolean {
    return this.authState.value; // Accede al valor actual de `authState`.
    // return true;
  }

  get dynamicClasses(): string {
    return this.isOpaque ? 'tw-bg-white' : 'tw-bg-white/60';
  }

  get layoutClasses(): string {
    return this.isSimple
      ? 'tw-justify-center tw-py-2 tw-px-2'
      : 'tw-justify-between tw-gap-2 sm:tw-gap-4 md:tw-gap-8 tw-px-4 tw-py-3';
  }
}
