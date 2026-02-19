import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert';

@Component({
  selector: 'app-alert-examples',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  template: `
    <div class="space-y-8">
      <!-- Basic Alerts -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Alertas Básicas
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="info"
            title="Información"
            description="Esta es una alerta informativa básica."
          ></app-alert>

          <app-alert
            variant="success"
            title="Éxito"
            description="¡Operación completada exitosamente!"
          ></app-alert>

          <app-alert
            variant="warning"
            title="Advertencia"
            description="Por favor revisa la información antes de continuar."
          ></app-alert>

          <app-alert
            variant="error"
            title="Error"
            description="Ha ocurrido un error. Intenta nuevamente."
          ></app-alert>
        </div>
      </div>

      <!-- Dismissible Alerts -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Alertas Desechables
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="info"
            title="Información Desechable"
            description="Puedes cerrar esta alerta haciendo clic en la X."
            [dismissible]="true"
            (dismiss)="onAlertDismiss('info')"
          ></app-alert>

          <app-alert
            variant="success"
            title="Éxito Desechable"
            description="Esta alerta se puede cerrar manualmente."
            [dismissible]="true"
            (dismiss)="onAlertDismiss('success')"
          ></app-alert>
        </div>
      </div>

      <!-- Alerts with Actions -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Alertas con Acciones
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="warning"
            title="Confirmación Requerida"
            description="Esta acción requiere tu confirmación para continuar."
            actionText="Confirmar"
            [dismissible]="true"
            (action)="onAlertAction('confirm')"
            (dismiss)="onAlertDismiss('warning-action')"
          ></app-alert>

          <app-alert
            variant="error"
            title="Error de Conexión"
            description="No se pudo conectar al servidor. ¿Deseas intentar nuevamente?"
            actionText="Reintentar"
            [dismissible]="true"
            (action)="onAlertAction('retry')"
            (dismiss)="onAlertDismiss('error-action')"
          ></app-alert>
        </div>
      </div>

      <!-- Bordered Alerts -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Alertas con Borde
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="info"
            title="Información Destacada"
            description="Esta alerta tiene un borde lateral para mayor énfasis."
            [bordered]="true"
          ></app-alert>

          <app-alert
            variant="success"
            title="Proceso Completado"
            description="El proceso se ha completado correctamente."
            [bordered]="true"
            [dismissible]="true"
            (dismiss)="onAlertDismiss('bordered-success')"
          ></app-alert>
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Diferentes Tamaños
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="info"
            size="sm"
            title="Alerta Pequeña"
            description="Esta es una alerta de tamaño pequeño."
          ></app-alert>

          <app-alert
            variant="success"
            size="md"
            title="Alerta Mediana"
            description="Esta es una alerta de tamaño mediano (por defecto)."
          ></app-alert>

          <app-alert
            variant="warning"
            size="lg"
            title="Alerta Grande"
            description="Esta es una alerta de tamaño grande con más espacio interno."
          ></app-alert>
        </div>
      </div>

      <!-- Custom Content -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Contenido Personalizado
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="info"
            title="Alerta con Contenido Personalizado"
            [actions]="true"
            [dismissible]="true"
            (dismiss)="onAlertDismiss('custom')"
          >
            <p class="mb-3">
              Esta alerta contiene contenido personalizado con texto enriquecido y múltiples párrafos.
            </p>
            <p class="mb-3">
              Puedes incluir <strong>texto en negrita</strong>, <em>cursiva</em>,
              y otros elementos HTML dentro del contenido de la alerta.
            </p>

            <div slot="actions" class="flex space-x-3">
              <button
                type="button"
                class="text-sm font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-md px-3 py-2 transition-colors duration-200"
                (click)="onAlertAction('primary')"
              >
                Acción Principal
              </button>
              <button
                type="button"
                class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                (click)="onAlertAction('secondary')"
              >
                Acción Secundaria
              </button>
            </div>
          </app-alert>
        </div>
      </div>

      <!-- Alert without Title -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Alertas sin Título
        </h3>
        <div class="space-y-4">
          <app-alert
            variant="success"
            description="Esta alerta solo tiene descripción, sin título."
            [dismissible]="true"
            (dismiss)="onAlertDismiss('no-title')"
          ></app-alert>

          <app-alert
            variant="warning"
            [dismissible]="true"
            (dismiss)="onAlertDismiss('content-only')"
          >
            Esta alerta solo tiene contenido personalizado, sin título ni descripción.
          </app-alert>
        </div>
      </div>
    </div>
  `
})
export class AlertExamplesComponent {
  onAlertDismiss(alertType: string): void {
    console.log(`Alert dismissed: ${alertType}`);
  }

  onAlertAction(actionType: string): void {
    console.log(`Alert action triggered: ${actionType}`);
  }
}
