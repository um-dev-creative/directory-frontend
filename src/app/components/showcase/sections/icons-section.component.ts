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
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Iconos</h2>
      <p class="text-beige-700 mb-6">
        Biblioteca completa de iconos Heroicons con diferentes tamaños y estilos
      </p>

      <!-- Tamaños de Iconos -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
        <div class="flex items-center space-x-8">
          <div class="text-center">
            <app-icon name="heart" size="xs" class="text-emerald-green-600"></app-icon>
            <p class="text-xs text-beige-600 mt-2">XS (16px)</p>
          </div>
          <div class="text-center">
            <app-icon name="heart" size="sm" class="text-emerald-green-600"></app-icon>
            <p class="text-xs text-beige-600 mt-2">SM (20px)</p>
          </div>
          <div class="text-center">
            <app-icon name="heart" size="md" class="text-emerald-green-600"></app-icon>
            <p class="text-xs text-beige-600 mt-2">MD (24px)</p>
          </div>
          <div class="text-center">
            <app-icon name="heart" size="lg" class="text-emerald-green-600"></app-icon>
            <p class="text-xs text-beige-600 mt-2">LG (32px)</p>
          </div>
          <div class="text-center">
            <app-icon name="heart" size="xl" class="text-emerald-green-600"></app-icon>
            <p class="text-xs text-beige-600 mt-2">XL (48px)</p>
          </div>
        </div>
      </div>

      <!-- Variantes de Iconos -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Variantes</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-beige-50 rounded-lg p-4 text-center">
            <app-icon name="star" variant="outline" size="lg" class="text-emerald-green-600 mb-3"></app-icon>
            <h4 class="font-semibold text-beige-800 mb-1">Outline</h4>
            <p class="text-sm text-beige-600">Contorno, ideal para interfaces limpias</p>
          </div>
          <div class="bg-beige-50 rounded-lg p-4 text-center">
            <app-icon name="star" variant="solid" size="lg" class="text-emerald-green-600 mb-3"></app-icon>
            <h4 class="font-semibold text-beige-800 mb-1">Solid</h4>
            <p class="text-sm text-beige-600">Sólido, perfecto para destacar elementos</p>
          </div>
          <div class="bg-beige-50 rounded-lg p-4 text-center">
            <app-icon name="star" variant="solid" size="lg" class="text-emerald-green-600 mb-3"></app-icon>
            <h4 class="font-semibold text-beige-800 mb-1">Solid</h4>
            <p class="text-sm text-beige-600">Relleno sólido, más visualmente prominente</p>
          </div>
        </div>
      </div>

      <!-- Colores de Marca -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Colores de Marca</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="text-center">
            <app-icon name="shield-check" size="lg" class="text-emerald-green-600 mb-2"></app-icon>
            <app-badge variant="primary" size="sm">Emerald Green</app-badge>
          </div>
          <div class="text-center">
            <app-icon name="heart" size="lg" class="text-coral-600 mb-2"></app-icon>
            <app-badge variant="secondary" size="sm">Coral</app-badge>
          </div>
          <div class="text-center">
            <app-icon name="information-circle" size="lg" class="text-sky-blue-600 mb-2"></app-icon>
            <app-badge variant="info" size="sm">Sky Blue</app-badge>
          </div>
          <div class="text-center">
            <app-icon name="sun" size="lg" class="text-beige-600 mb-2"></app-icon>
            <app-badge variant="secondary" size="sm">Beige</app-badge>
          </div>
          <div class="text-center">
            <app-icon name="check-circle" size="lg" class="text-success-600 mb-2"></app-icon>
            <app-badge variant="success" size="sm">Success</app-badge>
          </div>
        </div>
      </div>

      <!-- Iconos Comunes -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Iconos Comunes</h3>
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Home">
            <app-icon name="home" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">home</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="User">
            <app-icon name="user" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">user</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Settings">
            <app-icon name="cog-6-tooth" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">settings</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Search">
            <app-icon name="magnifying-glass" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">search</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Bell">
            <app-icon name="bell" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">bell</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Mail">
            <app-icon name="envelope" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">mail</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Calendar">
            <app-icon name="calendar-days" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">calendar</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Chart">
            <app-icon name="chart-bar" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">chart</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Lock">
            <app-icon name="lock-closed" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">lock</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Eye">
            <app-icon name="eye" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">eye</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Download">
            <app-icon name="arrow-down-tray" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">download</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Upload">
            <app-icon name="arrow-up-tray" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">upload</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Share">
            <app-icon name="share" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">share</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Plus">
            <app-icon name="plus" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">plus</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Minus">
            <app-icon name="minus" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">minus</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-beige-50 hover:bg-beige-100 transition-colors cursor-pointer" title="Close">
            <app-icon name="x-mark" size="md" class="text-beige-700 mb-1"></app-icon>
            <p class="text-xs text-beige-600">close</p>
          </div>
        </div>
      </div>

      <!-- Iconos en Contexto -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Iconos en Contexto</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Botones con iconos -->
          <div class="bg-beige-50 rounded-lg p-4">
            <h4 class="font-semibold text-beige-800 mb-3">En Botones</h4>
            <div class="space-y-3">
              <app-button variant="primary" class="w-full">
                <app-icon name="plus" size="sm" class="mr-2 text-white"></app-icon>
                Crear Nuevo
              </app-button>
              <app-button variant="secondary" class="w-full">
                <app-icon name="arrow-down-tray" size="sm" class="mr-2"></app-icon>
                Descargar
              </app-button>
              <app-button variant="outline" class="w-full">
                <app-icon name="share" size="sm" class="mr-2"></app-icon>
                Compartir
              </app-button>
            </div>
          </div>

          <!-- Alertas con iconos -->
          <div class="bg-beige-50 rounded-lg p-4">
            <h4 class="font-semibold text-beige-800 mb-3">En Alertas</h4>
            <div class="space-y-3">
              <div class="bg-success-50 border border-success-200 rounded-lg p-3 flex items-center">
                <app-icon name="check-circle" size="sm" class="text-success-600 mr-2"></app-icon>
                <span class="text-sm text-success-800">Operación exitosa</span>
              </div>
              <div class="bg-alert-50 border border-alert-200 rounded-lg p-3 flex items-center">
                <app-icon name="exclamation-triangle" size="sm" class="text-alert-600 mr-2"></app-icon>
                <span class="text-sm text-alert-800">Error detectado</span>
              </div>
              <div class="bg-sky-blue-50 border border-sky-blue-200 rounded-lg p-3 flex items-center">
                <app-icon name="information-circle" size="sm" class="text-sky-blue-600 mr-2"></app-icon>
                <span class="text-sm text-sky-blue-800">Información importante</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estados Interactivos -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estados Interactivos</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button class="group bg-white border border-beige-200 rounded-lg p-4 text-center hover:border-emerald-green-300 hover:bg-emerald-green-50 transition-all">
            <app-icon name="heart" size="lg" class="text-beige-400 group-hover:text-emerald-green-600 transition-colors mb-2"></app-icon>
            <p class="text-sm text-beige-700 group-hover:text-emerald-green-700">Hover me</p>
          </button>

          <button class="group bg-white border border-beige-200 rounded-lg p-4 text-center hover:border-coral-300 hover:bg-coral-50 transition-all">
            <app-icon name="star" size="lg" class="text-beige-400 group-hover:text-coral-600 transition-colors mb-2"></app-icon>
            <p class="text-sm text-beige-700 group-hover:text-coral-700">Star this</p>
          </button>

          <button class="group bg-white border border-beige-200 rounded-lg p-4 text-center hover:border-sky-blue-300 hover:bg-sky-blue-50 transition-all">
            <app-icon name="bookmark" size="lg" class="text-beige-400 group-hover:text-sky-blue-600 transition-colors mb-2"></app-icon>
            <p class="text-sm text-beige-700 group-hover:text-sky-blue-700">Save</p>
          </button>

          <button class="group bg-white border border-beige-200 rounded-lg p-4 text-center hover:border-success-300 hover:bg-success-50 transition-all">
            <app-icon name="check" size="lg" class="text-beige-400 group-hover:text-success-600 transition-colors mb-2"></app-icon>
            <p class="text-sm text-beige-700 group-hover:text-success-700">Complete</p>
          </button>
        </div>
      </div>

      <!-- Información de Uso -->
      <div class="border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-beige-700 mb-4">Cómo Usar</h3>
        <div class="bg-beige-50 rounded-lg p-4">
          <div class="space-y-2 text-sm text-beige-700">
            <p><strong>Básico:</strong> <code class="bg-beige-200 px-2 py-1 rounded text-xs">&lt;app-icon name="heart"&gt;&lt;/app-icon&gt;</code></p>
            <p><strong>Con tamaño:</strong> <code class="bg-beige-200 px-2 py-1 rounded text-xs">&lt;app-icon name="star" size="lg"&gt;&lt;/app-icon&gt;</code></p>
            <p><strong>Con variante:</strong> <code class="bg-beige-200 px-2 py-1 rounded text-xs">&lt;app-icon name="check" variant="solid"&gt;&lt;/app-icon&gt;</code></p>
            <p><strong>Con color:</strong> <code class="bg-beige-200 px-2 py-1 rounded text-xs">&lt;app-icon name="user" class="text-emerald-green-600"&gt;&lt;/app-icon&gt;</code></p>
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
