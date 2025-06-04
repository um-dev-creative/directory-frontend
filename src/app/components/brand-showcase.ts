import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, LoadingService } from '../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Button } from './ui/buttons/button';
import { ButtonExampleButtonUsage } from './ui/buttons/button-usage-example';

@Component({
  selector: 'app-brand-showcase',
  standalone: true,
  imports: [CommonModule, Button, ButtonExampleButtonUsage],
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
          <p class="tw-text-beige-700 tw-mb-6">
            Componente Button reutilizable con colores de marca
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
                (buttonClick)="showSuccessNotification()"
              >
                Mostrar Notificación
              </app-button>
              <app-button
                variant="secondary"
                (buttonClick)="showBasicLoading()"
                [loading]="(isBasicLoading$ | async) || false"
              >
                Test Loading
              </app-button>
              <app-button
                variant="info"
                (buttonClick)="showInfoNotification()"
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

      <!-- Casos de Uso Reales -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Casos de Uso Reales</h2>
          <p class="tw-text-beige-700 tw-mb-6">
            Ejemplos prácticos de implementación del componente Button
          </p>
          <!-- Importar el componente completo -->
          <app-example-button-usage></app-example-button-usage>
        </div>

        <!-- Badges -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Badges</h2>
          <p class="tw-text-beige-700 tw-mb-6">
            Diferentes estilos de badges usando la paleta de colores de marca
          </p>

          <!-- Basic Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges Básicos</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <!-- Emerald Green Badges -->
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800">
                Activo
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-500 tw-text-white">
                Aprobado
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-700 tw-text-white">
                Verificado
              </span>

              <!-- Coral Badges -->
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-100 tw-text-coral-800">
                Pendiente
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-500 tw-text-white">
                Urgente
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-700 tw-text-white">
                Error
              </span>

              <!-- Sky Blue Badges -->
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-100 tw-text-sky-blue-800">
                Info
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-500 tw-text-white">
                Nuevo
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-700 tw-text-white">
                Premium
              </span>

              <!-- Beige Badges -->
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-beige-100 tw-text-beige-800">
                Borrador
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-beige-500 tw-text-white">
                Archivado
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-beige-700 tw-text-white">
                Completado
              </span>
            </div>
          </div>

          <!-- Badge Sizes -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
            <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-4">
              <span class="tw-inline-flex tw-items-center tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800">
                Pequeño
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium tw-bg-emerald-green-500 tw-text-white">
                Mediano
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-rounded-full tw-text-base tw-font-medium tw-bg-emerald-green-700 tw-text-white">
                Grande
              </span>
            </div>
          </div>

          <!-- Badges with Icons -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges con Iconos</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800">
                <svg class="tw-w-3 tw-h-3 tw-mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                Completado
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-100 tw-text-coral-800">
                <svg class="tw-w-3 tw-h-3 tw-mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Advertencia
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-100 tw-text-sky-blue-800">
                <svg class="tw-w-3 tw-h-3 tw-mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                Información
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-beige-500 tw-text-white">
                <svg class="tw-w-3 tw-h-3 tw-mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                Cancelado
              </span>
            </div>
          </div>

          <!-- Badges with Dots -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges con Indicadores</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800">
                <div class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></div>
                En línea
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-100 tw-text-coral-800">
                <div class="tw-w-2 tw-h-2 tw-bg-coral-500 tw-rounded-full tw-mr-2"></div>
                Ocupado
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-beige-100 tw-text-beige-800">
                <div class="tw-w-2 tw-h-2 tw-bg-beige-500 tw-rounded-full tw-mr-2"></div>
                Ausente
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-100 tw-text-sky-blue-800">
                <div class="tw-w-2 tw-h-2 tw-bg-sky-blue-500 tw-rounded-full tw-mr-2 tw-animate-pulse"></div>
                Conectando
              </span>
            </div>
          </div>

          <!-- Removable Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges Removibles</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800">
                Angular
                <button type="button" class="tw-ml-1.5 tw-inline-flex tw-items-center tw-justify-center tw-w-4 tw-h-4 tw-rounded-full tw-text-emerald-green-400 hover:tw-bg-emerald-green-200 hover:tw-text-emerald-green-500 focus:tw-outline-none">
                  <svg class="tw-w-2 tw-h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
                  </svg>
                </button>
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-100 tw-text-sky-blue-800">
                TypeScript
                <button type="button" class="tw-ml-1.5 tw-inline-flex tw-items-center tw-justify-center tw-w-4 tw-h-4 tw-rounded-full tw-text-sky-blue-400 hover:tw-bg-sky-blue-200 hover:tw-text-sky-blue-500 focus:tw-outline-none">
                  <svg class="tw-w-2 tw-h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
                  </svg>
                </button>
              </span>
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-100 tw-text-coral-800">
                Tailwind CSS
                <button type="button" class="tw-ml-1.5 tw-inline-flex tw-items-center tw-justify-center tw-w-4 tw-h-4 tw-rounded-full tw-text-coral-400 hover:tw-bg-coral-200 hover:tw-text-coral-500 focus:tw-outline-none">
                  <svg class="tw-w-2 tw-h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- Number Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges Numéricos</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-6">
              <div class="tw-relative">
                <span class="tw-text-sm tw-text-beige-700">Notificaciones</span>
                <span class="tw-absolute tw--top-2 tw--right-2 tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-leading-none tw-text-white tw-bg-coral-500 tw-rounded-full">
                  3
                </span>
              </div>
              <div class="tw-relative">
                <span class="tw-text-sm tw-text-beige-700">Mensajes</span>
                <span class="tw-absolute tw--top-2 tw--right-2 tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-leading-none tw-text-white tw-bg-sky-blue-500 tw-rounded-full">
                  12
                </span>
              </div>
              <div class="tw-relative">
                <span class="tw-text-sm tw-text-beige-700">Tareas</span>
                <span class="tw-absolute tw--top-2 tw--right-2 tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-leading-none tw-text-white tw-bg-emerald-green-500 tw-rounded-full">
                  5
                </span>
              </div>
              <div class="tw-relative">
                <span class="tw-text-sm tw-text-beige-700">Alertas</span>
                <span class="tw-absolute tw--top-2 tw--right-2 tw-inline-flex tw-items-center tw-justify-center tw-w-3 tw-h-3 tw-bg-coral-500 tw-rounded-full">
                  <span class="tw-sr-only">Nuevas alertas</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Interactive Badges -->
          <div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges Interactivos</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <button class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800 hover:tw-bg-emerald-green-200 tw-transition-colors tw-cursor-pointer">
                Clickeable
              </button>
              <button class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-sky-blue-100 tw-text-sky-blue-800 hover:tw-bg-sky-blue-200 tw-transition-colors tw-cursor-pointer">
                Filtro: Activo
              </button>
              <button class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-coral-100 tw-text-coral-800 hover:tw-bg-coral-200 tw-transition-colors tw-cursor-pointer">
                Categoría: Urgente
              </button>
              <button class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-beige-100 tw-text-beige-800 hover:tw-bg-beige-200 tw-transition-colors tw-cursor-pointer">
                Estado: Borrador
              </button>
            </div>
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
