import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colors-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-space-y-12">

      <!-- Paleta Principal de Colores -->
      <section>
        <h2 class="tw-text-3xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Sistema de Colores</h2>
        <p class="tw-text-beige-700 tw-mb-8 tw-text-lg">
          Paleta de colores moderna con valores RGB para máxima flexibilidad y consistencia visual.
        </p>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-6 tw-mb-12">
          <!-- Emerald Green -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Emerald Green</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-10 tw-bg-emerald-green-50 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-border">50</div>
              <div class="tw-h-10 tw-bg-emerald-green-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-10 tw-bg-emerald-green-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-10 tw-bg-emerald-green-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white tw-font-semibold">500 ⭐</div>
              <div class="tw-h-10 tw-bg-emerald-green-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
              <div class="tw-h-10 tw-bg-emerald-green-900 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">900</div>
            </div>
          </div>

          <!-- Coral -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-coral-700 tw-mb-4">Coral</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-10 tw-bg-coral-50 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-border">50</div>
              <div class="tw-h-10 tw-bg-coral-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-10 tw-bg-coral-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-10 tw-bg-coral-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white tw-font-semibold">500 ⭐</div>
              <div class="tw-h-10 tw-bg-coral-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
              <div class="tw-h-10 tw-bg-coral-900 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">900</div>
            </div>
          </div>

          <!-- Sky Blue -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-sky-blue-700 tw-mb-4">Sky Blue</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-10 tw-bg-sky-blue-50 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-border">50</div>
              <div class="tw-h-10 tw-bg-sky-blue-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
              <div class="tw-h-10 tw-bg-sky-blue-200 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">200</div>
              <div class="tw-h-10 tw-bg-sky-blue-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white tw-font-semibold">300 ⭐</div>
              <div class="tw-h-10 tw-bg-sky-blue-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
              <div class="tw-h-10 tw-bg-sky-blue-900 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">900</div>
            </div>
          </div>

          <!-- Beige -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">Beige</h3>
            <div class="tw-space-y-2">
              <div class="tw-h-10 tw-bg-beige-50 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-border">50</div>
              <div class="tw-h-10 tw-bg-beige-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-semibold">100 ⭐</div>
              <div class="tw-h-10 tw-bg-beige-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
              <div class="tw-h-10 tw-bg-beige-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">500</div>
              <div class="tw-h-10 tw-bg-beige-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
              <div class="tw-h-10 tw-bg-beige-900 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">900</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gradientes Modernos -->
      <section>
        <h3 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Gradientes de Marca</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">

          <div class="tw-bg-gradient-primary tw-rounded-xl tw-p-8 tw-text-white tw-text-center">
            <h4 class="tw-font-semibold tw-mb-2">Gradient Primary</h4>
            <p class="tw-text-sm tw-opacity-90">Emerald → Emerald Light</p>
            <code class="tw-text-xs tw-bg-black/20 tw-px-2 tw-py-1 tw-rounded">tw-bg-gradient-primary</code>
          </div>

          <div class="tw-bg-gradient-warm tw-rounded-xl tw-p-8 tw-text-center">
            <h4 class="tw-font-semibold tw-mb-2 tw-text-beige-800">Gradient Warm</h4>
            <p class="tw-text-sm tw-text-beige-700">Beige → Coral Light</p>
            <code class="tw-text-xs tw-bg-white/50 tw-px-2 tw-py-1 tw-rounded tw-text-beige-800">tw-bg-gradient-warm</code>
          </div>

          <div class="tw-bg-gradient-sky tw-rounded-xl tw-p-8 tw-text-center">
            <h4 class="tw-font-semibold tw-mb-2 tw-text-sky-blue-800">Gradient Sky</h4>
            <p class="tw-text-sm tw-text-sky-blue-700">Sky Light → Sky</p>
            <code class="tw-text-xs tw-bg-white/70 tw-px-2 tw-py-1 tw-rounded tw-text-sky-blue-800">tw-bg-gradient-sky</code>
          </div>
        </div>
      </section>

      <!-- Componentes con Colores -->
      <section>
        <h3 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Componentes Prácticos</h3>

        <!-- Botones -->
        <div class="tw-mb-8">
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Botones</h4>
          <div class="tw-flex tw-flex-wrap tw-gap-4">
            <button class="btn-primary">Primary Button</button>
            <button class="btn-secondary">Secondary Button</button>
            <button class="btn-outline">Outline Button</button>
            <button class="tw-bg-emerald-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium hover:tw-bg-emerald-green-600 tw-transition">Emerald Button</button>
            <button class="tw-bg-coral-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium hover:tw-bg-coral-600 tw-transition">Coral Button</button>
          </div>
        </div>

        <!-- Estados de transparencia -->
        <div class="tw-mb-8">
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Estados con Transparencia</h4>
          <p class="tw-text-sm tw-text-gray-600 tw-mb-4">Ejemplos usando el nuevo sistema RGB con valores de transparencia.</p>
          <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
            <div style="background-color: rgb(46 139 87 / 0.1);" class="tw-p-4 tw-rounded-lg tw-text-center tw-border">
              <p class="tw-text-sm tw-font-medium tw-text-emerald-green-600">Primary 10%</p>
              <code class="tw-text-xs tw-text-gray-600">rgb(46 139 87 / 0.1)</code>
            </div>
            <div style="background-color: rgb(46 139 87 / 0.2);" class="tw-p-4 tw-rounded-lg tw-text-center tw-border">
              <p class="tw-text-sm tw-font-medium tw-text-emerald-green-600">Primary 20%</p>
              <code class="tw-text-xs tw-text-gray-600">rgb(46 139 87 / 0.2)</code>
            </div>
            <div style="background-color: rgb(255 111 97 / 0.1);" class="tw-p-4 tw-rounded-lg tw-text-center tw-border">
              <p class="tw-text-sm tw-font-medium tw-text-coral-600">Secondary 10%</p>
              <code class="tw-text-xs tw-text-gray-600">rgb(255 111 97 / 0.1)</code>
            </div>
            <div style="background-color: rgb(135 206 235 / 0.1);" class="tw-p-4 tw-rounded-lg tw-text-center tw-border">
              <p class="tw-text-sm tw-font-medium tw-text-sky-blue-600">Accent 10%</p>
              <code class="tw-text-xs tw-text-gray-600">rgb(135 206 235 / 0.1)</code>
            </div>
          </div>
        </div>

        <!-- Alerts -->
        <div class="tw-mb-8">
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Alerts & Notificaciones</h4>
          <div class="tw-space-y-4">
            <div class="alert-success">
              <strong>¡Éxito!</strong> La operación se completó correctamente.
            </div>
            <div class="alert-error">
              <strong>Error:</strong> Algo salió mal. Por favor intenta de nuevo.
            </div>
            <div class="alert-info">
              <strong>Información:</strong> Aquí tienes algunos datos útiles.
            </div>
          </div>
        </div>

        <!-- Cards -->
        <div class="tw-mb-8">
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Cards</h4>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
            <div class="card-brand">
              <h5 class="tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Card con Gradient</h5>
              <p class="tw-text-emerald-green-600">Esta card usa el gradient suave de marca con sombra personalizada.</p>
            </div>
            <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6 tw-border-l-4 tw-border-emerald-green-500">
              <h5 class="tw-font-semibold tw-text-emerald-green-600 tw-mb-2">Card con Border</h5>
              <p class="tw-text-gray-600">Card con border de color primario y sombra suave.</p>
            </div>
          </div>
        </div>

        <!-- Badges y Tags -->
        <div class="tw-mb-8">
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Badges & Tags</h4>
          <div class="tw-flex tw-flex-wrap tw-gap-3">
            <span class="tw-bg-emerald-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Primary</span>
            <span class="tw-bg-coral-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Secondary</span>
            <span class="tw-bg-sky-blue-300 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Accent</span>
            <span class="tw-bg-emerald-green-100 tw-text-emerald-green-700 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Primary Light</span>
            <span class="tw-bg-coral-100 tw-text-coral-700 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Secondary Light</span>
            <span class="tw-bg-sky-blue-100 tw-text-sky-blue-700 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Accent Light</span>
            <span class="tw-bg-beige-200 tw-text-beige-800 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Neutral</span>
            <span class="tw-bg-gray-200 tw-text-gray-700 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">Gray</span>
          </div>
        </div>

        <!-- Indicadores de progreso -->
        <div>
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Indicadores de Progreso</h4>
          <div class="tw-space-y-4">
            <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-3">
              <div class="tw-bg-emerald-green-500 tw-h-3 tw-rounded-full tw-w-3/4 tw-transition-all tw-duration-300"></div>
            </div>
            <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-3">
              <div class="tw-bg-gradient-primary tw-h-3 tw-rounded-full tw-w-1/2 tw-transition-all tw-duration-300"></div>
            </div>
            <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-3">
              <div class="tw-bg-coral-500 tw-h-3 tw-rounded-full tw-w-5/6 tw-transition-all tw-duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de código -->
            <!-- Sección de código -->
      <section class="tw-bg-gray-50 tw-rounded-xl tw-p-6">
        <h3 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-4">Sistema RGB Moderno</h3>

        <!-- Ejemplo de clases de utilidad -->
        <div class="tw-mb-6">
          <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-600 tw-mb-4">Clases de Utilidad Disponibles</h4>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mb-6">
            <div class="bg-brand-primary-10 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-sm tw-font-mono text-brand-primary">.bg-brand-primary-10</div>
            </div>
            <div class="bg-brand-primary-20 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-sm tw-font-mono text-brand-primary">.bg-brand-primary-20</div>
            </div>
            <div class="bg-brand-secondary-10 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-sm tw-font-mono text-brand-secondary">.bg-brand-secondary-10</div>
            </div>
          </div>
        </div>

        <div class="tw-bg-gray-900 tw-rounded-lg tw-p-4 tw-text-green-400 tw-text-sm tw-font-mono">
          <div class="tw-mb-2">/* Variables RGB para flexibilidad */</div>
          <div class="tw-mb-2">--color-primary: 46 139 87;</div>
          <div class="tw-mb-2">--color-secondary: 255 111 97;</div>
          <div class="tw-mb-4"></div>
          <div class="tw-mb-2">/* Uso con transparencia */</div>
          <div class="tw-mb-2">background: rgb(var(--color-primary) / 0.1);</div>
          <div class="tw-mb-4"></div>
          <div class="tw-mb-2">/* Clases de utilidad disponibles */</div>
          <div class="tw-mb-1">.bg-brand-primary-10, .bg-brand-primary-20, .bg-brand-primary-30</div>
          <div class="tw-mb-1">.text-brand-primary, .border-brand-primary</div>
        </div>
      </section>
    </div>
  `
})
export class ColorsSectionComponent {}
