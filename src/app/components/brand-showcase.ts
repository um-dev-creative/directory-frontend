import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, LoadingService } from '../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-brand-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-p-8 tw-bg-gradient-hero tw-min-h-screen">
      <div class="tw-max-w-6xl tw-mx-auto">
        <!-- Header -->
        <div class="tw-text-center tw-mb-12">
          <h1 class="tw-text-4xl tw-font-bold tw-text-emerald-green-700 tw-mb-4">
            Showcase de Colores de Marca
          </h1>
          <p class="tw-text-lg tw-text-beige-800">
            Ejemplo de implementación de la nueva paleta de colores
          </p>
        </div>

        <!-- Color Palette -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-6 tw-mb-12">
          <!-- Emerald Green -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Emerald Green</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-8 tw-bg-emerald-green-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-8 tw-bg-emerald-green-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-8 tw-bg-emerald-green-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
              <div class="tw-h-8 tw-bg-emerald-green-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
            </div>
          </div>

          <!-- Coral -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-coral-700 tw-mb-4">Coral</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-8 tw-bg-coral-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-8 tw-bg-coral-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-8 tw-bg-coral-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
              <div class="tw-h-8 tw-bg-coral-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
            </div>
          </div>

          <!-- Sky Blue -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-sky-blue-700 tw-mb-4">Sky Blue</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-8 tw-bg-sky-blue-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-8 tw-bg-sky-blue-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-8 tw-bg-sky-blue-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
              <div class="tw-h-8 tw-bg-sky-blue-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
            </div>
          </div>

          <!-- Beige -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">Beige</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-8 tw-bg-beige-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-8 tw-bg-beige-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-8 tw-bg-beige-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">500</div>
              <div class="tw-h-8 tw-bg-beige-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Botones</h2>
          <div class="tw-flex tw-flex-wrap tw-gap-4">
            <button class="btn-primary">
              Botón Principal
            </button>
            <button class="btn-secondary">
              Botón Secundario
            </button>
            <button class="btn-outline">
              Botón Outline
            </button>
            <button class="tw-bg-sky-blue-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-sky-blue-600 tw-transition-all">
              Botón Info
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Loading</h2>
          <p class="tw-text-beige-700 tw-mb-6">
            Ejemplo de estados de carga integrados con LoadingService
          </p>

          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
            <!-- Basic Loading -->
            <div class="tw-text-center tw-space-y-4">
              <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600">Loading Básico</h3>
              <button
                (click)="showBasicLoading()"
                [disabled]="isBasicLoading$ | async"
                class="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-all"
                [ngClass]="(isBasicLoading$ | async)
                  ? 'tw-bg-beige-300 tw-text-beige-600 tw-cursor-not-allowed'
                  : 'tw-bg-emerald-green-500 tw-text-white hover:tw-bg-emerald-green-600'"
              >
                @if (isBasicLoading$ | async) {
                  <div class="tw-flex tw-items-center tw-justify-center tw-space-x-2">
                    <div class="tw-animate-spin tw-rounded-full tw-h-4 tw-w-4 tw-border-2 tw-border-beige-600 tw-border-t-transparent"></div>
                    <span>Cargando...</span>
                  </div>
                } @else {
                  <span>Test Loading</span>
                }
              </button>
            </div>

            <!-- Action Loading -->
            <div class="tw-text-center tw-space-y-4">
              <h3 class="tw-text-lg tw-font-semibold tw-text-sky-blue-600">Loading con Acción</h3>
              <button
                (click)="showActionLoading()"
                [disabled]="isActionLoading$ | async"
                class="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-all"
                [ngClass]="(isActionLoading$ | async)
                  ? 'tw-bg-sky-blue-300 tw-text-sky-blue-700 tw-cursor-not-allowed'
                  : 'tw-bg-sky-blue-500 tw-text-white hover:tw-bg-sky-blue-600'"
              >
                @if (isActionLoading$ | async) {
                  <div class="tw-flex tw-items-center tw-justify-center tw-space-x-2">
                    <div class="tw-animate-pulse tw-w-4 tw-h-4 tw-bg-sky-blue-700 tw-rounded-full"></div>
                    <span>Guardando...</span>
                  </div>
                } @else {
                  <span>Guardar Datos</span>
                }
              </button>
            </div>

            <!-- Global Loading (LoadingService) -->
            <div class="tw-text-center tw-space-y-4">
              <h3 class="tw-text-lg tw-font-semibold tw-text-coral-600">Loading Global</h3>
              <button
                (click)="showGlobalLoading()"
                [disabled]="globalLoading$ | async"
                class="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-all"
                [ngClass]="(globalLoading$ | async)
                  ? 'tw-bg-coral-300 tw-text-coral-700 tw-cursor-not-allowed'
                  : 'tw-bg-coral-500 tw-text-white hover:tw-bg-coral-600'"
              >
                @if (globalLoading$ | async) {
                  <div class="tw-flex tw-items-center tw-justify-center tw-space-x-2">
                    <div class="tw-animate-spin tw-rounded-full tw-h-4 tw-w-4 tw-border-2 tw-border-coral-700 tw-border-t-transparent"></div>
                    <span>Procesando...</span>
                  </div>
                } @else {
                  <span>LoadingService</span>
                }
              </button>
            </div>
          </div>

          <!-- Loading Spinners Showcase -->
          <div class="tw-mt-8 tw-border-t tw-border-beige-200 tw-pt-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estilos de Spinners</h3>
            <div class="tw-flex tw-flex-wrap tw-justify-center tw-gap-8">
              <!-- Spinner 1 -->
              <div class="tw-text-center">
                <div class="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-emerald-green-200 tw-border-t-emerald-green-500 tw-mx-auto tw-mb-2"></div>
                <p class="tw-text-xs tw-text-beige-600">Emerald</p>
              </div>
              <!-- Spinner 2 -->
              <div class="tw-text-center">
                <div class="tw-animate-pulse tw-h-8 tw-w-8 tw-bg-coral-500 tw-rounded-full tw-mx-auto tw-mb-2"></div>
                <p class="tw-text-xs tw-text-beige-600">Coral Pulse</p>
              </div>
              <!-- Spinner 3 -->
              <div class="tw-text-center">
                <div class="tw-animate-bounce tw-h-8 tw-w-8 tw-bg-sky-blue-500 tw-rounded-full tw-mx-auto tw-mb-2"></div>
                <p class="tw-text-xs tw-text-beige-600">Sky Bounce</p>
              </div>
              <!-- Spinner 4 -->
              <div class="tw-text-center">
                <div class="tw-animate-spin tw-h-8 tw-w-8 tw-border-4 tw-border-beige-300 tw-border-l-beige-600 tw-rounded-full tw-mx-auto tw-mb-2"></div>
                <p class="tw-text-xs tw-text-beige-600">Beige Spin</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Notificaciones</h2>
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

        <!-- Cards with Gradients -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">
          <div class="tw-bg-gradient-primary tw-p-6 tw-rounded-xl tw-text-white">
            <h3 class="tw-text-xl tw-font-bold tw-mb-2">Card Primaria</h3>
            <p class="tw-opacity-90">Con gradiente emerald green</p>
          </div>
          <div class="tw-bg-gradient-warm tw-p-6 tw-rounded-xl">
            <h3 class="tw-text-xl tw-font-bold tw-mb-2 tw-text-beige-800">Card Cálida</h3>
            <p class="tw-text-beige-700">Con gradiente beige y coral</p>
          </div>
          <div class="tw-bg-gradient-sky tw-p-6 tw-rounded-xl">
            <h3 class="tw-text-xl tw-font-bold tw-mb-2 tw-text-sky-blue-800">Card Sky</h3>
            <p class="tw-text-sky-blue-700">Con gradiente sky blue</p>
          </div>
        </div>

        <!-- Alerts -->
        <div class="tw-space-y-4">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-4">Alertas</h2>

          <div class="alert-success">
            <strong>¡Éxito!</strong> Los colores de marca se han integrado correctamente.
          </div>

          <div class="alert-error">
            <strong>Error:</strong> Ejemplo de alerta de error con colores coral.
          </div>

          <div class="alert-info">
            <strong>Información:</strong> Ejemplo de alerta informativa con colores sky blue.
          </div>
        </div>
      </div>
    </div>
  `
})
export class BrandShowcase {
  // Loading observables - usando correctamente tu LoadingService
  globalLoading$: Observable<boolean>;
  isBasicLoading$: Observable<boolean>;
  isActionLoading$: Observable<boolean>;

  constructor(
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {
    // Conectar con tu LoadingService usando el observable loading$
    this.globalLoading$ = this.loadingService.globalLoading$;

    // Para loading específicos, usamos map para extraer el valor de cada key
    this.isBasicLoading$ = this.loadingService.loading$.pipe(
      map(loadingState => !!loadingState['basic'])
    );

    this.isActionLoading$ = this.loadingService.loading$.pipe(
      map(loadingState => !!loadingState['action'])
    );
  }

  // Loading methods integrados con tu LoadingService
  showBasicLoading() {
    this.loadingService.showSpecific('basic');

    // Simular operación async
    setTimeout(() => {
      this.loadingService.hideSpecific('basic');
      this.notificationService.success('¡Carga básica completada!');
    }, 2000);
  }

  showActionLoading() {
    this.loadingService.showSpecific('action');

    // Simular guardar datos
    setTimeout(() => {
      this.loadingService.hideSpecific('action');
      this.notificationService.success('¡Datos guardados exitosamente!');
    }, 3000);
  }

  showGlobalLoading() {
    this.loadingService.showGlobal();

    // Simular procesamiento global
    setTimeout(() => {
      this.loadingService.hideGlobal();
      this.notificationService.success('¡Procesamiento global completado!');
    }, 4000);
  }

  // Notification methods
  showSuccessNotification() {
    this.notificationService.success('¡Operación completada exitosamente!', {
      duration: 4000
    });
  }

  showErrorNotification() {
    this.notificationService.error('Ha ocurrido un error inesperado.', {
      duration: 6000
    });
  }

  showWarningNotification() {
    this.notificationService.warning('Advertencia: Revisa la información ingresada.', {
      duration: 5000
    });
  }

  showInfoNotification() {
    this.notificationService.info('Nueva actualización disponible.', {
      duration: 4000
    });
  }

  showNotificationWithAction() {
    this.notificationService.showWithAction(
      'Archivo guardado correctamente',
      'Ver archivo',
      {
        type: 'success',
        duration: 7000
      }
    );
  }

  showPersistentNotification() {
    this.notificationService.show('Esta notificación permanece hasta que la cierres manualmente.', {
      type: 'info',
      duration: 0, // 0 = persistente
      closable: true
    });
  }

  showCustomPositionNotification() {
    this.notificationService.show('Notificación en posición personalizada', {
      type: 'warning',
      position: 'bottom-left',
      duration: 5000
    });
  }

  dismissAllNotifications() {
    this.notificationService.dismiss();
  }
}
