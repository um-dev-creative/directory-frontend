import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-section',
  standalone: true,
  imports: [CommonModule],
  template: `
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

      <!-- Loading States Info -->
      <div class="tw-mt-8 tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Estados de Loading</h3>
        <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
          <ul class="tw-text-sm tw-text-beige-700 tw-space-y-2">
            <li><strong>Basic Loading:</strong> Estado de carga simple con duración fija</li>
            <li><strong>Action Loading:</strong> Estado específico para acciones como guardar</li>
            <li><strong>Global Loading:</strong> Utiliza LoadingService para bloqueo global</li>
            <li><strong>Spinners:</strong> Diferentes estilos visuales usando animaciones CSS</li>
            <li><strong>Estados del botón:</strong> Disabled durante loading con indicadores visuales</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class LoadingSectionComponent {
  @Output() showBasicLoading = new EventEmitter<void>();
  @Output() showActionLoading = new EventEmitter<void>();
  @Output() showGlobalLoading = new EventEmitter<void>();

  // Local loading states
  isBasicLoading = false;
  isActionLoading = false;
  isGlobalLoading = false;

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
}
