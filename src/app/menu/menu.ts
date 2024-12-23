import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu {
  @Input() isProfileMenuOpen: boolean = false; // Estado para abrir/cerrar el menú de perfil
  @Input() isSupportMenuOpen: boolean = false; // Estado para abrir/cerrar el submenú de soporte
  @Output() logoutClicked = new EventEmitter<void>();

  // Eventos para cerrar/abrir el menú de soporte
  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (!this.isProfileMenuOpen) {
      this.isSupportMenuOpen = false;
    }
  }

  toggleSupportMenu(open: boolean = true): void {
    this.isSupportMenuOpen = open;
  }

  onSubMenuClick(event: Event, action: string): void {
    event.preventDefault();
    if (action === 'support') {
      this.toggleSupportMenu(true);
    } else {
      this.toggleSupportMenu(false);
    }
  }

  onLogout(): void {
    this.logoutClicked.emit(); // Emite el evento al padre
  }
}
