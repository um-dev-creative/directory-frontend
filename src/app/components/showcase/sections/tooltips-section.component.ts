import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipExamplesComponent } from '../../ui/tooltips/tooltip-examples.component';

@Component({
  selector: 'app-tooltips-section',
  standalone: true,
  imports: [CommonModule, TooltipExamplesComponent],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
      <div class="tw-mb-6">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-2">
          Componente Tooltip
        </h2>
        <p class="tw-text-beige-700 tw-leading-relaxed">
          El componente Tooltip proporciona información contextual cuando los usuarios
          interactúan con elementos. Soporta múltiples posiciones, disparadores,
          variantes visuales y contenido personalizable.
        </p>
      </div>

      <!-- Features Overview -->
      <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4 tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Características Principales
        </h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-text-sm tw-text-beige-700">
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            4 posiciones: top, bottom, left, right
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            3 disparadores: hover, click, focus
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            6 variantes visuales
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            3 tamaños: sm, md, lg
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Retrasos configurables
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Contenido personalizable
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Flecha opcional
          </div>
          <div class="tw-flex tw-items-center">
            <span class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-mr-2"></span>
            Estado deshabilitado
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Ejemplos de Uso
        </h3>
        <div class="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-text-sm tw-font-mono tw-text-gray-700 tw-overflow-x-auto">
          <div class="tw-mb-4">
            <div class="tw-text-blue-600 tw-mb-2"><!-- Tooltip básico --></div>
            <span class="tw-text-blue-600">&lt;app-tooltip</span><br/>
            <span class="tw-ml-2 tw-text-green-600">content="Información útil"</span><br/>
            <span class="tw-ml-2 tw-text-green-600">position="top"</span><br/>
            <span class="tw-text-blue-600">&gt;</span><br/>
            <span class="tw-ml-2">&lt;button&gt;Hover me&lt;/button&gt;</span><br/>
            <span class="tw-text-blue-600">&lt;/app-tooltip&gt;</span>
          </div>

          <div class="tw-mb-4">
            <div class="tw-text-blue-600 tw-mb-2"><!-- Tooltip con contenido personalizado --></div>
            <span class="tw-text-blue-600">&lt;app-tooltip</span><br/>
            <span class="tw-ml-2 tw-text-green-600">variant="light"</span><br/>
            <span class="tw-ml-2 tw-text-green-600">maxWidth="200px"</span><br/>
            <span class="tw-text-blue-600">&gt;</span><br/>
            <span class="tw-ml-2">&lt;button&gt;Click me&lt;/button&gt;</span><br/>
            <span class="tw-ml-2">&lt;div slot="tooltip-content"&gt;</span><br/>
            <span class="tw-ml-4">Contenido personalizado</span><br/>
            <span class="tw-ml-2">&lt;/div&gt;</span><br/>
            <span class="tw-text-blue-600">&lt;/app-tooltip&gt;</span>
          </div>
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Ejemplos Interactivos
        </h3>
        <div class="tw-flex tw-flex-wrap tw-gap-3 tw-mb-4">
          <button
            type="button"
            class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowTooltipDemo()"
          >
            Demo Interactivo
          </button>
          <button
            type="button"
            class="tw-bg-emerald-green-500 hover:tw-bg-emerald-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowTooltipInfo()"
          >
            Mostrar Información
          </button>
          <button
            type="button"
            class="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors tw-duration-200"
            (click)="onShowTooltipWarning()"
          >
            Tooltip de Advertencia
          </button>
        </div>
      </div>

      <!-- Best Practices -->
      <div class="tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-3">
          Mejores Prácticas
        </h3>
        <div class="tw-bg-blue-50 tw-border-l-4 tw-border-blue-400 tw-p-4 tw-text-sm tw-text-blue-700">
          <ul class="tw-space-y-2">
            <li class="tw-flex tw-items-start">
              <span class="tw-w-2 tw-h-2 tw-bg-blue-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
              <span>Usa tooltips para información adicional, no para contenido esencial</span>
            </li>
            <li class="tw-flex tw-items-start">
              <span class="tw-w-2 tw-h-2 tw-bg-blue-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
              <span>Mantén el contenido del tooltip conciso y relevante</span>
            </li>
            <li class="tw-flex tw-items-start">
              <span class="tw-w-2 tw-h-2 tw-bg-blue-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
              <span>Usa la posición "top" por defecto, cambia solo si es necesario</span>
            </li>
            <li class="tw-flex tw-items-start">
              <span class="tw-w-2 tw-h-2 tw-bg-blue-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
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
