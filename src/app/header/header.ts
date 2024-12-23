import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Search } from '@app/search/search';
import { Menu } from '@app/menu/menu';

/**
 * Header component
 */
@Component({
  selector: 'app-header',
  standalone: true, // Use standalone components for modularity
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    Search,
    Menu,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'], // Ensure the correct plural naming
})
export class Header {
  isProfileMenuOpen = false; // Estado para controlar la apertura/cierre del menú de perfil
  isSupportMenuOpen = false; // Estado para controlar la apertura/cierre del submenú de soporte
  isMobileMenuOpen = false;  // Estado para controlar la apertura/cierre del menú móvil

  //TODO: ELIMINAR ESTE MÉTODO SI NO SE USA
  /**
   * Alternar visibilidad del menú móvil
   */
  toggleMobileMenu(open: boolean) {
    this.isMobileMenuOpen = open;
  }

  /**
   * Alternar visibilidad del menú móvil
   */
  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  /**
   * Alternar visibilidad del menú de perfil
   */
  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (!this.isProfileMenuOpen) {
      this.isSupportMenuOpen = false; // Cerrar el submenú de soporte si se cierra el menú de perfil
    }
  }

  /**
   * Alternar visibilidad del submenú de soporte
   */
  toggleSupportSubMenu(open: boolean = true): void {
    this.isSupportMenuOpen = open;
  }

  logout(): void {
    console.log('User logged out');
    // Aquí puedes agregar lógica adicional, como limpiar el estado global o redirigir
  }

}
