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

  constructor(private router: Router) {}

  navigateToOption(route: string): void {
    this.router.navigate([route]);
  }

  handleOptionClick(option: SettingsOption): void {
    if (!option.disabled) {
      this.navigateToOption(option.route);
    }
  }
}
