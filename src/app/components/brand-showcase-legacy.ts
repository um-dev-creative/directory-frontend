import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, LoadingService } from '../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Button } from './ui/buttons/button';
import { ButtonExampleButtonUsage } from './ui/buttons/button-usage-example';
import { InputComponent, BadgeComponent, CardComponent } from './ui';

@Component({
  selector: 'app-brand-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, ButtonExampleButtonUsage, InputComponent, BadgeComponent, CardComponent],
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
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Notificaciones Avanzadas Legacy</h3>
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

        <!-- Inputs -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Componente Input</h2>
          <p class="tw-text-beige-700 tw-mb-6">
            Componente Input reutilizable con colores de marca y funcionalidades avanzadas
          </p>

          <!-- Inputs Básicos -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Inputs Básicos</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
              <app-input
                label="Nombre completo"
                placeholder="Ingresa tu nombre"
                helperText="Este campo es requerido"
                [required]="true"
                [(ngModel)]="inputValues.basicName">
              </app-input>

              <app-input
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                variant="info"
                [(ngModel)]="inputValues.email">
              </app-input>

              <app-input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                [clearable]="true"
                [(ngModel)]="inputValues.password">
              </app-input>

              <app-input
                label="Teléfono"
                type="tel"
                placeholder="+58 424 123 4567"
                [leadingIcon]="true"
                [(ngModel)]="inputValues.phone">
                <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </app-input>
            </div>
          </div>

          <!-- Tamaños -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
            <div class="tw-space-y-4">
              <app-input
                label="Input Pequeño"
                size="sm"
                placeholder="Tamaño pequeño"
                [(ngModel)]="inputValues.small">
              </app-input>

              <app-input
                label="Input Mediano"
                size="md"
                placeholder="Tamaño mediano (default)"
                [(ngModel)]="inputValues.medium">
              </app-input>

              <app-input
                label="Input Grande"
                size="lg"
                placeholder="Tamaño grande"
                [(ngModel)]="inputValues.large">
              </app-input>
            </div>
          </div>

          <!-- Variantes -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes de Estado</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
              <app-input
                label="Input Exitoso"
                variant="success"
                placeholder="Estado de éxito"
                helperText="✓ Los datos son válidos"
                [(ngModel)]="inputValues.successField">
              </app-input>

              <app-input
                label="Input con Error"
                variant="error"
                placeholder="Estado de error"
                errorMessage="Este campo contiene errores"
                [(ngModel)]="inputValues.errorField">
              </app-input>

              <app-input
                label="Input Informativo"
                variant="info"
                placeholder="Estado informativo"
                helperText="ℹ Información adicional sobre este campo"
                [(ngModel)]="inputValues.infoField">
              </app-input>

              <app-input
                label="Input Deshabilitado"
                placeholder="Este input está deshabilitado"
                [disabled]="true"
                helperText="Este campo no se puede editar">
              </app-input>
            </div>
          </div>

          <!-- Con Iconos -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Con Iconos y Funciones</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
              <app-input
                label="Buscar"
                type="search"
                placeholder="Buscar productos..."
                [leadingIcon]="true"
                [clearable]="true"
                [(ngModel)]="inputValues.search">
                <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </app-input>

              <app-input
                label="Sitio Web"
                type="url"
                placeholder="https://ejemplo.com"
                [leadingIcon]="true"
                [(ngModel)]="inputValues.website">
                <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </app-input>
            </div>
          </div>

          <!-- Formulario Completo de Ejemplo -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Formulario Completo</h3>
            <div class="tw-bg-beige-50 tw-p-6 tw-rounded-lg tw-border tw-border-beige-200">
              <form class="tw-space-y-6">
                <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                  <app-input
                    label="Nombre"
                    placeholder="Tu nombre"
                    [required]="true"
                    [(ngModel)]="inputValues.formName"
                    name="formName">
                  </app-input>

                  <app-input
                    label="Apellido"
                    placeholder="Tu apellido"
                    [required]="true"
                    [(ngModel)]="inputValues.formLastName"
                    name="formLastName">
                  </app-input>

                  <app-input
                    label="Email"
                    type="email"
                    placeholder="tu&#64;email.com"
                    [required]="true"
                    [(ngModel)]="inputValues.formEmail"
                    name="formEmail">
                  </app-input>

                  <app-input
                    label="Teléfono"
                    type="tel"
                    placeholder="+58 424 123 4567"
                    [(ngModel)]="inputValues.formPhone"
                    name="formPhone">
                  </app-input>
                </div>

                <div class="tw-flex tw-gap-4 tw-pt-4">
                  <app-button
                    variant="primary"
                    (buttonClick)="showFormSubmissionDemo()">
                    Enviar Formulario
                  </app-button>

                  <app-button
                    variant="outline"
                    (buttonClick)="clearFormDemo()">
                    Limpiar
                  </app-button>
                </div>
              </form>
            </div>
          </div>

          <!-- Valores Actuales (Demo) -->
          <div class="tw-border-t tw-border-beige-200 tw-pt-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Valores Actuales (Demo)</h3>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg tw-text-sm">
              <pre class="tw-text-beige-700 tw-overflow-x-auto">{{ getInputValuesForDisplay() }}</pre>
            </div>
          </div>
        </div>

        <!-- Badge Components -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Badge Components</h2>
          <p class="tw-text-beige-700 tw-mb-6">
            Componentes Badge reutilizables con colores de marca y funcionalidades avanzadas
          </p>

          <!-- Basic Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes Básicas</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge>Default</app-badge>
              <app-badge variant="primary">Primary</app-badge>
              <app-badge variant="secondary">Secondary</app-badge>
              <app-badge variant="success">Success</app-badge>
              <app-badge variant="error">Error</app-badge>
              <app-badge variant="warning">Warning</app-badge>
              <app-badge variant="info">Info</app-badge>
            </div>
          </div>

          <!-- Badge Sizes -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
            <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-4">
              <app-badge size="xs" variant="primary">Extra Small</app-badge>
              <app-badge size="sm" variant="primary">Small</app-badge>
              <app-badge size="md" variant="primary">Medium</app-badge>
              <app-badge size="lg" variant="primary">Large</app-badge>
            </div>
          </div>

          <!-- Badge Shapes -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Formas</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge variant="success" shape="rounded">Rounded</app-badge>
              <app-badge variant="info" shape="pill">Pill</app-badge>
              <app-badge variant="warning" shape="square">Square</app-badge>
            </div>
          </div>

          <!-- Outline Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estilos Outline</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge variant="primary" [outline]="true">Primary Outline</app-badge>
              <app-badge variant="success" [outline]="true">Success Outline</app-badge>
              <app-badge variant="error" [outline]="true">Error Outline</app-badge>
              <app-badge variant="warning" [outline]="true">Warning Outline</app-badge>
            </div>
          </div>

          <!-- Badges with Dots -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Con Indicadores</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge variant="success" label="Online" [dot]="true">Online</app-badge>
              <app-badge variant="error" label="Offline" [dot]="true">Offline</app-badge>
              <app-badge variant="warning" label="Away" [dot]="true">Away</app-badge>
              <app-badge variant="info" label="Connecting" [dot]="true" [pulse]="true">Connecting</app-badge>
            </div>
          </div>

          <!-- Badges with Icons -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Con Iconos</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge variant="success" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                Verified
              </app-badge>
              <app-badge variant="error" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                Failed
              </app-badge>
              <app-badge variant="warning" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Warning
              </app-badge>
              <app-badge variant="info" [leadingIcon]="true">
                <svg slot="leading-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                Information
              </app-badge>
            </div>
          </div>

          <!-- Removable Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges Removibles</h3>
            <div class="tw-flex tw-flex-wrap tw-gap-3">
              <app-badge
                variant="primary"
                [removable]="true"
                (remove)="handleBadgeRemove('Angular')">
                Angular
              </app-badge>
              <app-badge
                variant="secondary"
                [removable]="true"
                (remove)="handleBadgeRemove('TypeScript')">
                TypeScript
              </app-badge>
              <app-badge
                variant="success"
                [removable]="true"
                (remove)="handleBadgeRemove('Tailwind CSS')">
                Tailwind CSS
              </app-badge>
              <app-badge
                variant="info"
                [removable]="true"
                (remove)="handleBadgeRemove('RxJS')">
                RxJS
              </app-badge>
            </div>
          </div>

          <!-- Notification Badges -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Badges de Notificación</h3>
            <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-6">
              <div class="tw-relative tw-inline-block">
                <span class="tw-text-beige-700 tw-pr-4">Mensajes</span>
                <app-badge
                  variant="error"
                  size="xs"
                  shape="pill"
                  class="tw-absolute tw--top-1 tw--right-1">
                  3
                </app-badge>
              </div>
              <div class="tw-relative tw-inline-block">
                <span class="tw-text-beige-700 tw-pr-4">Notificaciones</span>
                <app-badge
                  variant="warning"
                  size="xs"
                  shape="pill"
                  class="tw-absolute tw--top-1 tw--right-1">
                  12
                </app-badge>
              </div>
              <div class="tw-relative tw-inline-block">
                <span class="tw-text-beige-700 tw-pr-4">Tareas</span>
                <app-badge
                  variant="success"
                  size="xs"
                  shape="pill"
                  class="tw-absolute tw--top-1 tw--right-1">
                  99+
                </app-badge>
              </div>
            </div>
          </div>

          <!-- Real-world Examples -->
          <div class="tw-border-t tw-border-beige-200 tw-pt-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Ejemplos de Uso Real</h3>

            <!-- User Status -->
            <div class="tw-mb-6">
              <h4 class="tw-text-md tw-font-medium tw-text-beige-700 tw-mb-3">Estados de Usuario</h4>
              <div class="tw-flex tw-flex-wrap tw-gap-3">
                <app-badge variant="success" [dot]="true">Activo</app-badge>
                <app-badge variant="warning" [dot]="true">Pendiente</app-badge>
                <app-badge variant="error" [dot]="true">Bloqueado</app-badge>
                <app-badge variant="secondary" [dot]="true">Inactivo</app-badge>
              </div>
            </div>

            <!-- Technology Stack -->
            <div class="tw-mb-6">
              <h4 class="tw-text-md tw-font-medium tw-text-beige-700 tw-mb-3">Stack Tecnológico</h4>
              <div class="tw-flex tw-flex-wrap tw-gap-2">
                <app-badge variant="primary" size="sm">Frontend</app-badge>
                <app-badge variant="secondary" size="sm">Backend</app-badge>
                <app-badge variant="success" size="sm">Full-Stack</app-badge>
                <app-badge variant="info" size="sm">DevOps</app-badge>
                <app-badge variant="warning" size="sm">Mobile</app-badge>
              </div>
            </div>

            <!-- Priority Levels -->
            <div class="tw-mb-6">
              <h4 class="tw-text-md tw-font-medium tw-text-beige-700 tw-mb-3">Niveles de Prioridad</h4>
              <div class="tw-flex tw-flex-wrap tw-gap-3">
                <app-badge variant="error" [pulse]="true">Crítico</app-badge>
                <app-badge variant="warning">Alto</app-badge>
                <app-badge variant="info">Medio</app-badge>
                <app-badge variant="secondary">Bajo</app-badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Components -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Card Components</h2>
          <p class="tw-text-beige-700 tw-mb-6">
            Componentes Card versátiles con múltiples variantes, tamaños y características interactivas
          </p>

          <!-- Basic Card Variants -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes Básicas</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
              <app-card variant="default">
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-2">Default Card</h4>
                <p class="tw-text-beige-600">Card estándar con sombra sutil y fondo blanco.</p>
              </app-card>

              <app-card variant="elevated">
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-2">Elevated Card</h4>
                <p class="tw-text-beige-600">Card con sombra más pronunciada para mayor énfasis.</p>
              </app-card>

              <app-card variant="outlined">
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-2">Outlined Card</h4>
                <p class="tw-text-beige-600">Card con borde definido y sin sombra.</p>
              </app-card>

              <app-card variant="interactive" [clickable]="true">
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-2">Interactive Card</h4>
                <p class="tw-text-beige-600">Card clickeable con efectos hover y focus.</p>
              </app-card>

              <app-card variant="gradient">
                <h4 class="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">Gradient Card</h4>
                <p class="tw-text-emerald-green-100">Card con gradiente de marca elegante.</p>
              </app-card>
            </div>
          </div>

          <!-- Card Sizes -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
              <app-card size="sm">
                <h4 class="tw-text-sm tw-font-semibold tw-text-beige-800 tw-mb-1">Small</h4>
                <p class="tw-text-xs tw-text-beige-600">Tamaño compacto</p>
              </app-card>

              <app-card size="md">
                <h4 class="tw-text-base tw-font-semibold tw-text-beige-800 tw-mb-2">Medium</h4>
                <p class="tw-text-sm tw-text-beige-600">Tamaño estándar</p>
              </app-card>

              <app-card size="lg">
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-3">Large</h4>
                <p class="tw-text-base tw-text-beige-600">Tamaño grande para contenido extenso</p>
              </app-card>

              <app-card size="xl">
                <h4 class="tw-text-xl tw-font-semibold tw-text-beige-800 tw-mb-4">Extra Large</h4>
                <p class="tw-text-lg tw-text-beige-600">Máximo tamaño disponible</p>
              </app-card>
            </div>
          </div>

          <!-- Cards with Headers and Footers -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Con Header y Footer</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
              <app-card>
                <div slot="header" class="tw-flex tw-items-center tw-justify-between">
                  <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800">Perfil de Usuario</h4>
                  <app-badge variant="success" size="sm">Activo</app-badge>
                </div>
                <div class="tw-space-y-3">
                  <div class="tw-flex tw-items-center tw-space-x-3">
                    <div class="tw-w-12 tw-h-12 tw-bg-emerald-green-200 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                      <span class="tw-text-emerald-green-700 tw-font-semibold">JD</span>
                    </div>
                    <div>
                      <p class="tw-font-medium tw-text-beige-800">Juan Pérez</p>
                      <p class="tw-text-sm tw-text-beige-600">juan.perez&#64;email.com</p>
                    </div>
                  </div>
                </div>
                <div slot="footer" class="tw-flex tw-justify-end tw-space-x-3">
                  <app-button variant="ghost" size="sm">Ver Perfil</app-button>
                  <app-button variant="primary" size="sm">Editar</app-button>
                </div>
              </app-card>

              <app-card variant="outlined">
                <div slot="header">
                  <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800">Estadísticas</h4>
                </div>
                <div class="tw-grid tw-grid-cols-3 tw-gap-4 tw-text-center">
                  <div>
                    <p class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">1,234</p>
                    <p class="tw-text-sm tw-text-beige-600">Usuarios</p>
                  </div>
                  <div>
                    <p class="tw-text-2xl tw-font-bold tw-text-sky-blue-600">856</p>
                    <p class="tw-text-sm tw-text-beige-600">Ventas</p>
                  </div>
                  <div>
                    <p class="tw-text-2xl tw-font-bold tw-text-coral-600">92%</p>
                    <p class="tw-text-sm tw-text-beige-600">Satisfacción</p>
                  </div>
                </div>
                <div slot="footer" class="tw-text-center">
                  <app-button variant="outline" size="sm" [fullWidth]="true">Ver Detalles</app-button>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Cards with Media -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Con Contenido Multimedia</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
              <app-card>
                <div slot="media" class="tw-h-48 tw-bg-gradient-primary tw-flex tw-items-center tw-justify-center">
                  <span class="tw-text-white tw-font-semibold tw-text-lg">Imagen Placeholder</span>
                </div>
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-2">Producto Destacado</h4>
                <p class="tw-text-beige-600 tw-mb-4">Descripción del producto con características principales.</p>
                <div class="tw-flex tw-items-center tw-justify-between">
                  <span class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">$99.99</span>
                  <app-button variant="primary" size="sm">Comprar</app-button>
                </div>
              </app-card>

              <app-card variant="interactive" [clickable]="true">
                <div slot="media" class="tw-h-32 tw-bg-gradient-warm tw-flex tw-items-center tw-justify-center">
                  <span class="tw-text-beige-800 tw-font-semibold">Artículo</span>
                </div>
                <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-2">Blog Post</h4>
                <p class="tw-text-beige-600 tw-text-sm">Resumen del artículo de blog con información relevante...</p>
                <div slot="footer" class="tw-flex tw-items-center tw-justify-between tw-text-sm tw-text-beige-500">
                  <span>5 min de lectura</span>
                  <span>Hace 2 días</span>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Interactive Cards Demo -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Cards Interactivas</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
              <app-card
                variant="interactive"
                [clickable]="true"
                (cardClick)="showSuccessNotification()">
                <div class="tw-text-center">
                  <div class="tw-w-12 tw-h-12 tw-bg-emerald-green-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                    <svg class="tw-w-6 tw-h-6 tw-text-emerald-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 class="tw-font-semibold tw-text-beige-800">Éxito</h4>
                  <p class="tw-text-sm tw-text-beige-600">Click para notificación</p>
                </div>
              </app-card>

              <app-card
                variant="interactive"
                [clickable]="true"
                (cardClick)="showInfoNotification()">
                <div class="tw-text-center">
                  <div class="tw-w-12 tw-h-12 tw-bg-sky-blue-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                    <svg class="tw-w-6 tw-h-6 tw-text-sky-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 class="tw-font-semibold tw-text-beige-800">Información</h4>
                  <p class="tw-text-sm tw-text-beige-600">Click para info</p>
                </div>
              </app-card>

              <app-card
                variant="interactive"
                [clickable]="true"
                (cardClick)="showWarningNotification()">
                <div class="tw-text-center">
                  <div class="tw-w-12 tw-h-12 tw-bg-coral-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                    <svg class="tw-w-6 tw-h-6 tw-text-coral-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 class="tw-font-semibold tw-text-beige-800">Advertencia</h4>
                  <p class="tw-text-sm tw-text-beige-600">Click para alerta</p>
                </div>
              </app-card>

              <app-card [loading]="(isBasicLoading$ | async) || false" (cardClick)="showBasicLoading()">
                <div class="tw-text-center">
                  <div class="tw-w-12 tw-h-12 tw-bg-beige-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                    @if (isBasicLoading$ | async) {
                      <div class="tw-animate-spin tw-rounded-full tw-h-6 tw-w-6 tw-border-2 tw-border-beige-300 tw-border-t-beige-600"></div>
                    } @else {
                      <svg class="tw-w-6 tw-h-6 tw-text-beige-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                      </svg>
                    }
                  </div>
                  <h4 class="tw-font-semibold tw-text-beige-800">Carga</h4>
                  <p class="tw-text-sm tw-text-beige-600">
                    @if (isBasicLoading$ | async) {
                      Cargando...
                    } @else {
                      Click para cargar
                    }
                  </p>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Contact Form in Card -->
          <div class="tw-mb-8">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Formulario de Contacto en Card</h3>
            <div class="tw-max-w-2xl">
              <app-card size="lg">
                <div slot="header">
                  <h4 class="tw-text-xl tw-font-semibold tw-text-beige-800">Contáctanos</h4>
                  <p class="tw-text-beige-600 tw-mt-1">Envíanos un mensaje y te responderemos pronto</p>
                </div>

                <div class="tw-space-y-4">
                  <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <app-input
                      label="Nombre"
                      placeholder="Tu nombre completo"
                      [(ngModel)]="inputValues.cardFormName">
                    </app-input>
                    <app-input
                      label="Email"
                      type="email"
                      placeholder="tu&#64;email.com"
                      [(ngModel)]="inputValues.cardFormEmail">
                    </app-input>
                  </div>

                  <app-input
                    label="Asunto"
                    placeholder="¿En qué podemos ayudarte?"
                    [(ngModel)]="inputValues.cardFormSubject">
                  </app-input>

                  <div>
                    <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-700 tw-mb-2">
                      Mensaje
                    </label>
                    <textarea
                      class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-beige-200 tw-rounded-lg tw-shadow-sm focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500"
                      rows="4"
                      placeholder="Escribe tu mensaje aquí..."
                      [(ngModel)]="inputValues.cardFormMessage">
                    </textarea>
                  </div>
                </div>

                <div slot="footer" class="tw-flex tw-justify-between tw-items-center">
                  <div class="tw-flex tw-items-center tw-space-x-2">
                    <app-badge variant="info" size="sm">
                      <svg class="tw-w-3 tw-h-3 tw-mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                      </svg>
                      Datos protegidos
                    </app-badge>
                  </div>
                  <div class="tw-flex tw-space-x-3">
                    <app-button variant="ghost" (buttonClick)="clearCardForm()">
                      Limpiar
                    </app-button>
                    <app-button variant="primary" (buttonClick)="submitCardForm()">
                      Enviar Mensaje
                    </app-button>
                  </div>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Real-world Business Directory Example -->
          <div class="tw-border-t tw-border-beige-200 tw-pt-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Ejemplo: Directorio de Negocios</h3>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
              <app-card variant="interactive" [clickable]="true" (cardClick)="showInfoNotification()">
                <div slot="header" class="tw-flex tw-items-start tw-justify-between">
                  <div>
                    <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800">Restaurante El Sabor</h4>
                    <div class="tw-flex tw-items-center tw-mt-1">
                      <div class="tw-flex tw-text-yellow-400">
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4 tw-text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="tw-text-sm tw-text-beige-600 tw-ml-1">4.0 (120 reseñas)</span>
                    </div>
                  </div>
                  <app-badge variant="success" size="sm" [dot]="true">Abierto</app-badge>
                </div>

                <div class="tw-space-y-3">
                  <p class="tw-text-beige-600 tw-text-sm">Cocina tradicional mexicana con ingredientes frescos y recetas familiares.</p>

                  <div class="tw-flex tw-flex-wrap tw-gap-2">
                    <app-badge variant="secondary" size="xs">Mexicana</app-badge>
                    <app-badge variant="secondary" size="xs">Familiar</app-badge>
                    <app-badge variant="secondary" size="xs">Terraza</app-badge>
                  </div>

                  <div class="tw-flex tw-items-center tw-text-sm tw-text-beige-600">
                    <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    Centro Histórico, 0.8 km
                  </div>
                </div>

                <div slot="footer" class="tw-flex tw-justify-between tw-items-center">
                  <span class="tw-text-sm tw-text-beige-500">Cierra a las 23:00</span>
                  <div class="tw-flex tw-space-x-2">
                    <app-button variant="ghost" size="sm">
                      <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </app-button>
                    <app-button variant="primary" size="sm">Ver Más</app-button>
                  </div>
                </div>
              </app-card>

              <app-card variant="interactive" [clickable]="true" (cardClick)="showSuccessNotification()">
                <div slot="header" class="tw-flex tw-items-start tw-justify-between">
                  <div>
                    <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800">Café Central</h4>
                    <div class="tw-flex tw-items-center tw-mt-1">
                      <div class="tw-flex tw-text-yellow-400">
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="tw-text-sm tw-text-beige-600 tw-ml-1">5.0 (85 reseñas)</span>
                    </div>
                  </div>
                  <app-badge variant="success" size="sm" [dot]="true">Abierto</app-badge>
                </div>

                <div class="tw-space-y-3">
                  <p class="tw-text-beige-600 tw-text-sm">Café de especialidad, pasteles artesanales y ambiente acogedor para trabajar.</p>

                  <div class="tw-flex tw-flex-wrap tw-gap-2">
                    <app-badge variant="secondary" size="xs">Café</app-badge>
                    <app-badge variant="secondary" size="xs">WiFi</app-badge>
                    <app-badge variant="secondary" size="xs">Postres</app-badge>
                  </div>

                  <div class="tw-flex tw-items-center tw-text-sm tw-text-beige-600">
                    <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    Zona Rosa, 1.2 km
                  </div>
                </div>

                <div slot="footer" class="tw-flex tw-justify-between tw-items-center">
                  <span class="tw-text-sm tw-text-beige-500">Cierra a las 22:00</span>
                  <div class="tw-flex tw-space-x-2">
                    <app-button variant="ghost" size="sm">
                      <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </app-button>
                    <app-button variant="primary" size="sm">Ver Más</app-button>
                  </div>
                </div>
              </app-card>

              <app-card variant="interactive" [clickable]="true" (cardClick)="showWarningNotification()">
                <div slot="header" class="tw-flex tw-items-start tw-justify-between">
                  <div>
                    <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800">Gym PowerFit</h4>
                    <div class="tw-flex tw-items-center tw-mt-1">
                      <div class="tw-flex tw-text-yellow-400">
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4 tw-text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="tw-w-4 tw-h-4 tw-text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="tw-text-sm tw-text-beige-600 tw-ml-1">3.5 (45 reseñas)</span>
                    </div>
                  </div>
                  <app-badge variant="warning" size="sm" [dot]="true">Cerrado</app-badge>
                </div>

                <div class="tw-space-y-3">
                  <p class="tw-text-beige-600 tw-text-sm">Gimnasio completo con equipos modernos, clases grupales y entrenadores personales.</p>

                  <div class="tw-flex tw-flex-wrap tw-gap-2">
                    <app-badge variant="secondary" size="xs">Fitness</app-badge>
                    <app-badge variant="secondary" size="xs">Pesas</app-badge>
                    <app-badge variant="secondary" size="xs">Clases</app-badge>
                  </div>

                  <div class="tw-flex tw-items-center tw-text-sm tw-text-beige-600">
                    <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    Polanco, 2.1 km
                  </div>
                </div>

                <div slot="footer" class="tw-flex tw-justify-between tw-items-center">
                  <span class="tw-text-sm tw-text-beige-500">Abre a las 06:00</span>
                  <div class="tw-flex tw-space-x-2">
                    <app-button variant="ghost" size="sm">
                      <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </app-button>
                    <app-button variant="primary" size="sm">Ver Más</app-button>
                  </div>
                </div>
              </app-card>
            </div>
          </div>
        </div>

        <!-- Legacy Cards (for comparison) -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Cards Legacy (Comparación)</h2>
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
export class BrandShowcaseLegacy {
  // Loading observables - usando correctamente tu LoadingService
  globalLoading$: Observable<boolean>;
  isBasicLoading$: Observable<boolean>;
  isActionLoading$: Observable<boolean>;

  // Input demo data
  inputValues = {
    basicName: '',
    email: '',
    password: '',
    phone: '',
    search: '',
    website: '',
    errorField: 'Texto con error',
    successField: 'Campo válido',
    infoField: 'Campo informativo',
    small: '',
    medium: '',
    large: '',
    formName: '',
    formLastName: '',
    formEmail: '',
    formPhone: '',
    cardFormName: '',
    cardFormEmail: '',
    cardFormSubject: '',
    cardFormMessage: ''
  };

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

  // Input demo methods
  showFormSubmissionDemo() {
    this.notificationService.success('¡Formulario enviado exitosamente!', {
      duration: 3000
    });
  }

  clearFormDemo() {
    this.inputValues.formName = '';
    this.inputValues.formLastName = '';
    this.inputValues.formEmail = '';
    this.inputValues.formPhone = '';
    this.notificationService.info('Formulario limpiado');
  }

  getInputValuesForDisplay(): string {
    return JSON.stringify(this.inputValues, null, 2);
  }

  // Badge demo methods
  handleBadgeRemove(badgeName: string) {
    this.notificationService.info(`Badge "${badgeName}" eliminado`, {
      duration: 2000
    });
  }

  // Card demo methods
  clearCardForm() {
    this.inputValues.cardFormName = '';
    this.inputValues.cardFormEmail = '';
    this.inputValues.cardFormSubject = '';
    this.inputValues.cardFormMessage = '';
    this.notificationService.info('Formulario de contacto limpiado');
  }

  submitCardForm() {
    if (this.inputValues.cardFormName && this.inputValues.cardFormEmail && this.inputValues.cardFormMessage) {
      this.notificationService.success(`¡Mensaje de ${this.inputValues.cardFormName} enviado exitosamente!`, {
        duration: 3000
      });
    } else {
      this.notificationService.error('Por favor completa todos los campos requeridos', {
        duration: 3000
      });
    }
  }
}
