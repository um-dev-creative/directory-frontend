import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '@app/components/ui';

@Component({
  selector: 'app-notifications-section',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Notificaciones</h2>
      <p class="text-beige-700 mb-6">
        Sistema de notificaciones con diferentes tipos y configuraciones
      </p>

      <!-- Tipos de Notificaciones -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tipos de Notificaciones</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <app-button variant="success" (buttonClick)="onShowSuccess()">
            Mostrar Éxito
          </app-button>
          <app-button variant="alert" (buttonClick)="onShowError()">
            Mostrar Error
          </app-button>
          <app-button variant="info" (buttonClick)="onShowInfo()">
            Mostrar Info
          </app-button>
          <app-button variant="secondary" (buttonClick)="onShowWarning()">
            Mostrar Advertencia
          </app-button>
          <app-button variant="alert" (buttonClick)="onShowErrorWithReport()">
            Error con Reporte
          </app-button>
          <app-button variant="alert-outline" (buttonClick)="onShowErrorWithExternalLink()">
            Error con Enlace
          </app-button>
        </div>
      </div>

      <!-- Ejemplos Visuales de Notificaciones -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Ejemplos Visuales</h3>
        <div class="space-y-4">
          <!-- Notificación de Éxito -->
          <div class="bg-success-50 border border-success-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="shrink-0">
                <svg class="h-5 w-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-success-800">¡Operación completada exitosamente!</h4>
                <p class="text-sm text-success-700 mt-1">Los datos se guardaron correctamente en el sistema.</p>
              </div>
              <div class="ml-auto pl-3">
                <button class="text-success-600 hover:text-success-500">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Error -->
          <div class="bg-alert-50 border border-alert-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="shrink-0">
                <svg class="h-5 w-5 text-alert-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-alert-800">Error en la operación</h4>
                <p class="text-sm text-alert-700 mt-1">No se pudo completar la acción. Verifica los datos e inténtalo de nuevo.</p>
              </div>
              <div class="ml-auto pl-3">
                <button class="text-alert-600 hover:text-alert-500">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Error con Reporte -->
          <div class="bg-coral-50 border border-coral-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="shrink-0">
                <svg class="h-5 w-5 text-coral-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-coral-800">Error crítico del sistema</h4>
                <p class="text-sm text-coral-700 mt-1">No se pudo completar la operación. Si el problema persiste, usa el enlace para reportarlo.</p>
              </div>
              <div class="ml-auto flex items-center gap-2">
                <button class="text-xs font-medium underline hover:no-underline text-coral-600 hover:text-coral-700 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  Reportar error
                </button>
                <button class="text-coral-600 hover:text-coral-500">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Información -->
          <div class="bg-sky-blue-50 border border-sky-blue-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="shrink-0">
                <svg class="h-5 w-5 text-sky-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-sky-blue-800">Nueva actualización disponible</h4>
                <p class="text-sm text-sky-blue-700 mt-1">Hay nuevas funciones disponibles. Actualiza para acceder a ellas.</p>
              </div>
              <div class="ml-auto pl-3">
                <button class="text-sky-blue-600 hover:text-sky-blue-500">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Advertencia -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="shrink-0">
                <svg class="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-yellow-800">Advertencia importante</h4>
                <p class="text-sm text-yellow-700 mt-1">Revisa la información antes de continuar. Algunos campos pueden requerir atención.</p>
              </div>
              <div class="ml-auto pl-3">
                <button class="text-yellow-600 hover:text-yellow-500">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificaciones Avanzadas -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Notificaciones Avanzadas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-button variant="primary" (buttonClick)="onShowWithAction()">
            Con Botón de Acción
          </app-button>
          <app-button variant="secondary" (buttonClick)="onShowPersistent()">
            Persistente
          </app-button>
          <app-button variant="outline" (buttonClick)="onShowCustomPosition()">
            Posición Personalizada
          </app-button>
          <!-- Botón para cerrar todas las notificaciones -->
          <app-button variant="alert" (buttonClick)="onDismissAll()">
            Cerrar Todas
          </app-button>
        </div>
      </div>

      <!-- Toast Notifications -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Toast Notifications</h3>
        <p class="text-beige-600 mb-4">
          Las notificaciones tipo toast aparecen temporalmente en la esquina de la pantalla.
        </p>
        <div class="space-y-3">
          <!-- Toast Example -->
          @if (isToastVisible) {
            <div class="fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white shadow-lg rounded-lg border border-beige-200 p-4 opacity-90">
              <div class="flex items-center">
                <div class="shrink-0">
                  <svg class="h-5 w-5 text-emerald-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-beige-900">Toast de ejemplo</p>
                  <p class="text-xs text-beige-600 mt-1">Esta es una notificación toast.</p>
                </div>
                <button class="ml-4 text-beige-400 hover:text-beige-600" (click)="onCloseToast()">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          }

          <!-- Botón para mostrar el toast nuevamente -->
          @if (!isToastVisible) {
            <div class="flex justify-center mt-4">
              <app-button variant="primary" (buttonClick)="onShowToast()">
                Mostrar Toast de Ejemplo
              </app-button>
            </div>
          }
        </div>
      </div>

      <!-- Configuraciones -->
      <div class="border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-beige-700 mb-4">Configuraciones Disponibles</h3>
        <div class="bg-beige-50 rounded-lg p-4">
          <ul class="text-sm text-beige-700 space-y-2">
            <li><strong>Duración:</strong> Tiempo que permanece visible la notificación</li>
            <li><strong>Posición:</strong> top-right, top-left, bottom-right, bottom-left</li>
            <li><strong>Tipo:</strong> success, error, info, warning</li>
            <li><strong>Persistente:</strong> Requiere acción del usuario para cerrar</li>
            <li><strong>Con Acción:</strong> Incluye botones para acciones adicionales</li>
            <li><strong>Reporte de Error:</strong> Para errores, incluye enlace para reportar el problema</li>
            <li><strong>Auto-close:</strong> Se cierra automáticamente después del tiempo especificado</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Legacy Notifications Section (for comparison) -->
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Notificaciones Legacy (Comparación)</h2>
      <p class="text-beige-700 mb-6">
        Prueba el sistema de notificaciones con los colores de marca
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Success Notification -->
        <div class="text-center">
          <button
            (click)="showSuccessNotification()"
            class="w-full bg-emerald-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-green-600 transition-all shadow-sm"
          >
            ✓ Éxito
          </button>
          <p class="text-sm text-beige-600 mt-2">Notificación de éxito</p>
        </div>

        <!-- Error Notification -->
        <div class="text-center">
          <button
            (click)="showErrorNotification()"
            class="w-full bg-coral-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-coral-600 transition-all shadow-sm"
          >
            ✕ Error
          </button>
          <p class="text-sm text-beige-600 mt-2">Notificación de error</p>
        </div>

        <!-- Warning Notification -->
        <div class="text-center">
          <button
            (click)="showWarningNotification()"
            class="w-full bg-beige-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-beige-600 transition-all shadow-sm"
          >
            ⚠ Advertencia
          </button>
          <p class="text-sm text-beige-600 mt-2">Notificación de advertencia</p>
        </div>

        <!-- Info Notification -->
        <div class="text-center">
          <button
            (click)="showInfoNotification()"
            class="w-full bg-sky-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-sky-blue-600 transition-all shadow-sm"
          >
            ℹ Información
          </button>
          <p class="text-sm text-beige-600 mt-2">Notificación informativa</p>
        </div>
      </div>

      <!-- Advanced Notifications -->
      <div class="mt-8 border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Notificaciones Avanzadas</h3>
        <div class="flex flex-wrap gap-4">
          <button
            (click)="showNotificationWithAction()"
            class="btn-outline"
          >
            Con Acción Legacy
          </button>
          <button
            (click)="showPersistentNotification()"
            class="btn-secondary"
          >
            Persistente
          </button>
          <button
            (click)="showCustomPositionNotification()"
            class="bg-beige-500 text-white px-4 py-2 rounded-lg hover:bg-beige-600 transition-all"
          >
            Posición Personalizada
          </button>
          <button
            (click)="dismissAllNotifications()"
            class="bg-coral-100 text-coral-700 px-4 py-2 rounded-lg hover:bg-coral-200 transition-all border border-coral-300"
          >
            Cerrar Todas Legacy
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationsSectionComponent {
  @Output() showSuccess = new EventEmitter<void>();
  @Output() showError = new EventEmitter<void>();
  @Output() showErrorWithReport = new EventEmitter<void>();
  @Output() showErrorWithExternalLink = new EventEmitter<void>();
  @Output() showInfo = new EventEmitter<void>();
  @Output() showWarning = new EventEmitter<void>();
  @Output() showWithAction = new EventEmitter<void>();
  @Output() showPersistent = new EventEmitter<void>();
  @Output() showCustomPosition = new EventEmitter<void>();
  @Output() dismissAll = new EventEmitter<void>();

  // Legacy notification events
  @Output() successNotification = new EventEmitter<void>();
  @Output() errorNotification = new EventEmitter<void>();
  @Output() warningNotification = new EventEmitter<void>();
  @Output() infoNotification = new EventEmitter<void>();
  @Output() notificationWithAction = new EventEmitter<void>();
  @Output() persistentNotification = new EventEmitter<void>();
  @Output() customPositionNotification = new EventEmitter<void>();

  // Control para mostrar/ocultar el toast de ejemplo
  isToastVisible = true;

  onShowSuccess() {
    this.showSuccess.emit();
  }

  onShowError() {
    this.showError.emit();
  }

  onShowErrorWithReport() {
    this.showErrorWithReport.emit();
  }

  onShowErrorWithExternalLink() {
    this.showErrorWithExternalLink.emit();
  }

  onShowInfo() {
    this.showInfo.emit();
  }

  onShowWarning() {
    this.showWarning.emit();
  }

  onShowWithAction() {
    this.showWithAction.emit();
  }

  onShowPersistent() {
    this.showPersistent.emit();
  }

  onShowCustomPosition() {
    this.showCustomPosition.emit();
  }

  onDismissAll() {
    this.dismissAll.emit(); // Emitir evento para cerrar todas las notificaciones
  }

  onCloseToast() {
    this.isToastVisible = false;
  }

  onShowToast() {
    this.isToastVisible = true;
  }

  // Legacy notification methods
  showSuccessNotification() {
    this.successNotification.emit();
  }

  showErrorNotification() {
    this.errorNotification.emit();
  }

  showWarningNotification() {
    this.warningNotification.emit();
  }

  showInfoNotification() {
    this.infoNotification.emit();
  }

  showNotificationWithAction() {
    this.notificationWithAction.emit();
  }

  showPersistentNotification() {
    this.persistentNotification.emit();
  }

  showCustomPositionNotification() {
    this.customPositionNotification.emit();
  }

  dismissAllNotifications() {
    this.dismissAll.emit();
  }
}
