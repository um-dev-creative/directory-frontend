import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip';

@Component({
  selector: 'app-tooltip-examples',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  template: `
    <div class="tw-space-y-8">
      <!-- Basic Tooltips -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Tooltips Básicos por Posición
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Tooltip en la parte superior" position="top">
            <button class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Top
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip en la parte inferior" position="bottom">
            <button class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Bottom
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip a la izquierda" position="left">
            <button class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Left
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip a la derecha" position="right">
            <button class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Right
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Different Triggers -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Diferentes Disparadores
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Se muestra al pasar el mouse" trigger="hover">
            <button class="tw-bg-emerald-green-500 hover:tw-bg-emerald-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Hover
            </button>
          </app-tooltip>

          <app-tooltip content="Se muestra al hacer clic" trigger="click">
            <button class="tw-bg-emerald-green-500 hover:tw-bg-emerald-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Click
            </button>
          </app-tooltip>

          <app-tooltip content="Se muestra al enfocar" trigger="focus">
            <button class="tw-bg-emerald-green-500 hover:tw-bg-emerald-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Focus
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Different Variants -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Diferentes Variantes
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Tooltip por defecto" variant="default">
            <button class="tw-bg-gray-500 hover:tw-bg-gray-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Default
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip oscuro" variant="dark">
            <button class="tw-bg-gray-800 hover:tw-bg-gray-900 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Dark
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip claro" variant="light">
            <button class="tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-800 tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Light
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip de éxito" variant="success">
            <button class="tw-bg-emerald-green-500 hover:tw-bg-emerald-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Success
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip de advertencia" variant="warning">
            <button class="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Warning
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip de error" variant="error">
            <button class="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Error
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Diferentes Tamaños
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Tooltip pequeño" size="sm">
            <button class="tw-bg-purple-500 hover:tw-bg-purple-600 tw-text-white tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors tw-duration-200">
              Small
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip mediano (por defecto)" size="md">
            <button class="tw-bg-purple-500 hover:tw-bg-purple-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Medium
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip grande con más contenido y espacio" size="lg">
            <button class="tw-bg-purple-500 hover:tw-bg-purple-600 tw-text-white tw-px-5 tw-py-3 tw-rounded-lg tw-text-lg tw-font-medium tw-transition-colors tw-duration-200">
              Large
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Complex Content -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Contenido Complejo
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip
            content="Este es un tooltip con contenido largo que puede incluir múltiples líneas de texto para explicar conceptos complejos."
            maxWidth="300px"
            variant="light"
          >
            <button class="tw-bg-indigo-500 hover:tw-bg-indigo-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Contenido Largo
            </button>
          </app-tooltip>

          <app-tooltip maxWidth="250px">
            <button class="tw-bg-indigo-500 hover:tw-bg-indigo-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Contenido Custom
            </button>
            <div slot="tooltip-content" class="tw-text-left">
              <div class="tw-font-semibold tw-mb-1">Título del Tooltip</div>
              <div class="tw-text-sm tw-opacity-90">
                Contenido personalizado con estructura HTML.
              </div>
            </div>
          </app-tooltip>
        </div>
      </div>

      <!-- Without Arrow -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Sin Flecha
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Tooltip sin flecha indicadora" [arrow]="false" variant="light">
            <button class="tw-bg-teal-500 hover:tw-bg-teal-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Sin Flecha
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Interactive Elements -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Elementos Interactivos
        </h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
          <div class="tw-text-center">
            <app-tooltip content="Tooltip en un input" position="top">
              <input
                type="text"
                placeholder="Hover para ver tooltip"
                class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent"
              />
            </app-tooltip>
          </div>

          <div class="tw-text-center">
            <app-tooltip content="Información del ícono" variant="dark">
              <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-bg-gray-200 tw-rounded-full tw-cursor-pointer hover:tw-bg-gray-300 tw-transition-colors tw-duration-200">
                <svg class="tw-w-4 tw-h-4 tw-text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
            </app-tooltip>
          </div>

          <div class="tw-text-center">
            <app-tooltip content="Badge con información adicional" variant="success" position="bottom">
              <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium tw-bg-emerald-green-100 tw-text-emerald-green-800 tw-cursor-pointer">
                Estado: Activo
              </span>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- Delayed Tooltips -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Tooltips con Retraso
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Aparece inmediatamente" [delay]="0">
            <button class="tw-bg-orange-500 hover:tw-bg-orange-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Sin Retraso
            </button>
          </app-tooltip>

          <app-tooltip content="Aparece después de 500ms" [delay]="500">
            <button class="tw-bg-orange-500 hover:tw-bg-orange-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Retraso 500ms
            </button>
          </app-tooltip>

          <app-tooltip content="Aparece después de 1 segundo" [delay]="1000">
            <button class="tw-bg-orange-500 hover:tw-bg-orange-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Retraso 1s
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Disabled State -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">
          Estado Deshabilitado
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center tw-items-center tw-py-8">
          <app-tooltip content="Este tooltip está habilitado" [disabled]="false">
            <button class="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200">
              Tooltip Habilitado
            </button>
          </app-tooltip>

          <app-tooltip content="Este tooltip está deshabilitado" [disabled]="true">
            <button class="tw-bg-gray-400 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-cursor-not-allowed">
              Tooltip Deshabilitado
            </button>
          </app-tooltip>
        </div>
      </div>
    </div>
  `
})
export class TooltipExamplesComponent {
  // Component logic here if needed
}
