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
    @if (isFullScreenLoading) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 text-center">
          <div class="animate-spin mx-auto h-12 w-12 border-4 border-emerald-green-200 border-t-emerald-green-500 rounded-full mb-4"></div>
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-2">Cargando Directorio...</h3>
          <p class="text-beige-600">Por favor espere mientras se cargan los datos</p>
        </div>
      </div>
    }

    <!-- Loading -->
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Loading</h2>
      <p class="text-beige-700 mb-6">
        Ejemplo de estados de carga integrados con LoadingService
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Basic Loading -->
        <div class="text-center space-y-4">
          <h3 class="text-lg font-semibold text-emerald-green-600">Loading Básico</h3>
          <button
            (click)="onShowBasicLoading()"
            [disabled]="isBasicLoading"
            class="w-full px-4 py-3 rounded-lg font-semibold transition-all"
            [ngClass]="isBasicLoading
              ? 'bg-beige-300 text-beige-600 cursor-not-allowed'
              : 'bg-emerald-green-500 text-white hover:bg-emerald-green-600'"
          >
            @if (isBasicLoading) {
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-beige-600 border-t-transparent"></div>
                <span>Cargando...</span>
              </div>
            } @else {
              <span>Test Loading</span>
            }
          </button>
        </div>

        <!-- Action Loading -->
        <div class="text-center space-y-4">
          <h3 class="text-lg font-semibold text-sky-blue-600">Loading con Acción</h3>
          <button
            (click)="onShowActionLoading()"
            [disabled]="isActionLoading"
            class="w-full px-4 py-3 rounded-lg font-semibold transition-all"
            [ngClass]="isActionLoading
              ? 'bg-sky-blue-300 text-sky-blue-700 cursor-not-allowed'
              : 'bg-sky-blue-500 text-white hover:bg-sky-blue-600'"
          >
            @if (isActionLoading) {
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-pulse w-4 h-4 bg-sky-blue-700 rounded-full"></div>
                <span>Guardando...</span>
              </div>
            } @else {
              <span>Guardar Datos</span>
            }
          </button>
        </div>

        <!-- Global Loading (LoadingService) -->
        <div class="text-center space-y-4">
          <h3 class="text-lg font-semibold text-coral-600">Loading Global</h3>
          <button
            (click)="onShowGlobalLoading()"
            [disabled]="isGlobalLoading"
            class="w-full px-4 py-3 rounded-lg font-semibold transition-all"
            [ngClass]="isGlobalLoading
              ? 'bg-coral-300 text-coral-700 cursor-not-allowed'
              : 'bg-coral-500 text-white hover:bg-coral-600'"
          >
            @if (isGlobalLoading) {
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-coral-700 border-t-transparent"></div>
                <span>Procesando...</span>
              </div>
            } @else {
              <span>LoadingService</span>
            }
          </button>
        </div>
      </div>

      <!-- Full Screen & Advanced Loading -->
      <div class="mt-8 border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Loading Avanzado</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Full Screen Loading -->
          <button
            (click)="onShowFullScreenLoading()"
            [disabled]="isFullScreenLoading"
            class="px-4 py-3 rounded-lg font-medium transition-all bg-emerald-green-500 text-white hover:bg-emerald-green-600 disabled:opacity-50"
          >
            Full Screen Loading
          </button>

          <!-- Progress Loading -->
          <button
            (click)="onShowProgressLoading()"
            [disabled]="isProgressLoading"
            class="px-4 py-3 rounded-lg font-medium transition-all bg-sky-blue-500 text-white hover:bg-sky-blue-600 disabled:opacity-50"
          >
            Progress Loading
          </button>

          <!-- Skeleton Loading -->
          <button
            (click)="onShowSkeletonLoading()"
            [disabled]="isSkeletonLoading"
            class="px-4 py-3 rounded-lg font-medium transition-all bg-coral-500 text-white hover:bg-coral-600 disabled:opacity-50"
          >
            Skeleton Loading
          </button>

          <!-- Inline Loading -->
          <button
            (click)="onShowInlineLoading()"
            [disabled]="isInlineLoading"
            class="px-4 py-3 rounded-lg font-medium transition-all bg-beige-600 text-white hover:bg-beige-700 disabled:opacity-50"
          >
            Inline Loading
          </button>
        </div>
      </div>

      <!-- Progress Loading Demo -->
      @if (isProgressLoading) {
        <div class="mt-6 bg-sky-blue-50 rounded-lg p-6">
          <h4 class="font-semibold text-sky-blue-800 mb-4">Cargando datos del directorio...</h4>
          <div class="w-full bg-sky-blue-200 rounded-full h-3 mb-2">
            <div
              class="bg-sky-blue-600 h-3 rounded-full transition-all duration-300"
              [style.width.%]="progressValue"
            ></div>
          </div>
          <p class="text-sm text-sky-blue-700">{{ progressValue }}% - {{ progressMessage }}</p>
        </div>
      }

      <!-- Skeleton Loading Demo -->
      @if (isSkeletonLoading) {
        <div class="mt-6 bg-white rounded-lg p-6">
          <h4 class="font-semibold text-emerald-green-800 mb-4">Vista previa de empresas:</h4>

          <!-- Business Directory Skeleton -->
          <div class="space-y-6">
            <!-- Featured Business Card -->
            <div class="mb-4">
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
          <div class="mt-6 pt-4 border-t border-emerald-green-200">
            <h5 class="font-medium text-emerald-green-700 mb-3">Patrón personalizado:</h5>
            <app-skeleton
              variant="custom"
              [loading]="true"
              animation="pulse"
            >
              <div class="space-y-4">
                @for (i of [1,2,3]; track i) {
                  <div class="flex space-x-4 p-4 bg-white rounded-lg border border-emerald-green-100">
                    <!-- Company Logo -->
                    <div class="skeleton-element skeleton-pulse skeleton-rounded w-16 h-16 shrink-0"></div>

                    <!-- Company Info -->
                    <div class="flex-1 space-y-2">
                      <!-- Company Name -->
                      <div class="skeleton-element skeleton-pulse skeleton-rounded h-5 w-3/4"></div>
                      <!-- Category -->
                      <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-1/2"></div>
                      <!-- Rating and Contact -->
                      <div class="flex space-x-4">
                        <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-20"></div>
                        <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-24"></div>
                      </div>
                    </div>

                    <!-- Action Button -->
                    <div class="skeleton-element skeleton-pulse skeleton-rounded w-20 h-10"></div>
                  </div>
                }
              </div>
            </app-skeleton>
          </div>
        </div>
      }

      <!-- Inline Loading Demo -->
      @if (isInlineLoading) {
        <div class="mt-6 bg-beige-50 rounded-lg p-6">
          <h4 class="font-semibold text-beige-800 mb-4">Lista de empresas</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
              <span>Restaurante El Buen Sabor</span>
              <div class="animate-spin h-4 w-4 border-2 border-beige-300 border-t-beige-600 rounded-full"></div>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
              <span>Tecnología Avanzada S.A.</span>
              <div class="animate-pulse h-4 w-4 bg-beige-400 rounded-full"></div>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
              <span>Centro Médico Salud+</span>
              <div class="animate-bounce h-4 w-4 bg-beige-500 rounded-full"></div>
            </div>
          </div>
        </div>
      }

      <!-- Loading Spinners Showcase -->
      <div class="mt-8 border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estilos de Spinners</h3>
        <div class="flex flex-wrap justify-center gap-8">
          <!-- Spinner 1 -->
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-emerald-green-200 border-t-emerald-green-500 mx-auto mb-2"></div>
            <p class="text-xs text-beige-600">Emerald</p>
          </div>
          <!-- Spinner 2 -->
          <div class="text-center">
            <div class="animate-pulse h-8 w-8 bg-coral-500 rounded-full mx-auto mb-2"></div>
            <p class="text-xs text-beige-600">Coral Pulse</p>
          </div>
          <!-- Spinner 3 -->
          <div class="text-center">
            <div class="animate-bounce h-8 w-8 bg-sky-blue-500 rounded-full mx-auto mb-2"></div>
            <p class="text-xs text-beige-600">Sky Bounce</p>
          </div>
          <!-- Spinner 4 -->
          <div class="text-center">
            <div class="animate-spin h-8 w-8 border-4 border-beige-300 border-l-beige-600 rounded-full mx-auto mb-2"></div>
            <p class="text-xs text-beige-600">Beige Spin</p>
          </div>
        </div>
      </div>

      <!-- Advanced Skeleton Patterns -->
      <div class="mt-8 border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Patrones de Skeleton Avanzados</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Dashboard Skeleton -->
          <div class="bg-sky-blue-50 rounded-lg p-4">
            <h4 class="font-semibold text-sky-blue-800 mb-3">Dashboard Loading</h4>
            <div class="grid grid-cols-2 gap-4">
              <!-- Profile Section -->
              <div>
                <app-skeleton
                  variant="profile"
                  [loading]="true"
                  animation="pulse"
                ></app-skeleton>
              </div>

              <!-- Stats Cards -->
              <div class="space-y-3">
                @for (i of [1,2]; track i) {
                  <div class="p-3 bg-white rounded-lg border border-sky-blue-100">
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
          <div class="bg-beige-50 rounded-lg p-4">
            <h4 class="font-semibold text-beige-800 mb-3">Data Table Loading</h4>
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
        <div class="mt-6 bg-emerald-green-50 rounded-lg p-4">
          <h4 class="font-semibold text-emerald-green-800 mb-3">Chat/Messages Loading</h4>
          <app-skeleton
            variant="custom"
            [loading]="true"
            animation="pulse"
          >
            <div class="space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="flex space-x-3" [class.flex-row-reverse]="i % 2 === 0">
                  <!-- Avatar -->
                  <div class="skeleton-element skeleton-pulse skeleton-circle w-8 h-8 shrink-0"></div>
                  <!-- Message -->
                  <div class="space-y-1 max-w-xs">
                    <div class="skeleton-element skeleton-pulse skeleton-rounded h-3 w-16"></div>
                    <div class="skeleton-element skeleton-pulse skeleton-rounded p-3"
                         [style.width]="(60 + i * 15) + '%'">
                      <div class="h-4"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </app-skeleton>
        </div>
      </div>

      <!-- Loading States Info -->
      <div class="mt-8 border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-beige-700 mb-4">Estados de Loading</h3>
        <div class="bg-beige-50 rounded-lg p-4">
          <ul class="text-sm text-beige-700 space-y-2">
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
        <div class="mt-4 bg-emerald-green-50 rounded-lg p-4">
          <h4 class="font-semibold text-emerald-green-700 mb-2">Mejores Prácticas - Skeleton Loading:</h4>
          <ul class="text-sm text-emerald-green-700 space-y-1">
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
    @reference "../../../../styles.css";

    .skeleton-element {
      @apply bg-gradient-to-r from-beige-200 via-beige-300 to-beige-200;
    }

    .skeleton-pulse {
      @apply animate-pulse;
    }

    .skeleton-rounded {
      @apply rounded-md;
    }

    .skeleton-circle {
      @apply rounded-full;
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
