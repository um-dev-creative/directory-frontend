import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertExamplesComponent } from '../../ui/alerts/alert-examples.component';

@Component({
  selector: 'app-alerts-section',
  standalone: true,
  imports: [CommonModule, AlertExamplesComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-emerald-green-700 mb-2">
          Componente Alert
        </h2>
        <p class="text-beige-700 leading-relaxed">
          El componente Alert proporciona mensajes de retroalimentación contextual para
          acciones típicas del usuario con un puñado de mensajes de alerta disponibles
          y flexibles. Soporta diferentes variantes, tamaños, acciones y estilos de borde.
        </p>
      </div>

      <!-- Features Overview -->
      <div class="bg-beige-50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Características Principales
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-beige-700">
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            4 variantes: info, success, warning, error
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            3 tamaños: sm, md, lg
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Alertas desechables
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Botones de acción integrados
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Contenido personalizable
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Bordes opcionales para énfasis
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Ejemplos de Uso
        </h3>
        <div class="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-700 overflow-x-auto">
          <div class="mb-2">
            <span class="text-blue-600">&lt;app-alert</span><br/>
            <span class="ml-2 text-green-600">variant="success"</span><br/>
            <span class="ml-2 text-green-600">title="¡Éxito!"</span><br/>
            <span class="ml-2 text-green-600">description="Operación completada."</span><br/>
            <span class="ml-2 text-green-600">[dismissible]="true"</span><br/>
            <span class="ml-2 text-green-600">(dismiss)="onDismiss()"</span><br/>
            <span class="text-blue-600">&gt;&lt;/app-alert&gt;</span>
          </div>
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Ejemplos Interactivos
        </h3>
        <div class="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            (click)="onShowInfoAlert()"
          >
            Mostrar Info
          </button>
          <button
            type="button"
            class="bg-emerald-green-500 hover:bg-emerald-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            (click)="onShowSuccessAlert()"
          >
            Mostrar Éxito
          </button>
          <button
            type="button"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            (click)="onShowWarningAlert()"
          >
            Mostrar Advertencia
          </button>
          <button
            type="button"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
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
