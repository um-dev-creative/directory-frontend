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
  templateUrl: './partner-settings.component.html'
})
export class PartnerSettingsComponent {
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

  constructor(private router: Router) {}

  navigateToOption(route: string): void {
    this.router.navigate([route]);
  }

  handleOptionClick(option: SettingsOption): void {
    if (!option.disabled) {
      this.navigateToOption(option.route);
    }
  }

  getCardClasses(option: SettingsOption): string {
    const baseClasses = this.getCardColorClasses(option.color);
    if (option.disabled) {
      return `${baseClasses} tw-opacity-60 tw-cursor-not-allowed tw-pointer-events-none tw-bg-gray-100`;
    }
    return baseClasses;
  }

  getIconClasses(option: SettingsOption): string {
    const baseIconClasses = this.getIconColorClasses(option.color);
    if (option.disabled) {
      return 'tw-bg-gray-200 tw-text-gray-400';
    }
    return baseIconClasses;
  }

  getTitleClasses(option: SettingsOption): string {
    if (option.disabled) {
      return 'tw-text-gray-400';
    }
    return 'tw-text-emerald-green-800 group-hover:tw-text-emerald-green-900';
  }

  getDescriptionClasses(option: SettingsOption): string {
    if (option.disabled) {
      return 'tw-text-gray-400';
    }
    return 'tw-text-emerald-green-600 group-hover:tw-text-emerald-green-700';
  }

  getArrowClasses(option: SettingsOption): string {
    if (option.disabled) {
      return 'tw-text-gray-400';
    }
    return this.getArrowColorClasses(option.color);
  }

  private getCardColorClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'tw-border-emerald-green-500 hover:tw-bg-gradient-to-br hover:tw-from-emerald-green-50 hover:tw-to-white focus:tw-ring-2 focus:tw-ring-emerald-green-500';
      case 'coral':
        return 'tw-border-coral-500 hover:tw-bg-gradient-to-br hover:tw-from-coral-50 hover:tw-to-white focus:tw-ring-2 focus:tw-ring-coral-500';
      case 'sky':
        return 'tw-border-sky-blue-400 hover:tw-bg-gradient-to-br hover:tw-from-sky-blue-50 hover:tw-to-white focus:tw-ring-2 focus:tw-ring-sky-blue-400';
      default:
        return 'tw-border-gray-300 hover:tw-bg-gray-50 focus:tw-ring-2 focus:tw-ring-gray-300';
    }
  }

  private getIconColorClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'tw-bg-emerald-green-100 tw-text-emerald-green-700 group-hover:tw-bg-emerald-green-200';
      case 'coral':
        return 'tw-bg-coral-100 tw-text-coral-700 group-hover:tw-bg-coral-200';
      case 'sky':
        return 'tw-bg-sky-blue-100 tw-text-sky-blue-700 group-hover:tw-bg-sky-blue-200';
      default:
        return 'tw-bg-gray-100 tw-text-gray-700 group-hover:tw-bg-gray-200';
    }
  }

  private getArrowColorClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'tw-text-emerald-green-400 group-hover:tw-text-emerald-green-600';
      case 'coral':
        return 'tw-text-coral-400 group-hover:tw-text-coral-600';
      case 'sky':
        return 'tw-text-sky-blue-400 group-hover:tw-text-sky-blue-600';
      default:
        return 'tw-text-gray-400 group-hover:tw-text-gray-600';
    }
  }
}
