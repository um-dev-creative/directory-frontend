import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Button,
  BadgeComponent,
  IconComponent
} from '@app/components/ui';

@Component({
  selector: 'app-icons-section',
  standalone: true,
  imports: [CommonModule, Button, IconComponent, BadgeComponent],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Iconos</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Biblioteca completa de iconos Heroicons con diferentes tamaños y estilos
      </p>

      <!-- Tamaños de Iconos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
        <div class="tw-flex tw-items-center tw-space-x-8">
          <div class="tw-text-center">
            <app-icon name="heart" size="xs" class="tw-text-emerald-green-600"></app-icon>
            <p class="tw-text-xs tw-text-beige-600 tw-mt-2">XS (16px)</p>
          </div>
          <div class="tw-text-center">
            <app-icon name="heart" size="sm" class="tw-text-emerald-green-600"></app-icon>
            <p class="tw-text-xs tw-text-beige-600 tw-mt-2">SM (20px)</p>
          </div>
          <div class="tw-text-center">
            <app-icon name="heart" size="md" class="tw-text-emerald-green-600"></app-icon>
            <p class="tw-text-xs tw-text-beige-600 tw-mt-2">MD (24px)</p>
          </div>
          <div class="tw-text-center">
            <app-icon name="heart" size="lg" class="tw-text-emerald-green-600"></app-icon>
            <p class="tw-text-xs tw-text-beige-600 tw-mt-2">LG (32px)</p>
          </div>
          <div class="tw-text-center">
            <app-icon name="heart" size="xl" class="tw-text-emerald-green-600"></app-icon>
            <p class="tw-text-xs tw-text-beige-600 tw-mt-2">XL (48px)</p>
          </div>
        </div>
      </div>

      <!-- Variantes de Iconos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
          <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4 tw-text-center">
            <app-icon name="star" variant="outline" size="lg" class="tw-text-emerald-green-600 tw-mb-3"></app-icon>
            <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-1">Outline</h4>
            <p class="tw-text-sm tw-text-beige-600">Contorno, ideal para interfaces limpias</p>
          </div>
          <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4 tw-text-center">
            <app-icon name="star" variant="solid" size="lg" class="tw-text-emerald-green-600 tw-mb-3"></app-icon>
            <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-1">Solid</h4>
            <p class="tw-text-sm tw-text-beige-600">Sólido, perfecto para destacar elementos</p>
          </div>
          <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4 tw-text-center">
            <app-icon name="star" variant="solid" size="lg" class="tw-text-emerald-green-600 tw-mb-3"></app-icon>
            <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-1">Solid</h4>
            <p class="tw-text-sm tw-text-beige-600">Relleno sólido, más visualmente prominente</p>
          </div>
        </div>
      </div>

      <!-- Colores de Marca -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Colores de Marca</h3>
        <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-5 tw-gap-4">
          <div class="tw-text-center">
            <app-icon name="shield-check" size="lg" class="tw-text-emerald-green-600 tw-mb-2"></app-icon>
            <app-badge variant="primary" size="sm">Emerald Green</app-badge>
          </div>
          <div class="tw-text-center">
            <app-icon name="heart" size="lg" class="tw-text-coral-600 tw-mb-2"></app-icon>
            <app-badge variant="secondary" size="sm">Coral</app-badge>
          </div>
          <div class="tw-text-center">
            <app-icon name="information-circle" size="lg" class="tw-text-sky-blue-600 tw-mb-2"></app-icon>
            <app-badge variant="info" size="sm">Sky Blue</app-badge>
          </div>
          <div class="tw-text-center">
            <app-icon name="sun" size="lg" class="tw-text-beige-600 tw-mb-2"></app-icon>
            <app-badge variant="secondary" size="sm">Beige</app-badge>
          </div>
          <div class="tw-text-center">
            <app-icon name="check-circle" size="lg" class="tw-text-success-600 tw-mb-2"></app-icon>
            <app-badge variant="success" size="sm">Success</app-badge>
          </div>
        </div>
      </div>

      <!-- Iconos Comunes -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Iconos Comunes</h3>
        <div class="tw-grid tw-grid-cols-3 md:tw-grid-cols-6 lg:tw-grid-cols-8 tw-gap-4">
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Home">
            <app-icon name="home" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">home</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="User">
            <app-icon name="user" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">user</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Settings">
            <app-icon name="cog-6-tooth" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">settings</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Search">
            <app-icon name="magnifying-glass" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">search</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Bell">
            <app-icon name="bell" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">bell</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Mail">
            <app-icon name="envelope" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">mail</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Calendar">
            <app-icon name="calendar-days" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">calendar</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Chart">
            <app-icon name="chart-bar" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">chart</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Lock">
            <app-icon name="lock-closed" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">lock</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Eye">
            <app-icon name="eye" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">eye</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Download">
            <app-icon name="arrow-down-tray" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">download</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Upload">
            <app-icon name="arrow-up-tray" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">upload</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Share">
            <app-icon name="share" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">share</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Plus">
            <app-icon name="plus" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">plus</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Minus">
            <app-icon name="minus" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">minus</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-rounded-lg tw-bg-beige-50 hover:tw-bg-beige-100 tw-transition-colors tw-cursor-pointer" title="Close">
            <app-icon name="x-mark" size="md" class="tw-text-beige-700 tw-mb-1"></app-icon>
            <p class="tw-text-xs tw-text-beige-600">close</p>
          </div>
        </div>
      </div>

      <!-- Iconos en Contexto -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Iconos en Contexto</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <!-- Botones con iconos -->
          <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
            <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">En Botones</h4>
            <div class="tw-space-y-3">
              <app-button variant="primary" class="tw-w-full">
                <app-icon name="plus" size="sm" class="tw-mr-2 tw-text-white"></app-icon>
                Crear Nuevo
              </app-button>
              <app-button variant="secondary" class="tw-w-full">
                <app-icon name="arrow-down-tray" size="sm" class="tw-mr-2"></app-icon>
                Descargar
              </app-button>
              <app-button variant="outline" class="tw-w-full">
                <app-icon name="share" size="sm" class="tw-mr-2"></app-icon>
                Compartir
              </app-button>
            </div>
          </div>

          <!-- Alertas con iconos -->
          <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
            <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">En Alertas</h4>
            <div class="tw-space-y-3">
              <div class="tw-bg-success-50 tw-border tw-border-success-200 tw-rounded-lg tw-p-3 tw-flex tw-items-center">
                <app-icon name="check-circle" size="sm" class="tw-text-success-600 tw-mr-2"></app-icon>
                <span class="tw-text-sm tw-text-success-800">Operación exitosa</span>
              </div>
              <div class="tw-bg-alert-50 tw-border tw-border-alert-200 tw-rounded-lg tw-p-3 tw-flex tw-items-center">
                <app-icon name="exclamation-triangle" size="sm" class="tw-text-alert-600 tw-mr-2"></app-icon>
                <span class="tw-text-sm tw-text-alert-800">Error detectado</span>
              </div>
              <div class="tw-bg-sky-blue-50 tw-border tw-border-sky-blue-200 tw-rounded-lg tw-p-3 tw-flex tw-items-center">
                <app-icon name="information-circle" size="sm" class="tw-text-sky-blue-600 tw-mr-2"></app-icon>
                <span class="tw-text-sm tw-text-sky-blue-800">Información importante</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estados Interactivos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estados Interactivos</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4">
          <button class="tw-group tw-bg-white tw-border tw-border-beige-200 tw-rounded-lg tw-p-4 tw-text-center hover:tw-border-emerald-green-300 hover:tw-bg-emerald-green-50 tw-transition-all">
            <app-icon name="heart" size="lg" class="tw-text-beige-400 group-hover:tw-text-emerald-green-600 tw-transition-colors tw-mb-2"></app-icon>
            <p class="tw-text-sm tw-text-beige-700 group-hover:tw-text-emerald-green-700">Hover me</p>
          </button>

          <button class="tw-group tw-bg-white tw-border tw-border-beige-200 tw-rounded-lg tw-p-4 tw-text-center hover:tw-border-coral-300 hover:tw-bg-coral-50 tw-transition-all">
            <app-icon name="star" size="lg" class="tw-text-beige-400 group-hover:tw-text-coral-600 tw-transition-colors tw-mb-2"></app-icon>
            <p class="tw-text-sm tw-text-beige-700 group-hover:tw-text-coral-700">Star this</p>
          </button>

          <button class="tw-group tw-bg-white tw-border tw-border-beige-200 tw-rounded-lg tw-p-4 tw-text-center hover:tw-border-sky-blue-300 hover:tw-bg-sky-blue-50 tw-transition-all">
            <app-icon name="bookmark" size="lg" class="tw-text-beige-400 group-hover:tw-text-sky-blue-600 tw-transition-colors tw-mb-2"></app-icon>
            <p class="tw-text-sm tw-text-beige-700 group-hover:tw-text-sky-blue-700">Save</p>
          </button>

          <button class="tw-group tw-bg-white tw-border tw-border-beige-200 tw-rounded-lg tw-p-4 tw-text-center hover:tw-border-success-300 hover:tw-bg-success-50 tw-transition-all">
            <app-icon name="check" size="lg" class="tw-text-beige-400 group-hover:tw-text-success-600 tw-transition-colors tw-mb-2"></app-icon>
            <p class="tw-text-sm tw-text-beige-700 group-hover:tw-text-success-700">Complete</p>
          </button>
        </div>
      </div>

      <!-- Información de Uso -->
      <div class="tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Cómo Usar</h3>
        <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
          <div class="tw-space-y-2 tw-text-sm tw-text-beige-700">
            <p><strong>Básico:</strong> <code class="tw-bg-beige-200 tw-px-2 tw-py-1 tw-rounded tw-text-xs">&lt;app-icon name="heart"&gt;&lt;/app-icon&gt;</code></p>
            <p><strong>Con tamaño:</strong> <code class="tw-bg-beige-200 tw-px-2 tw-py-1 tw-rounded tw-text-xs">&lt;app-icon name="star" size="lg"&gt;&lt;/app-icon&gt;</code></p>
            <p><strong>Con variante:</strong> <code class="tw-bg-beige-200 tw-px-2 tw-py-1 tw-rounded tw-text-xs">&lt;app-icon name="check" variant="solid"&gt;&lt;/app-icon&gt;</code></p>
            <p><strong>Con color:</strong> <code class="tw-bg-beige-200 tw-px-2 tw-py-1 tw-rounded tw-text-xs">&lt;app-icon name="user" class="tw-text-emerald-green-600"&gt;&lt;/app-icon&gt;</code></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IconsSectionComponent {
  @Output() iconClick = new EventEmitter<string>();

  onIconClick(iconName: string) {
    this.iconClick.emit(iconName);
  }
}
