import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface SettingsOption {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-partner-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-settings.html',
  styleUrls: ['./partner-settings.css']
})
export class PartnerSettings {
  settingsOptions: SettingsOption[] = [
    {
      title: 'General',
      description: 'Configuración general de tu cuenta de negocio',
      icon: 'settings',
      route: '/partner/settings/general',
      color: 'emerald'
    },
    {
      title: 'Mis Promociones',
      description: 'Gestiona tus promociones y ofertas especiales',
      icon: 'target',
      route: '/partner/settings/offers',
      color: 'coral'
    },
    {
      title: 'Mis Ubicaciones',
      description: 'Gestiona las ubicaciones de tu negocio',
      icon: 'location',
      route: '/partner/settings/locations',
      color: 'sky'
    },
    {
      title: 'Mis Productos',
      description: 'Próximamente',
      icon: 'package',
      route: '/partner/settings/products',
      color: 'emerald',
      disabled: true
    }
  ];

  constructor(private readonly router: Router) {}

  navigateToOption(route: string): void {
    this.router.navigate([route]);
  }

  handleOptionClick(option: SettingsOption): void {
    if (!option.disabled) {
      this.navigateToOption(option.route);
    }
  }

  getCardClasses(option: SettingsOption): string {
    const colorClass = this.getCardColorClass(option.color);
    if (option.disabled) {
      return `${colorClass} settings-card--disabled`;
    }
    return colorClass;
  }

  getIconClasses(option: SettingsOption): string {
    const colorClass = this.getIconColorClass(option.color);
    if (option.disabled) {
      return 'settings-icon--disabled';
    }
    return colorClass;
  }

  getTitleClasses(option: SettingsOption): string {
    if (option.disabled) {
      return 'settings-text-title--disabled';
    }
    return '';
  }

  getDescriptionClasses(option: SettingsOption): string {
    if (option.disabled) {
      return 'settings-text-description--disabled';
    }
    return '';
  }

  getArrowClasses(option: SettingsOption): string {
    if (option.disabled) {
      return 'settings-arrow--disabled';
    }
    return this.getArrowColorClass(option.color);
  }

  private getCardColorClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'settings-card--emerald';
      case 'coral':
        return 'settings-card--coral';
      case 'sky':
        return 'settings-card--sky';
      default:
        return '';
    }
  }

  private getIconColorClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'settings-icon--emerald';
      case 'coral':
        return 'settings-icon--coral';
      case 'sky':
        return 'settings-icon--sky';
      default:
        return '';
    }
  }

  private getArrowColorClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'settings-arrow--emerald';
      case 'coral':
        return 'settings-arrow--coral';
      case 'sky':
        return 'settings-arrow--sky';
      default:
        return '';
    }
  }
}
