import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip';

@Component({
  selector: 'app-tooltip-examples',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  template: `
    <div class="space-y-8">
      <!-- Basic Tooltips -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Tooltips Básicos por Posición
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Tooltip en la parte superior" position="top">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Top
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip en la parte inferior" position="bottom">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Bottom
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip a la izquierda" position="left">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Left
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip a la derecha" position="right">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Right
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Different Triggers -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Diferentes Disparadores
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Se muestra al pasar el mouse" trigger="hover">
            <button class="bg-emerald-green-500 hover:bg-emerald-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Hover
            </button>
          </app-tooltip>

          <app-tooltip content="Se muestra al hacer clic" trigger="click">
            <button class="bg-emerald-green-500 hover:bg-emerald-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Click
            </button>
          </app-tooltip>

          <app-tooltip content="Se muestra al enfocar" trigger="focus">
            <button class="bg-emerald-green-500 hover:bg-emerald-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Focus
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Different Variants -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Diferentes Variantes
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Tooltip por defecto" variant="default">
            <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Default
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip oscuro" variant="dark">
            <button class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Dark
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip claro" variant="light">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Light
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip de éxito" variant="success">
            <button class="bg-emerald-green-500 hover:bg-emerald-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Success
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip de advertencia" variant="warning">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Warning
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip de error" variant="error">
            <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Error
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Diferentes Tamaños
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Tooltip pequeño" size="sm">
            <button class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200">
              Small
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip mediano (por defecto)" size="md">
            <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Medium
            </button>
          </app-tooltip>

          <app-tooltip content="Tooltip grande con más contenido y espacio" size="lg">
            <button class="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg text-lg font-medium transition-colors duration-200">
              Large
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Complex Content -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Contenido Complejo
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip
            content="Este es un tooltip con contenido largo que puede incluir múltiples líneas de texto para explicar conceptos complejos."
            maxWidth="300px"
            variant="light"
          >
            <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Contenido Largo
            </button>
          </app-tooltip>

          <app-tooltip maxWidth="250px">
            <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Contenido Custom
            </button>
            <div slot="tooltip-content" class="text-left">
              <div class="font-semibold mb-1">Título del Tooltip</div>
              <div class="text-sm opacity-90">
                Contenido personalizado con estructura HTML.
              </div>
            </div>
          </app-tooltip>
        </div>
      </div>

      <!-- Without Arrow -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Sin Flecha
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Tooltip sin flecha indicadora" [arrow]="false" variant="light">
            <button class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Sin Flecha
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Interactive Elements -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Elementos Interactivos
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="text-center">
            <app-tooltip content="Tooltip en un input" position="top">
              <input
                type="text"
                placeholder="Hover para ver tooltip"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </app-tooltip>
          </div>

          <div class="text-center">
            <app-tooltip content="Información del ícono" variant="dark">
              <div class="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors duration-200">
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
            </app-tooltip>
          </div>

          <div class="text-center">
            <app-tooltip content="Badge con información adicional" variant="success" position="bottom">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-green-100 text-emerald-green-800 cursor-pointer">
                Estado: Activo
              </span>
            </app-tooltip>
          </div>
        </div>
      </div>

      <!-- Delayed Tooltips -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Tooltips con Retraso
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Aparece inmediatamente" [delay]="0">
            <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Sin Retraso
            </button>
          </app-tooltip>

          <app-tooltip content="Aparece después de 500ms" [delay]="500">
            <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Retraso 500ms
            </button>
          </app-tooltip>

          <app-tooltip content="Aparece después de 1 segundo" [delay]="1000">
            <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Retraso 1s
            </button>
          </app-tooltip>
        </div>
      </div>

      <!-- Disabled State -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">
          Estado Deshabilitado
        </h3>
        <div class="flex flex-wrap gap-4 justify-center items-center py-8">
          <app-tooltip content="Este tooltip está habilitado" [disabled]="false">
            <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Tooltip Habilitado
            </button>
          </app-tooltip>

          <app-tooltip content="Este tooltip está deshabilitado" [disabled]="true">
            <button class="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed">
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
