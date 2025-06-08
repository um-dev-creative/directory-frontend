import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from './badge';
import { Button } from '../buttons/button';

@Component({
  selector: 'app-badge-examples',
  standalone: true,
  imports: [CommonModule, BadgeComponent, Button],
  template: `
    <div class="tw-container tw-mx-auto tw-p-8 tw-max-w-6xl">
      <h1 class="tw-text-3xl tw-font-bold tw-text-emerald-green-700 tw-mb-8">
        Ejemplos de Componente Badge
      </h1>

      <!-- Variantes Básicas -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Variantes Básicas</h2>

        <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mb-6">
          <app-badge variant="default">Default</app-badge>
          <app-badge variant="primary">Primary</app-badge>
          <app-badge variant="secondary">Secondary</app-badge>
          <app-badge variant="success">Success</app-badge>
          <app-badge variant="error">Error</app-badge>
          <app-badge variant="warning">Warning</app-badge>
          <app-badge variant="info">Info</app-badge>
        </div>

        <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Estilo Outline</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-3">
          <app-badge variant="default" [outline]="true">Default</app-badge>
          <app-badge variant="primary" [outline]="true">Primary</app-badge>
          <app-badge variant="secondary" [outline]="true">Secondary</app-badge>
          <app-badge variant="success" [outline]="true">Success</app-badge>
          <app-badge variant="error" [outline]="true">Error</app-badge>
          <app-badge variant="warning" [outline]="true">Warning</app-badge>
          <app-badge variant="info" [outline]="true">Info</app-badge>
        </div>
      </section>

      <!-- Tamaños -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Tamaños</h2>

        <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-4">
          <app-badge variant="primary" size="xs">Extra Small</app-badge>
          <app-badge variant="primary" size="sm">Small</app-badge>
          <app-badge variant="primary" size="md">Medium</app-badge>
          <app-badge variant="primary" size="lg">Large</app-badge>
        </div>
      </section>

      <!-- Formas -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Formas</h2>

        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <app-badge variant="primary" shape="square">Square</app-badge>
          <app-badge variant="primary" shape="rounded">Rounded</app-badge>
          <app-badge variant="primary" shape="pill">Pill</app-badge>
        </div>
      </section>

      <!-- Con Iconos -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Con Iconos</h2>

        <div class="tw-space-y-6">
          <!-- Leading Icons -->
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Iconos al Inicio</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge variant="success" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                Completado
              </app-badge>

              <app-badge variant="error" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                Error
              </app-badge>

              <app-badge variant="warning" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Advertencia
              </app-badge>

              <app-badge variant="info" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                Información
              </app-badge>
            </div>
          </div>

          <!-- Trailing Icons -->
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Iconos al Final</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge variant="primary" [trailingIcon]="true">
                Archivo
                <svg slot="trailing-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </app-badge>

              <app-badge variant="secondary" [trailingIcon]="true">
                Enlaces
                <svg slot="trailing-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
                </svg>
              </app-badge>
            </div>
          </div>
        </div>
      </section>

      <!-- Con Indicadores de Punto -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Con Indicadores de Punto</h2>

        <div class="tw-space-y-4">
          <!-- Status Badges -->
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Estados de Conexión</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-4">
              <app-badge variant="success" [dot]="true">En línea</app-badge>
              <app-badge variant="error" [dot]="true">Ocupado</app-badge>
              <app-badge variant="warning" [dot]="true">Ausente</app-badge>
              <app-badge variant="info" [dot]="true" [pulse]="true">Conectando</app-badge>
            </div>
          </div>

          <!-- Activity Badges -->
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Estados de Actividad</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-4">
              <app-badge variant="primary" [dot]="true">Activo</app-badge>
              <app-badge variant="default" [dot]="true">Inactivo</app-badge>
              <app-badge variant="success" [dot]="true" [pulse]="true">Procesando</app-badge>
            </div>
          </div>
        </div>
      </section>

      <!-- Badges Removibles -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Badges Removibles</h2>

        <div class="tw-space-y-6">
          <!-- Technology Tags -->
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Etiquetas de Tecnología</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              @for (tech of technologies; track tech.id) {
                <app-badge
                  variant="primary"
                  [removable]="true"
                  (remove)="removeTechnology(tech.id)">
                  {{ tech.name }}
                </app-badge>
              }
            </div>
            <app-button
              variant="outline"
              size="sm"
              class="tw-mt-3"
              (buttonClick)="resetTechnologies()">
              Restaurar Etiquetas
            </app-button>
          </div>

          <!-- Category Tags -->
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Categorías</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              @for (category of categories; track category.id) {
                <app-badge
                  variant="secondary"
                  [removable]="true"
                  [outline]="true"
                  (remove)="removeCategory(category.id)">
                  {{ category.name }}
                </app-badge>
              }
            </div>
            <app-button
              variant="outline"
              size="sm"
              class="tw-mt-3"
              (buttonClick)="resetCategories()">
              Restaurar Categorías
            </app-button>
          </div>
        </div>
      </section>

      <!-- Badges Numéricos -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Badges Numéricos</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
          <div class="tw-relative tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200">
            <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-sm tw-text-gray-700">Notificaciones</span>
              <app-badge variant="error" size="xs">{{ notifications.count }}</app-badge>
            </div>
          </div>

          <div class="tw-relative tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200">
            <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-sm tw-text-gray-700">Mensajes</span>
              <app-badge variant="info" size="xs">{{ messages.count }}</app-badge>
            </div>
          </div>

          <div class="tw-relative tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200">
            <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-sm tw-text-gray-700">Tareas</span>
              <app-badge variant="success" size="xs">{{ tasks.count }}</app-badge>
            </div>
          </div>

          <div class="tw-relative tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200">
            <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-sm tw-text-gray-700">Alertas</span>
              <app-badge variant="warning" size="xs" [dot]="true" [pulse]="alerts.hasNew"></app-badge>
            </div>
          </div>
        </div>

        <div class="tw-mt-6 tw-flex tw-gap-3">
          <app-button variant="outline" size="sm" (buttonClick)="incrementNotifications()">
            +1 Notificación
          </app-button>
          <app-button variant="outline" size="sm" (buttonClick)="incrementMessages()">
            +1 Mensaje
          </app-button>
          <app-button variant="outline" size="sm" (buttonClick)="toggleAlerts()">
            Toggle Alertas
          </app-button>
          <app-button variant="outline" size="sm" (buttonClick)="resetCounters()">
            Reset Contadores
          </app-button>
        </div>
      </section>

      <!-- Estados -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Estados</h2>

        <div class="tw-space-y-4">
          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Badge Normal</h3>
            <app-badge variant="primary">Badge Activo</app-badge>
          </div>

          <div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-700 tw-mb-4">Badge Deshabilitado</h3>
            <app-badge variant="primary" [disabled]="true">Badge Deshabilitado</app-badge>
          </div>
        </div>
      </section>

      <!-- Casos de Uso Reales -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Casos de Uso Reales</h2>

        <div class="tw-space-y-8">
          <!-- User Profile -->
          <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-border tw-border-gray-200">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Perfil de Usuario</h3>
            <div class="tw-flex tw-items-center tw-space-x-4">
              <div class="tw-w-12 tw-h-12 tw-bg-emerald-green-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-font-semibold">
                JD
              </div>
              <div class="tw-flex-1">
                <h4 class="tw-font-medium tw-text-gray-900">Juan Pérez</h4>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                  <app-badge variant="success" size="xs" [dot]="true">En línea</app-badge>
                  <app-badge variant="info" size="xs" [outline]="true">Developer</app-badge>
                  <app-badge variant="primary" size="xs" [outline]="true">Admin</app-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Card -->
          <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-border tw-border-gray-200">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Tarjeta de Producto</h3>
            <div class="tw-flex tw-justify-between tw-items-start">
              <div class="tw-flex-1">
                <h4 class="tw-font-medium tw-text-gray-900 tw-mb-2">Angular Framework</h4>
                <p class="tw-text-gray-600 tw-text-sm tw-mb-3">Framework para aplicaciones web</p>
                <div class="tw-flex tw-flex-wrap tw-gap-2">
                  <app-badge variant="primary" size="xs">JavaScript</app-badge>
                  <app-badge variant="secondary" size="xs">TypeScript</app-badge>
                  <app-badge variant="success" size="xs">Framework</app-badge>
                  <app-badge variant="info" size="xs">SPA</app-badge>
                </div>
              </div>
              <app-badge variant="success" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                Disponible
              </app-badge>
            </div>
          </div>

          <!-- Notification List -->
          <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-border tw-border-gray-200">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Lista de Notificaciones</h3>
            <div class="tw-space-y-3">
              <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded">
                <span class="tw-text-sm tw-text-gray-700">Nuevo mensaje recibido</span>
                <div class="tw-flex tw-gap-2">
                  <app-badge variant="info" size="xs">Mensaje</app-badge>
                  <app-badge variant="primary" size="xs" [dot]="true">Nuevo</app-badge>
                </div>
              </div>

              <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded">
                <span class="tw-text-sm tw-text-gray-700">Tarea completada</span>
                <div class="tw-flex tw-gap-2">
                  <app-badge variant="success" size="xs">Tarea</app-badge>
                  <app-badge variant="success" size="xs" [leadingIcon]="true">
                    <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Completado
                  </app-badge>
                </div>
              </div>

              <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded">
                <span class="tw-text-sm tw-text-gray-700">Error en el sistema</span>
                <div class="tw-flex tw-gap-2">
                  <app-badge variant="error" size="xs">Sistema</app-badge>
                  <app-badge variant="error" size="xs" [leadingIcon]="true">
                    <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    Error
                  </app-badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class BadgeExamplesComponent {
  // Technology tags
  technologies = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'Tailwind CSS' },
    { id: 4, name: 'Node.js' },
    { id: 5, name: 'Express' }
  ];

  originalTechnologies = [...this.technologies];

  // Categories
  categories = [
    { id: 1, name: 'Frontend' },
    { id: 2, name: 'Backend' },
    { id: 3, name: 'Database' },
    { id: 4, name: 'DevOps' }
  ];

  originalCategories = [...this.categories];

  // Counters
  notifications = { count: 3 };
  messages = { count: 12 };
  tasks = { count: 5 };
  alerts = { hasNew: true };

  trackByTech(index: number, tech: any): number {
    return tech.id;
  }

  trackByCategory(index: number, category: any): number {
    return category.id;
  }

  removeTechnology(id: number): void {
    this.technologies = this.technologies.filter(tech => tech.id !== id);
  }

  removeCategory(id: number): void {
    this.categories = this.categories.filter(cat => cat.id !== id);
  }

  resetTechnologies(): void {
    this.technologies = [...this.originalTechnologies];
  }

  resetCategories(): void {
    this.categories = [...this.originalCategories];
  }

  incrementNotifications(): void {
    this.notifications.count++;
  }

  incrementMessages(): void {
    this.messages.count++;
  }

  toggleAlerts(): void {
    this.alerts.hasNew = !this.alerts.hasNew;
  }

  resetCounters(): void {
    this.notifications.count = 3;
    this.messages.count = 12;
    this.tasks.count = 5;
    this.alerts.hasNew = true;
  }
}
