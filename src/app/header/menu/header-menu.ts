import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderType } from '@shared/constants/header-type';
import { Button } from '@app/components/ui/buttons/button';
import { Avatar } from '@app/components/ui/avatars/avatar';

export interface UserLogger {
  alias: string;
  fullName: string;
  displayName: string;
  avatarUrl: string;
  initials: string;
  firstName?: string;
  lastName?: string;
  avatarVersion?: string;
}

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    Button,
    Avatar
  ],
  templateUrl: './header-menu.html',
  styleUrls: ['./header-menu.css']
})
export class HeaderMenu {
  @Input() isOpen: boolean = false;
  @Input() headerType!: HeaderType;
  @Input() userLogger: UserLogger = {
    alias: '@',
    fullName: '',
    displayName: '',
    avatarUrl: '',
    initials: ''
  };
  @Input() hasBusiness: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  protected readonly HeaderType = HeaderType;

  // Estado interno del submenú de partners
  protected readonly isPartnerMenuOpen = signal(false);

  openPartnerSubmenu(open: boolean = true): void {
    this.isPartnerMenuOpen.set(open);
  }

  onSubMenuClick(event: Event, action: 'back' | 'partner'): void {
    event.preventDefault();
    if (action === 'partner') {
      this.openPartnerSubmenu(true);
    } else {
      this.openPartnerSubmenu(false);
    }
  }
}
