import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipExamplesComponent } from '../../ui/tooltips/tooltip-examples.component';

@Component({
  selector: 'app-tooltips-section',
  standalone: true,
  imports: [CommonModule, TooltipExamplesComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-emerald-green-700 mb-2">
          Componente Tooltip
        </h2>
        <p class="text-beige-700 leading-relaxed">
          El componente Tooltip proporciona información contextual cuando los usuarios
          interactúan con elementos. Soporta múltiples posiciones, disparadores,
          variantes visuales y contenido personalizable.
        </p>
      </div>

      <!-- Features Overview -->
      <div class="bg-beige-50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Características Principales
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-beige-700">
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            4 posiciones: top, bottom, left, right
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            3 disparadores: hover, click, focus
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            6 variantes visuales
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            3 tamaños: sm, md, lg
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Retrasos configurables
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Contenido personalizable
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Flecha opcional
          </div>
          <div class="flex items-center">
            <span class="w-2 h-2 bg-emerald-green-500 rounded-full mr-2"></span>
            Estado deshabilitado
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Ejemplos de Uso
        </h3>
        <div class="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-700 overflow-x-auto">
          <div class="mb-4">
            <div class="text-blue-600 mb-2"><!-- Tooltip básico --></div>
            <span class="text-blue-600">&lt;app-tooltip</span><br/>
            <span class="ml-2 text-green-600">content="Información útil"</span><br/>
            <span class="ml-2 text-green-600">position="top"</span><br/>
            <span class="text-blue-600">&gt;</span><br/>
            <span class="ml-2">&lt;button&gt;Hover me&lt;/button&gt;</span><br/>
            <span class="text-blue-600">&lt;/app-tooltip&gt;</span>
          </div>

          <div class="mb-4">
            <div class="text-blue-600 mb-2"><!-- Tooltip con contenido personalizado --></div>
            <span class="text-blue-600">&lt;app-tooltip</span><br/>
            <span class="ml-2 text-green-600">variant="light"</span><br/>
            <span class="ml-2 text-green-600">maxWidth="200px"</span><br/>
            <span class="text-blue-600">&gt;</span><br/>
            <span class="ml-2">&lt;button&gt;Click me&lt;/button&gt;</span><br/>
            <span class="ml-2">&lt;div slot="tooltip-content"&gt;</span><br/>
            <span class="ml-4">Contenido personalizado</span><br/>
            <span class="ml-2">&lt;/div&gt;</span><br/>
            <span class="text-blue-600">&lt;/app-tooltip&gt;</span>
          </div>
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Ejemplos Interactivos
        </h3>
        <div class="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            (click)="onShowTooltipDemo()"
          >
            Demo Interactivo
          </button>
          <button
            type="button"
            class="bg-emerald-green-500 hover:bg-emerald-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            (click)="onShowTooltipInfo()"
          >
            Mostrar Información
          </button>
          <button
            type="button"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            (click)="onShowTooltipWarning()"
          >
            Tooltip de Advertencia
          </button>
        </div>
      </div>

      <!-- Best Practices -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-3">
          Mejores Prácticas
        </h3>
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700">
          <ul class="space-y-2">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
              <span>Usa tooltips para información adicional, no para contenido esencial</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
              <span>Mantén el contenido del tooltip conciso y relevante</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
              <span>Usa la posición "top" por defecto, cambia solo si es necesario</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
              <span>Para elementos interactivos importantes, considera usar click en lugar de hover</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Examples -->
      <app-tooltip-examples></app-tooltip-examples>
    </div>
  `
})
export class TooltipsSectionComponent {
  @Output() showTooltipDemo = new EventEmitter<void>();
  @Output() showTooltipInfo = new EventEmitter<void>();
  @Output() showTooltipWarning = new EventEmitter<void>();

  onShowTooltipDemo() {
    this.showTooltipDemo.emit();
  }

  onShowTooltipInfo() {
    this.showTooltipInfo.emit();
  }

  onShowTooltipWarning() {
    this.showTooltipWarning.emit();
  }
}
