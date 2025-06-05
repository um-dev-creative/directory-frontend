import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '@app/components/ui';

@Component({
  selector: 'app-notifications-section',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Notificaciones</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Sistema de notificaciones con diferentes tipos y configuraciones
      </p>

      <!-- Tipos de Notificaciones -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tipos de Notificaciones</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
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
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Ejemplos Visuales</h3>
        <div class="tw-space-y-4">
          <!-- Notificación de Éxito -->
          <div class="tw-bg-success-50 tw-border tw-border-success-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <div class="tw-flex-shrink-0">
                <svg class="tw-h-5 tw-w-5 tw-text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="tw-ml-3">
                <h4 class="tw-text-sm tw-font-medium tw-text-success-800">¡Operación completada exitosamente!</h4>
                <p class="tw-text-sm tw-text-success-700 tw-mt-1">Los datos se guardaron correctamente en el sistema.</p>
              </div>
              <div class="tw-ml-auto tw-pl-3">
                <button class="tw-text-success-600 hover:tw-text-success-500">
                  <svg class="tw-h-4 tw-w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Error -->
          <div class="tw-bg-alert-50 tw-border tw-border-alert-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <div class="tw-flex-shrink-0">
                <svg class="tw-h-5 tw-w-5 tw-text-alert-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="tw-ml-3">
                <h4 class="tw-text-sm tw-font-medium tw-text-alert-800">Error en la operación</h4>
                <p class="tw-text-sm tw-text-alert-700 tw-mt-1">No se pudo completar la acción. Verifica los datos e inténtalo de nuevo.</p>
              </div>
              <div class="tw-ml-auto tw-pl-3">
                <button class="tw-text-alert-600 hover:tw-text-alert-500">
                  <svg class="tw-h-4 tw-w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Error con Reporte -->
          <div class="tw-bg-coral-50 tw-border tw-border-coral-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <div class="tw-flex-shrink-0">
                <svg class="tw-h-5 tw-w-5 tw-text-coral-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="tw-ml-3 tw-flex-1">
                <h4 class="tw-text-sm tw-font-medium tw-text-coral-800">Error crítico del sistema</h4>
                <p class="tw-text-sm tw-text-coral-700 tw-mt-1">No se pudo completar la operación. Si el problema persiste, usa el enlace para reportarlo.</p>
              </div>
              <div class="tw-ml-auto tw-flex tw-items-center tw-gap-2">
                <button class="tw-text-xs tw-font-medium tw-underline hover:tw-no-underline tw-text-coral-600 hover:tw-text-coral-700 tw-flex tw-items-center tw-gap-1">
                  <svg class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  Reportar error
                </button>
                <button class="tw-text-coral-600 hover:tw-text-coral-500">
                  <svg class="tw-h-4 tw-w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Información -->
          <div class="tw-bg-sky-blue-50 tw-border tw-border-sky-blue-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <div class="tw-flex-shrink-0">
                <svg class="tw-h-5 tw-w-5 tw-text-sky-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="tw-ml-3">
                <h4 class="tw-text-sm tw-font-medium tw-text-sky-blue-800">Nueva actualización disponible</h4>
                <p class="tw-text-sm tw-text-sky-blue-700 tw-mt-1">Hay nuevas funciones disponibles. Actualiza para acceder a ellas.</p>
              </div>
              <div class="tw-ml-auto tw-pl-3">
                <button class="tw-text-sky-blue-600 hover:tw-text-sky-blue-500">
                  <svg class="tw-h-4 tw-w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notificación de Advertencia -->
          <div class="tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <div class="tw-flex-shrink-0">
                <svg class="tw-h-5 tw-w-5 tw-text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="tw-ml-3">
                <h4 class="tw-text-sm tw-font-medium tw-text-yellow-800">Advertencia importante</h4>
                <p class="tw-text-sm tw-text-yellow-700 tw-mt-1">Revisa la información antes de continuar. Algunos campos pueden requerir atención.</p>
              </div>
              <div class="tw-ml-auto tw-pl-3">
                <button class="tw-text-yellow-600 hover:tw-text-yellow-500">
                  <svg class="tw-h-4 tw-w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificaciones Avanzadas -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Notificaciones Avanzadas</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <app-button variant="primary" (buttonClick)="onShowWithAction()">
            Con Botón de Acción
          </app-button>
          <app-button variant="secondary" (buttonClick)="onShowPersistent()">
            Persistente
          </app-button>
          <app-button variant="outline" (buttonClick)="onShowCustomPosition()">
            Posición Personalizada
          </app-button>
          <app-button variant="alert" (buttonClick)="onDismissAll()">
            Cerrar Todas
          </app-button>
        </div>
      </div>

      <!-- Toast Notifications -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Toast Notifications</h3>
        <p class="tw-text-beige-600 tw-mb-4">
          Las notificaciones tipo toast aparecen temporalmente en la esquina de la pantalla.
        </p>
        <div class="tw-space-y-3">
          <!-- Toast Example -->
          @if (isToastVisible) {
            <div class="tw-fixed tw-top-4 tw-right-4 tw-z-[9999] tw-max-w-sm tw-w-full tw-bg-white tw-shadow-lg tw-rounded-lg tw-border tw-border-beige-200 tw-p-4 tw-opacity-90">
              <div class="tw-flex tw-items-center">
                <div class="tw-flex-shrink-0">
                  <svg class="tw-h-5 tw-w-5 tw-text-emerald-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="tw-ml-3 tw-flex-1">
                  <p class="tw-text-sm tw-font-medium tw-text-beige-900">Toast de ejemplo</p>
                  <p class="tw-text-xs tw-text-beige-600 tw-mt-1">Esta es una notificación toast.</p>
                </div>
                <button class="tw-ml-4 tw-text-beige-400 hover:tw-text-beige-600" (click)="onCloseToast()">
                  <svg class="tw-h-4 tw-w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          }

          <!-- Botón para mostrar el toast nuevamente -->
          @if (!isToastVisible) {
            <div class="tw-flex tw-justify-center tw-mt-4">
              <app-button variant="primary" (buttonClick)="onShowToast()">
                Mostrar Toast de Ejemplo
              </app-button>
            </div>
          }
        </div>
      </div>

      <!-- Configuraciones -->
      <div class="tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Configuraciones Disponibles</h3>
        <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
          <ul class="tw-text-sm tw-text-beige-700 tw-space-y-2">
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
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Notificaciones Legacy (Comparación)</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Prueba el sistema de notificaciones con los colores de marca
      </p>

      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
        <!-- Success Notification -->
        <div class="tw-text-center">
          <button
            (click)="showSuccessNotification()"
            class="tw-w-full tw-bg-emerald-green-500 tw-text-white tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-emerald-green-600 tw-transition-all tw-shadow-sm"
          >
            ✓ Éxito
          </button>
          <p class="tw-text-sm tw-text-beige-600 tw-mt-2">Notificación de éxito</p>
        </div>

        <!-- Error Notification -->
        <div class="tw-text-center">
          <button
            (click)="showErrorNotification()"
            class="tw-w-full tw-bg-coral-500 tw-text-white tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-coral-600 tw-transition-all tw-shadow-sm"
          >
            ✕ Error
          </button>
          <p class="tw-text-sm tw-text-beige-600 tw-mt-2">Notificación de error</p>
        </div>

        <!-- Warning Notification -->
        <div class="tw-text-center">
          <button
            (click)="showWarningNotification()"
            class="tw-w-full tw-bg-beige-500 tw-text-white tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-beige-600 tw-transition-all tw-shadow-sm"
          >
            ⚠ Advertencia
          </button>
          <p class="tw-text-sm tw-text-beige-600 tw-mt-2">Notificación de advertencia</p>
        </div>

        <!-- Info Notification -->
        <div class="tw-text-center">
          <button
            (click)="showInfoNotification()"
            class="tw-w-full tw-bg-sky-blue-500 tw-text-white tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-sky-blue-600 tw-transition-all tw-shadow-sm"
          >
            ℹ Información
          </button>
          <p class="tw-text-sm tw-text-beige-600 tw-mt-2">Notificación informativa</p>
        </div>
      </div>

      <!-- Advanced Notifications -->
      <div class="tw-mt-8 tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Notificaciones Avanzadas</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4">
          <button
            (click)="showNotificationWithAction()"
            class="btn-outline"
          >
            Con Acción
          </button>
          <button
            (click)="showPersistentNotification()"
            class="btn-secondary"
          >
            Persistente
          </button>
          <button
            (click)="showCustomPositionNotification()"
            class="tw-bg-beige-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-beige-600 tw-transition-all"
          >
            Posición Personalizada
          </button>
          <button
            (click)="dismissAllNotifications()"
            class="tw-bg-coral-100 tw-text-coral-700 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-coral-200 tw-transition-all tw-border tw-border-coral-300"
          >
            Cerrar Todas
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
    this.dismissAll.emit();
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
