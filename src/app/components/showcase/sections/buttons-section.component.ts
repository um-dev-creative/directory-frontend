import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Button } from '@app/components/ui';

@Component({
  selector: 'app-buttons-section',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Botones</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        CComponente Button reutilizable con colores de marca
      </p>

      <!-- Variantes Principales -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes Principales</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <app-button variant="primary">
            Botón Principal
          </app-button>
          <app-button variant="secondary">
            Botón Secundario
          </app-button>
          <app-button variant="alert">
            Botón Alerta
          </app-button>
          <app-button variant="success">
            Botón Éxito
          </app-button>
          <app-button variant="info">
            Botón Info
          </app-button>
        </div>
      </div>

      <!-- Variantes de Estilo -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estilos Alternativos</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <app-button variant="outline">
            Botón Outline
          </app-button>
          <app-button variant="solid-outline">
            Solid Outline
          </app-button>
          <app-button variant="ghost">
            Botón Ghost
          </app-button>
        </div>
      </div>

      <!-- Tamaños -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
        <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-4">
          <app-button variant="primary" size="sm">
            Pequeño
          </app-button>
          <app-button variant="primary" size="md">
            Mediano
          </app-button>
          <app-button variant="primary" size="lg">
            Grande
          </app-button>
        </div>
      </div>

      <!-- Estados -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estados</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <app-button variant="primary" [loading]="true">
            Cargando...
          </app-button>
          <app-button variant="secondary" [disabled]="true">
            Deshabilitado
          </app-button>
          <app-button variant="primary" [fullWidth]="false">
            Ancho Normal
          </app-button>
        </div>
      </div>

      <!-- Botones con Eventos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Interactivos</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <app-button
            variant="primary"
            (buttonClick)="onShowSuccessNotification()"
          >
            Mostrar Notificación
          </app-button>
          <app-button
            variant="secondary"
            (buttonClick)="onShowBasicLoading()"
            [loading]="(isBasicLoading$ | async) || false"
          >
            Test Loading
          </app-button>
          <app-button
            variant="info"
            [fullWidth]="true"
            (buttonClick)="onShowInfoNotification()"
          >
            Botón Info
          </app-button>
        </div>
      </div>

      <!-- Botones Legacy (comparación) -->
      <div class="tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Botones Legacy (antes)</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <button class="btn-primary">
            Legacy Principal
          </button>
          <button class="btn-secondary">
            Legacy Secundario
          </button>
          <button class="btn-outline">
            Legacy Outline
          </button>
          <button class="tw-bg-sky-blue-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-sky-blue-600 tw-transition-all">
            Legacy Info
          </button>
        </div>
      </div>
    </div>
  `
})
export class ButtonsSectionComponent {
  @Input() isBasicLoading$?: Observable<boolean>;

  @Output() showSuccessNotification = new EventEmitter<void>();
  @Output() showBasicLoading = new EventEmitter<void>();
  @Output() showInfoNotification = new EventEmitter<void>();

  onShowSuccessNotification() {
    this.showSuccessNotification.emit();
  }

  onShowBasicLoading() {
    this.showBasicLoading.emit();
  }

  onShowInfoNotification() {
    this.showInfoNotification.emit();
  }
}
