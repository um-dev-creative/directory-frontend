import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SkeletonComponent } from '../../ui';

@Component({
  selector: 'app-loading-section',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <!-- Full Screen Loading Overlay -->
    <div *ngIf="isFullScreenLoading" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-rounded-lg tw-p-8 tw-text-center">
        <div class="tw-animate-spin tw-mx-auto tw-h-12 tw-w-12 tw-border-4 tw-border-emerald-green-200 tw-border-t-emerald-green-500 tw-rounded-full tw-mb-4"></div>
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Cargando Directorio...</h3>
        <p class="tw-text-beige-600">Por favor espere mientras se cargan los datos</p>
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
            (click)="onShowBasicLoading()"
            [disabled]="isBasicLoading"
            class="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-all"
            [ngClass]="isBasicLoading
              ? 'tw-bg-beige-300 tw-text-beige-600 tw-cursor-not-allowed'
              : 'tw-bg-emerald-green-500 tw-text-white hover:tw-bg-emerald-green-600'"
          >
            @if (isBasicLoading) {
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
            (click)="onShowActionLoading()"
            [disabled]="isActionLoading"
            class="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-all"
            [ngClass]="isActionLoading
              ? 'tw-bg-sky-blue-300 tw-text-sky-blue-700 tw-cursor-not-allowed'
              : 'tw-bg-sky-blue-500 tw-text-white hover:tw-bg-sky-blue-600'"
          >
            @if (isActionLoading) {
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
            (click)="onShowGlobalLoading()"
            [disabled]="isGlobalLoading"
            class="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-all"
            [ngClass]="isGlobalLoading
              ? 'tw-bg-coral-300 tw-text-coral-700 tw-cursor-not-allowed'
              : 'tw-bg-coral-500 tw-text-white hover:tw-bg-coral-600'"
          >
            @if (isGlobalLoading) {
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

      <!-- Full Screen & Advanced Loading -->
      <div class="tw-mt-8 tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Loading Avanzado</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
          <!-- Full Screen Loading -->
          <button
            (click)="onShowFullScreenLoading()"
            [disabled]="isFullScreenLoading"
            class="tw-px-4 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all tw-bg-emerald-green-500 tw-text-white hover:tw-bg-emerald-green-600 disabled:tw-opacity-50"
          >
            Full Screen Loading
          </button>

          <!-- Progress Loading -->
          <button
            (click)="onShowProgressLoading()"
            [disabled]="isProgressLoading"
            class="tw-px-4 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all tw-bg-sky-blue-500 tw-text-white hover:tw-bg-sky-blue-600 disabled:tw-opacity-50"
          >
            Progress Loading
          </button>

          <!-- Skeleton Loading -->
          <button
            (click)="onShowSkeletonLoading()"
            [disabled]="isSkeletonLoading"
            class="tw-px-4 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all tw-bg-coral-500 tw-text-white hover:tw-bg-coral-600 disabled:tw-opacity-50"
          >
            Skeleton Loading
          </button>

          <!-- Inline Loading -->
          <button
            (click)="onShowInlineLoading()"
            [disabled]="isInlineLoading"
            class="tw-px-4 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all tw-bg-beige-600 tw-text-white hover:tw-bg-beige-700 disabled:tw-opacity-50"
          >
            Inline Loading
          </button>
        </div>
      </div>

      <!-- Progress Loading Demo -->
      <div *ngIf="isProgressLoading" class="tw-mt-6 tw-bg-sky-blue-50 tw-rounded-lg tw-p-6">
        <h4 class="tw-font-semibold tw-text-sky-blue-800 tw-mb-4">Cargando datos del directorio...</h4>
        <div class="tw-w-full tw-bg-sky-blue-200 tw-rounded-full tw-h-3 tw-mb-2">
          <div
            class="tw-bg-sky-blue-600 tw-h-3 tw-rounded-full tw-transition-all tw-duration-300"
            [style.width.%]="progressValue"
          ></div>
        </div>
        <p class="tw-text-sm tw-text-sky-blue-700">{{ progressValue }}% - {{ progressMessage }}</p>
      </div>

      <!-- Skeleton Loading Demo -->
      <div *ngIf="isSkeletonLoading" class="tw-mt-6 tw-bg-white tw-rounded-lg tw-p-6">
        <h4 class="tw-font-semibold tw-text-emerald-green-800 tw-mb-4">Vista previa de empresas:</h4>

        <!-- Business Directory Skeleton -->
        <div class="tw-space-y-6">
          <!-- Featured Business Card -->
          <div class="tw-mb-4">
            <app-skeleton
              variant="card"
              [loading]="true"
              [showImage]="true"
              [imageHeight]="120"
              animation="pulse"
            ></app-skeleton>
          </div>

          <!-- Business List -->
          <app-skeleton
            variant="list"
            [loading]="true"
            [count]="4"
            [showAvatar]="true"
            [showAction]="true"
            [avatarSize]="48"
            animation="pulse"
          ></app-skeleton>
        </div>

        <!-- Alternative: Custom Skeleton Pattern -->
        <div class="tw-mt-6 tw-pt-4 tw-border-t tw-border-emerald-green-200">
          <h5 class="tw-font-medium tw-tw-text-emerald-green-700 tw-mb-3">Patrón personalizado:</h5>
          <app-skeleton
            variant="custom"
            [loading]="true"
            animation="pulse"
          >
            <div class="tw-space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="tw-flex tw-space-x-4 tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-emerald-green-100">
                  <!-- Company Logo -->
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-w-16 tw-h-16 tw-flex-shrink-0"></div>

                  <!-- Company Info -->
                  <div class="tw-flex-1 tw-space-y-2">
                    <!-- Company Name -->
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-5 tw-w-3/4"></div>
                    <!-- Category -->
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-1/2"></div>
                    <!-- Rating and Contact -->
                    <div class="tw-flex tw-space-x-4">
                      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-20"></div>
                      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-24"></div>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-w-20 tw-h-10"></div>
                </div>
              }
            </div>
          </app-skeleton>
        </div>
      </div>

      <!-- Inline Loading Demo -->
      <div *ngIf="isInlineLoading" class="tw-mt-6 tw-bg-beige-50 tw-rounded-lg tw-p-6">
        <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-4">Lista de empresas</h4>
        <div class="tw-space-y-3">
          <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-white tw-rounded-lg tw-border">
            <span>Restaurante El Buen Sabor</span>
            <div class="tw-animate-spin tw-h-4 tw-w-4 tw-border-2 tw-border-beige-300 tw-border-t-beige-600 tw-rounded-full"></div>
          </div>
          <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-white tw-rounded-lg tw-border">
            <span>Tecnología Avanzada S.A.</span>
            <div class="tw-animate-pulse tw-h-4 tw-w-4 tw-bg-beige-400 tw-rounded-full"></div>
          </div>
          <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-white tw-rounded-lg tw-border">
            <span>Centro Médico Salud+</span>
            <div class="tw-animate-bounce tw-h-4 tw-w-4 tw-bg-beige-500 tw-rounded-full"></div>
          </div>
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

      <!-- Advanced Skeleton Patterns -->
      <div class="tw-mt-8 tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Patrones de Skeleton Avanzados</h3>
        <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">

          <!-- Dashboard Skeleton -->
          <div class="tw-bg-sky-blue-50 tw-rounded-lg tw-p-4">
            <h4 class="tw-font-semibold tw-text-sky-blue-800 tw-mb-3">Dashboard Loading</h4>
            <div class="tw-grid tw-grid-cols-2 tw-gap-4">
              <!-- Profile Section -->
              <div>
                <app-skeleton
                  variant="profile"
                  [loading]="true"
                  animation="pulse"
                ></app-skeleton>
              </div>

              <!-- Stats Cards -->
              <div class="tw-space-y-3">
                @for (i of [1,2]; track i) {
                  <div class="tw-p-3 tw-bg-white tw-rounded-lg tw-border tw-border-sky-blue-100">
                    <app-skeleton
                      variant="default"
                      [loading]="true"
                      [count]="2"
                      [height]="12"
                      animation="pulse"
                    ></app-skeleton>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Table Skeleton -->
          <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
            <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">Data Table Loading</h4>
            <app-skeleton
              variant="table"
              [loading]="true"
              [tableColumns]="4"
              [tableRows]="5"
              animation="pulse"
            ></app-skeleton>
          </div>
        </div>

        <!-- Custom Message Thread Skeleton -->
        <div class="tw-mt-6 tw-bg-emerald-green-50 tw-rounded-lg tw-p-4">
          <h4 class="tw-font-semibold tw-text-emerald-green-800 tw-mb-3">Chat/Messages Loading</h4>
          <app-skeleton
            variant="custom"
            [loading]="true"
            animation="pulse"
          >
            <div class="tw-space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="tw-flex tw-space-x-3" [class.tw-flex-row-reverse]="i % 2 === 0">
                  <!-- Avatar -->
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-circle tw-w-8 tw-h-8 tw-flex-shrink-0"></div>
                  <!-- Message -->
                  <div class="tw-space-y-1 tw-max-w-xs">
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-3 tw-w-16"></div>
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-p-3"
                         [style.width]="(60 + i * 15) + '%'">
                      <div class="tw-h-4"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </app-skeleton>
        </div>
      </div>

      <!-- Loading States Info -->
      <div class="tw-mt-8 tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Estados de Loading</h3>
        <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
          <ul class="tw-text-sm tw-text-beige-700 tw-space-y-2">
            <li><strong>Basic Loading:</strong> Estado de carga simple con duración fija</li>
            <li><strong>Action Loading:</strong> Estado específico para acciones como guardar</li>
            <li><strong>Global Loading:</strong> Utiliza LoadingService para bloqueo global</li>
            <li><strong>Progress Loading:</strong> Muestra progreso con barra y mensajes dinámicos</li>
            <li><strong>Skeleton Loading:</strong> Usa SkeletonComponent para vista previa de contenido</li>
            <li><strong>Inline Loading:</strong> Estados de carga específicos por elemento</li>
            <li><strong>Spinners:</strong> Diferentes estilos visuales usando animaciones CSS</li>
            <li><strong>Estados del botón:</strong> Disabled durante loading con indicadores visuales</li>
          </ul>
        </div>

        <!-- Skeleton Best Practices -->
        <div class="tw-mt-4 tw-bg-emerald-green-50 tw-rounded-lg tw-p-4">
          <h4 class="tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Mejores Prácticas - Skeleton Loading:</h4>
          <ul class="tw-text-sm tw-text-emerald-green-700 tw-space-y-1">
            <li>• Usa <strong>pulse</strong> para animación suave y accesible</li>
            <li>• Prefiere <strong>variant="card"</strong> para contenido de empresas</li>
            <li>• Usa <strong>variant="list"</strong> para listas de elementos</li>
            <li>• Combina con <strong>variant="custom"</strong> para casos específicos</li>
            <li>• Mantén consistencia con los colores de marca (beige, emerald)</li>
            <li>• Evita skeletons muy largos (máximo 4-5 segundos)</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tw-skeleton-element {
      @apply tw-bg-gradient-to-r tw-from-beige-200 tw-via-beige-300 tw-to-beige-200;
    }

    .tw-skeleton-pulse {
      @apply tw-animate-pulse;
    }

    .tw-skeleton-rounded {
      @apply tw-rounded-md;
    }

    .tw-skeleton-circle {
      @apply tw-rounded-full;
    }
  `]
})
export class LoadingSectionComponent {
  @Output() showBasicLoading = new EventEmitter<void>();
  @Output() showActionLoading = new EventEmitter<void>();
  @Output() showGlobalLoading = new EventEmitter<void>();

  // Local loading states
  isBasicLoading = false;
  isActionLoading = false;
  isGlobalLoading = false;

  // Advanced loading states
  isFullScreenLoading = false;
  isProgressLoading = false;
  isSkeletonLoading = false;
  isInlineLoading = false;

  // Progress loading properties
  progressValue = 0;
  progressMessage = 'Iniciando...';

  // Skeleton loading data
  skeletonItems = Array(4).fill(null);

  onShowBasicLoading() {
    this.isBasicLoading = true;
    this.showBasicLoading.emit();

    // Simulate loading for 3 seconds
    setTimeout(() => {
      this.isBasicLoading = false;
    }, 3000);
  }

  onShowActionLoading() {
    this.isActionLoading = true;
    this.showActionLoading.emit();

    // Simulate saving action for 2 seconds
    setTimeout(() => {
      this.isActionLoading = false;
    }, 2000);
  }

  onShowGlobalLoading() {
    this.isGlobalLoading = true;
    this.showGlobalLoading.emit();

    // Simulate global loading for 4 seconds
    setTimeout(() => {
      this.isGlobalLoading = false;
    }, 4000);
  }

  onShowFullScreenLoading() {
    this.isFullScreenLoading = true;

    // Simulate full screen loading for 5 seconds
    setTimeout(() => {
      this.isFullScreenLoading = false;
    }, 5000);
  }

  onShowProgressLoading() {
    this.isProgressLoading = true;
    this.progressValue = 0;
    this.progressMessage = 'Conectando al servidor...';

    // Simulate progress updates
    const interval = setInterval(() => {
      this.progressValue += Math.random() * 20;

      if (this.progressValue < 30) {
        this.progressMessage = 'Conectando al servidor...';
      } else if (this.progressValue < 60) {
        this.progressMessage = 'Cargando lista de empresas...';
      } else if (this.progressValue < 90) {
        this.progressMessage = 'Procesando información...';
      } else {
        this.progressMessage = 'Finalizando...';
      }

      if (this.progressValue >= 100) {
        this.progressValue = 100;
        this.progressMessage = 'Completado';
        clearInterval(interval);

        setTimeout(() => {
          this.isProgressLoading = false;
          this.progressValue = 0;
        }, 1000);
      }
    }, 300);
  }

  onShowSkeletonLoading() {
    this.isSkeletonLoading = true;

    // Show skeleton for 4 seconds
    setTimeout(() => {
      this.isSkeletonLoading = false;
    }, 4000);
  }

  onShowInlineLoading() {
    this.isInlineLoading = true;

    // Show inline loading for 3 seconds
    setTimeout(() => {
      this.isInlineLoading = false;
    }, 3000);
  }
}
