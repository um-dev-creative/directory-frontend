import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@app/components/ui';

@Component({
  selector: 'app-badges-section',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Badges</h2>
      <p class="text-beige-700 mb-6">
        Diferentes estilos de badges usando la paleta de colores de marca
      </p>

      <!-- Basic Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges Básicos</h3>
        <div class="flex flex-wrap gap-3">
          <!-- Emerald Green Badges -->
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-100 text-emerald-green-800">
            Activo
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-500 text-white">
            Aprobado
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-700 text-white">
            Verificado
          </span>

          <!-- Coral Badges -->
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
            Pendiente
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-500 text-white">
            Urgente
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-700 text-white">
            Error
          </span>

          <!-- Sky Blue Badges -->
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-100 text-sky-blue-800">
            Info
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-500 text-white">
            Nuevo
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-700 text-white">
            Premium
          </span>

          <!-- Beige Badges -->
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
            Borrador
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-500 text-white">
            Archivado
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-700 text-white">
            Completado
          </span>
        </div>
      </div>

      <!-- Badge Sizes -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
        <div class="flex flex-wrap items-center gap-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-green-100 text-emerald-green-800">
            Pequeño
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-green-500 text-white">
            Mediano
          </span>
          <span class="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-emerald-green-700 text-white">
            Grande
          </span>
        </div>
      </div>

      <!-- Badges with Icons -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges con Iconos</h3>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-100 text-emerald-green-800">
            <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Completado
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
            <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            Advertencia
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-100 text-sky-blue-800">
            <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            Información
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-500 text-white">
            <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            Cancelado
          </span>
        </div>
      </div>

      <!-- Badges with Dots -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges con Indicadores</h3>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-100 text-emerald-green-800">
            <div class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></div>
            En línea
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
            <div class="w-2 h-2 bg-coral-500 rounded-full mr-2"></div>
            Ocupado
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
            <div class="w-2 h-2 bg-beige-500 rounded-full mr-2"></div>
            Ausente
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-100 text-sky-blue-800">
            <div class="w-2 h-2 bg-sky-blue-500 rounded-full mr-2 animate-pulse"></div>
            Conectando
          </span>
        </div>
      </div>

      <!-- Removable Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges Removibles</h3>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-100 text-emerald-green-800">
            Angular
            <button type="button" class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-emerald-green-400 hover:bg-emerald-green-200 hover:text-emerald-green-500 focus:outline-none">
              <svg class="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
              </svg>
            </button>
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-100 text-sky-blue-800">
            TypeScript
            <button type="button" class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-sky-blue-400 hover:bg-sky-blue-200 hover:text-sky-blue-500 focus:outline-none">
              <svg class="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
              </svg>
            </button>
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
            Tailwind CSS
            <button type="button" class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-coral-400 hover:bg-coral-200 hover:text-coral-500 focus:outline-none">
              <svg class="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Number Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges Numéricos</h3>
        <div class="flex flex-wrap gap-6">
          <div class="relative">
            <span class="text-sm text-beige-700">Notificaciones</span>
            <span class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-coral-500 rounded-full">
              3
            </span>
          </div>
          <div class="relative">
            <span class="text-sm text-beige-700">Mensajes</span>
            <span class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-sky-blue-500 rounded-full">
              12
            </span>
          </div>
          <div class="relative">
            <span class="text-sm text-beige-700">Tareas</span>
            <span class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-emerald-green-500 rounded-full">
              5
            </span>
          </div>
          <div class="relative">
            <span class="text-sm text-beige-700">Alertas</span>
            <span class="absolute -top-2 -right-2 inline-flex items-center justify-center w-3 h-3 bg-coral-500 rounded-full">
              <span class="sr-only">Nuevas alertas</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Interactive Badges -->
      <div>
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges Interactivos</h3>
        <div class="flex flex-wrap gap-3">
          <button class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-green-100 text-emerald-green-800 hover:bg-emerald-green-200 transition-colors cursor-pointer">
            Clickeable
          </button>
          <button class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-blue-100 text-sky-blue-800 hover:bg-sky-blue-200 transition-colors cursor-pointer">
            Filtro: Activo
          </button>
          <button class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800 hover:bg-coral-200 transition-colors cursor-pointer">
            Categoría: Urgente
          </button>
          <button class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800 hover:bg-beige-200 transition-colors cursor-pointer">
            Estado: Borrador
          </button>
        </div>
      </div>
    </div>

    <!-- Badge Components -->
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Badge Components</h2>
      <p class="text-beige-700 mb-6">
        Componentes Badge reutilizables con colores de marca y funcionalidades avanzadas
      </p>

      <!-- Basic Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Variantes Básicas</h3>
        <div class="flex flex-wrap gap-3">
          <app-badge>Default</app-badge>
          <app-badge variant="primary">Primary</app-badge>
          <app-badge variant="secondary">Secondary</app-badge>
          <app-badge variant="success">Success</app-badge>
          <app-badge variant="error">Error</app-badge>
          <app-badge variant="warning">Warning</app-badge>
          <app-badge variant="info">Info</app-badge>
        </div>
      </div>

      <!-- Badge Sizes -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
        <div class="flex flex-wrap items-center gap-4">
          <app-badge size="xs" variant="primary">Extra Small</app-badge>
          <app-badge size="sm" variant="primary">Small</app-badge>
          <app-badge size="md" variant="primary">Medium</app-badge>
          <app-badge size="lg" variant="primary">Large</app-badge>
        </div>
      </div>

      <!-- Badge Shapes -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Formas</h3>
        <div class="flex flex-wrap gap-3">
          <app-badge variant="success" shape="rounded">Rounded</app-badge>
          <app-badge variant="info" shape="pill">Pill</app-badge>
          <app-badge variant="warning" shape="square">Square</app-badge>
        </div>
      </div>

      <!-- Outline Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estilos Outline</h3>
        <div class="flex flex-wrap gap-3">
          <app-badge variant="primary" [outline]="true">Primary Outline</app-badge>
          <app-badge variant="success" [outline]="true">Success Outline</app-badge>
          <app-badge variant="error" [outline]="true">Error Outline</app-badge>
          <app-badge variant="warning" [outline]="true">Warning Outline</app-badge>
        </div>
      </div>

      <!-- Badges with Dots -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Indicadores</h3>
        <div class="flex flex-wrap gap-3">
          <app-badge variant="success" label="Online" [dot]="true">Online</app-badge>
          <app-badge variant="error" label="Offline" [dot]="true">Offline</app-badge>
          <app-badge variant="warning" label="Away" [dot]="true">Away</app-badge>
          <app-badge variant="info" label="Connecting" [dot]="true" [pulse]="true">Connecting</app-badge>
        </div>
      </div>

      <!-- Badges with Icons -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Iconos</h3>
        <div class="flex flex-wrap gap-3">
          <app-badge variant="success" [leadingIcon]="true">
            <svg slot="leading-icon" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Verified
          </app-badge>
          <app-badge variant="error" [leadingIcon]="true">
            <svg slot="leading-icon" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Failed
          </app-badge>
          <app-badge variant="warning" [leadingIcon]="true">
            <svg slot="leading-icon" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            Warning
          </app-badge>
          <app-badge variant="info" [leadingIcon]="true">
            <svg slot="leading-icon" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            Information
          </app-badge>
        </div>
      </div>

      <!-- Removable Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges Removibles</h3>
        <div class="flex flex-wrap gap-3">
          <app-badge
            variant="primary"
            [removable]="true"
            (remove)="handleBadgeRemove('Angular')">
            Angular
          </app-badge>
          <app-badge
            variant="secondary"
            [removable]="true"
            (remove)="handleBadgeRemove('TypeScript')">
            TypeScript
          </app-badge>
          <app-badge
            variant="success"
            [removable]="true"
            (remove)="handleBadgeRemove('Tailwind CSS')">
            Tailwind CSS
          </app-badge>
          <app-badge
            variant="info"
            [removable]="true"
            (remove)="handleBadgeRemove('RxJS')">
            RxJS
          </app-badge>
        </div>
      </div>

      <!-- Notification Badges -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Badges de Notificación</h3>
        <div class="flex flex-wrap items-center gap-6">
          <div class="relative inline-block">
            <span class="text-beige-700 pr-4">Mensajes</span>
            <app-badge
              variant="error"
              size="xs"
              shape="pill"
              class="absolute -top-1 -right-1">
              3
            </app-badge>
          </div>
          <div class="relative inline-block">
            <span class="text-beige-700 pr-4">Notificaciones</span>
            <app-badge
              variant="warning"
              size="xs"
              shape="pill"
              class="absolute -top-1 -right-1">
              12
            </app-badge>
          </div>
          <div class="relative inline-block">
            <span class="text-beige-700 pr-4">Tareas</span>
            <app-badge
              variant="success"
              size="xs"
              shape="pill"
              class="absolute -top-1 -right-1">
              99+
            </app-badge>
          </div>
        </div>
      </div>

      <!-- Real-world Examples -->
      <div class="border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Ejemplos de Uso Real</h3>

        <!-- User Status -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-beige-700 mb-3">Estados de Usuario</h4>
          <div class="flex flex-wrap gap-3">
            <app-badge variant="success" [dot]="true">Activo</app-badge>
            <app-badge variant="warning" [dot]="true">Pendiente</app-badge>
            <app-badge variant="error" [dot]="true">Bloqueado</app-badge>
            <app-badge variant="secondary" [dot]="true">Inactivo</app-badge>
          </div>
        </div>

        <!-- Technology Stack -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-beige-700 mb-3">Stack Tecnológico</h4>
          <div class="flex flex-wrap gap-2">
            <app-badge variant="primary" size="sm">Frontend</app-badge>
            <app-badge variant="secondary" size="sm">Backend</app-badge>
            <app-badge variant="success" size="sm">Full-Stack</app-badge>
            <app-badge variant="info" size="sm">DevOps</app-badge>
            <app-badge variant="warning" size="sm">Mobile</app-badge>
          </div>
        </div>

        <!-- Priority Levels -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-beige-700 mb-3">Niveles de Prioridad</h4>
          <div class="flex flex-wrap gap-3">
            <app-badge variant="error" [pulse]="true">Crítico</app-badge>
            <app-badge variant="warning">Alto</app-badge>
            <app-badge variant="info">Medio</app-badge>
            <app-badge variant="secondary">Bajo</app-badge>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BadgesSectionComponent {
  handleBadgeRemove(badgeName: string) {
    console.log(`Badge removed: ${badgeName}`);
    // Here you can implement the actual removal logic
    // For example, remove from an array or update state
  }
}
