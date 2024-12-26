import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@shared/material/material.module';
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
    MaterialModule,
    FormsModule,
    TranslateModule,
    Search,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'], // Ensure the correct plural naming
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  isMobile = false;
  private isMenuOpen = false; // Estado para controlar la apertura/cierre del menú
  // Simulación de autenticación
  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();
  private destroy$ = new Subject<void>();

  isSupportMenuOpen = false; // Estado para controlar la apertura/cierre del submenú de soporte
  isMobileMenuOpen = false;  // Estado para controlar la apertura/cierre del menú móvil

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.setupBreakpointObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Configura un observador para detectar dispositivos móviles.
   */
  private setupBreakpointObserver(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small]) // Detecta tamaños de pantalla pequeños.
      .pipe(takeUntil(this.destroy$)) // Limpia automáticamente la subscripción cuando el componente se destruye.
      .subscribe(result => {
        console.log('BreakpointObserver result:', result); // Muestra el resultado del BreakpointObserver.
        this.isMobile = result.matches; // Actualiza el estado `isMobile` según el tamaño de pantalla.
        if (!this.isMobile) {
          this.isMenuOpen = false; // Cierra el menú si no es móvil.
          console.log('The screen is not mobile, closing the menu.'); // Mensaje adicional.
        }
      });
  }
  /**
   * Alternar visibilidad del menú móvil
   */
  openMenu() {
    console.log('User clicked the mobile menu');
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
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
  }
}
