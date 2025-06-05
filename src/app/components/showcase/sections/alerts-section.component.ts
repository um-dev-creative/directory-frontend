import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertExamplesComponent } from '../../ui/alerts/alert-examples.component';

@Component({
  selector: 'app-alerts-section',
  standalone: true,
  imports: [CommonModule, AlertExamplesComponent],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
      <div class="tw-mb-6">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-2">
          Componente Alert
        </h2>
        <p class="tw-text-beige-700 tw-leading-relaxed">
          El componente Alert proporciona mensajes de retroalimentación contextual para
          acciones típicas del usuario con un puñado de mensajes de alerta disponibles
          y flexibles. Soporta diferentes variantes, tamaños, acciones y estilos de borde.
        </p>
      </div>

      <!-- Features Overview -->
      <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4 tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Características Principales
        </h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-text-sm tw-text-beige-700">
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            4 variantes: info, success, warning, error
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            3 tamaños: sm, md, lg
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Alertas desechables
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Botones de acción integrados
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Contenido personalizable
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Bordes opcionales para énfasis
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Ejemplos de Uso
        </h3>
        <div class="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-text-sm tw-font-mono tw-text-gray-700 tw-overflow-x-auto">
          <div class="tw-mb-2">
            <span class="tw-text-blue-600">&lt;app-alert</span><br/>
            <span class="tw-ml-2 tw-text-green-600">variant="success"</span><br/>
            <span class="tw-ml-2 tw-text-green-600">title="¡Éxito!"</span><br/>
            <span class="tw-ml-2 tw-text-green-600">description="Operación completada."</span><br/>
            <span class="tw-ml-2 tw-text-green-600">[dismissible]="true"</span><br/>
            <span class="tw-ml-2 tw-text-green-600">(dismiss)="onDismiss()"</span><br/>
            <span class="tw-text-blue-600">&gt;&lt;/app-alert&gt;</span>
          </div>
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Ejemplos Interactivos
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mb-4">
          <button
            type="button"
            class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowInfoAlert()"
          >
            Mostrar Info
          </button>
          <button
            type="button"
            class="tw-bg-emerald-green-500 hover:tw-bg-emerald-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowSuccessAlert()"
          >
            Mostrar Éxito
          </button>
          <button
            type="button"
            class="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowWarningAlert()"
          >
            Mostrar Advertencia
          </button>
          <button
            type="button"
            class="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowErrorAlert()"
          >
            Mostrar Error
          </button>
        </div>
      </div>

      <!-- Examples -->
      <app-alert-examples></app-alert-examples>
    </div>
  `
})
export class AlertsSectionComponent {
  @Output() showInfoAlert = new EventEmitter<void>();
  @Output() showSuccessAlert = new EventEmitter<void>();
  @Output() showWarningAlert = new EventEmitter<void>();
  @Output() showErrorAlert = new EventEmitter<void>();

  onShowInfoAlert(): void {
    this.showInfoAlert.emit();
  }

  onShowSuccessAlert(): void {
    this.showSuccessAlert.emit();
  }

  onShowWarningAlert(): void {
    this.showWarningAlert.emit();
  }

  onShowErrorAlert(): void {
    this.showErrorAlert.emit();
  }
}
