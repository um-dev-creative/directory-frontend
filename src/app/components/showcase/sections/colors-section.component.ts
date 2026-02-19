import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colors-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12">

      <!-- Paleta Principal de Colores -->
      <section>
        <h2 class="text-3xl font-bold text-emerald-green-700 mb-6">Sistema de Colores</h2>
        <p class="text-beige-700 mb-8 text-lg">
          Paleta de colores moderna con valores RGB para máxima flexibilidad y consistencia visual.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <!-- Emerald Green -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Emerald Green</h3>
            <div class="space-y-2">
              <div class="h-10 bg-emerald-green-50 rounded flex items-center justify-center text-xs border">50</div>
              <div class="h-10 bg-emerald-green-100 rounded flex items-center justify-center text-xs">100</div>
              <div class="h-10 bg-emerald-green-300 rounded flex items-center justify-center text-xs">300</div>
              <div class="h-10 bg-emerald-green-500 rounded flex items-center justify-center text-xs text-white font-semibold">500 ⭐</div>
              <div class="h-10 bg-emerald-green-700 rounded flex items-center justify-center text-xs text-white">700</div>
              <div class="h-10 bg-emerald-green-900 rounded flex items-center justify-center text-xs text-white">900</div>
            </div>
          </div>

          <!-- Coral -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-coral-700 mb-4">Coral</h3>
            <div class="space-y-2">
              <div class="h-10 bg-coral-50 rounded flex items-center justify-center text-xs border">50</div>
              <div class="h-10 bg-coral-100 rounded flex items-center justify-center text-xs">100</div>
              <div class="h-10 bg-coral-300 rounded flex items-center justify-center text-xs">300</div>
              <div class="h-10 bg-coral-500 rounded flex items-center justify-center text-xs text-white font-semibold">500 ⭐</div>
              <div class="h-10 bg-coral-700 rounded flex items-center justify-center text-xs text-white">700</div>
              <div class="h-10 bg-coral-900 rounded flex items-center justify-center text-xs text-white">900</div>
            </div>
          </div>

          <!-- Sky Blue -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-sky-blue-700 mb-4">Sky Blue</h3>
            <div class="space-y-2">
              <div class="h-10 bg-sky-blue-50 rounded flex items-center justify-center text-xs border">50</div>
              <div class="h-10 bg-sky-blue-100 rounded flex items-center justify-center text-xs">100</div>
              <div class="h-10 bg-sky-blue-200 rounded flex items-center justify-center text-xs">200</div>
              <div class="h-10 bg-sky-blue-300 rounded flex items-center justify-center text-xs text-white font-semibold">300 ⭐</div>
              <div class="h-10 bg-sky-blue-700 rounded flex items-center justify-center text-xs text-white">700</div>
              <div class="h-10 bg-sky-blue-900 rounded flex items-center justify-center text-xs text-white">900</div>
            </div>
          </div>

          <!-- Beige -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-beige-800 mb-4">Beige</h3>
            <div class="space-y-2">
              <div class="h-10 bg-beige-50 rounded flex items-center justify-center text-xs border">50</div>
              <div class="h-10 bg-beige-100 rounded flex items-center justify-center text-xs font-semibold">100 ⭐</div>
              <div class="h-10 bg-beige-300 rounded flex items-center justify-center text-xs">300</div>
              <div class="h-10 bg-beige-500 rounded flex items-center justify-center text-xs">500</div>
              <div class="h-10 bg-beige-700 rounded flex items-center justify-center text-xs text-white">700</div>
              <div class="h-10 bg-beige-900 rounded flex items-center justify-center text-xs text-white">900</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gradientes Modernos -->
      <section>
        <h3 class="text-2xl font-bold text-emerald-green-700 mb-6">Gradientes de Marca</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div class="bg-gradient-primary rounded-xl p-8 text-white text-center">
            <h4 class="font-semibold mb-2">Gradient Primary</h4>
            <p class="text-sm opacity-90">Emerald → Emerald Light</p>
            <code class="text-xs bg-black/20 px-2 py-1 rounded">bg-gradient-primary</code>
          </div>

          <div class="bg-gradient-warm rounded-xl p-8 text-center">
            <h4 class="font-semibold mb-2 text-beige-800">Gradient Warm</h4>
            <p class="text-sm text-beige-700">Beige → Coral Light</p>
            <code class="text-xs bg-white/50 px-2 py-1 rounded text-beige-800">bg-gradient-warm</code>
          </div>

          <div class="bg-gradient-sky rounded-xl p-8 text-center">
            <h4 class="font-semibold mb-2 text-sky-blue-800">Gradient Sky</h4>
            <p class="text-sm text-sky-blue-700">Sky Light → Sky</p>
            <code class="text-xs bg-white/70 px-2 py-1 rounded text-sky-blue-800">bg-gradient-sky</code>
          </div>
        </div>
      </section>

      <!-- Componentes con Colores -->
      <section>
        <h3 class="text-2xl font-bold text-emerald-green-700 mb-6">Componentes Prácticos</h3>

        <!-- Botones -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Botones</h4>
          <div class="flex flex-wrap gap-4">
            <button class="btn-primary">Primary Button</button>
            <button class="btn-secondary">Secondary Button</button>
            <button class="btn-outline">Outline Button</button>
            <button class="bg-emerald-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-green-600 transition">Emerald Button</button>
            <button class="bg-coral-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-coral-600 transition">Coral Button</button>
          </div>
        </div>

        <!-- Estados de transparencia -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Estados con Transparencia</h4>
          <p class="text-sm text-gray-600 mb-4">Ejemplos usando el nuevo sistema RGB con valores de transparencia.</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div style="background-color: rgb(46 139 87 / 0.1);" class="p-4 rounded-lg text-center border">
              <p class="text-sm font-medium text-emerald-green-600">Primary 10%</p>
              <code class="text-xs text-gray-600">rgb(46 139 87 / 0.1)</code>
            </div>
            <div style="background-color: rgb(46 139 87 / 0.2);" class="p-4 rounded-lg text-center border">
              <p class="text-sm font-medium text-emerald-green-600">Primary 20%</p>
              <code class="text-xs text-gray-600">rgb(46 139 87 / 0.2)</code>
            </div>
            <div style="background-color: rgb(255 111 97 / 0.1);" class="p-4 rounded-lg text-center border">
              <p class="text-sm font-medium text-coral-600">Secondary 10%</p>
              <code class="text-xs text-gray-600">rgb(255 111 97 / 0.1)</code>
            </div>
            <div style="background-color: rgb(135 206 235 / 0.1);" class="p-4 rounded-lg text-center border">
              <p class="text-sm font-medium text-sky-blue-600">Accent 10%</p>
              <code class="text-xs text-gray-600">rgb(135 206 235 / 0.1)</code>
            </div>
          </div>
        </div>

        <!-- Alerts -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Alerts & Notificaciones</h4>
          <div class="space-y-4">
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
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Cards</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card-brand">
              <h5 class="font-semibold text-emerald-green-700 mb-2">Card con Gradient</h5>
              <p class="text-emerald-green-600">Esta card usa el gradient suave de marca con sombra personalizada.</p>
            </div>
            <div class="bg-white rounded-xl shadow-soft p-6 border-l-4 border-emerald-green-500">
              <h5 class="font-semibold text-emerald-green-600 mb-2">Card con Border</h5>
              <p class="text-gray-600">Card con border de color primario y sombra suave.</p>
            </div>
          </div>
        </div>

        <!-- Badges y Tags -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Badges & Tags</h4>
          <div class="flex flex-wrap gap-3">
            <span class="bg-emerald-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Primary</span>
            <span class="bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-medium">Secondary</span>
            <span class="bg-sky-blue-300 text-white px-3 py-1 rounded-full text-sm font-medium">Accent</span>
            <span class="bg-emerald-green-100 text-emerald-green-700 px-3 py-1 rounded-full text-sm font-medium">Primary Light</span>
            <span class="bg-coral-100 text-coral-700 px-3 py-1 rounded-full text-sm font-medium">Secondary Light</span>
            <span class="bg-sky-blue-100 text-sky-blue-700 px-3 py-1 rounded-full text-sm font-medium">Accent Light</span>
            <span class="bg-beige-200 text-beige-800 px-3 py-1 rounded-full text-sm font-medium">Neutral</span>
            <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">Gray</span>
          </div>
        </div>

        <!-- Indicadores de progreso -->
        <div>
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Indicadores de Progreso</h4>
          <div class="space-y-4">
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-emerald-green-500 h-3 rounded-full w-3/4 transition-all duration-300"></div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-gradient-primary h-3 rounded-full w-1/2 transition-all duration-300"></div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-coral-500 h-3 rounded-full w-5/6 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de código -->
            <!-- Sección de código -->
      <section class="bg-gray-50 rounded-xl p-6">
        <h3 class="text-2xl font-bold text-emerald-green-700 mb-4">Sistema RGB Moderno</h3>

        <!-- Ejemplo de clases de utilidad -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-emerald-green-600 mb-4">Clases de Utilidad Disponibles</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-brand-primary-10 rounded-lg p-4 text-center">
              <div class="text-sm font-mono text-brand-primary">.bg-brand-primary-10</div>
            </div>
            <div class="bg-brand-primary-20 rounded-lg p-4 text-center">
              <div class="text-sm font-mono text-brand-primary">.bg-brand-primary-20</div>
            </div>
            <div class="bg-brand-secondary-10 rounded-lg p-4 text-center">
              <div class="text-sm font-mono text-brand-secondary">.bg-brand-secondary-10</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-900 rounded-lg p-4 text-green-400 text-sm font-mono">
          <div class="mb-2">/* Variables RGB para flexibilidad */</div>
          <div class="mb-2">--color-primary: 46 139 87;</div>
          <div class="mb-2">--color-secondary: 255 111 97;</div>
          <div class="mb-4"></div>
          <div class="mb-2">/* Uso con transparencia */</div>
          <div class="mb-2">background: rgb(var(--color-primary) / 0.1);</div>
          <div class="mb-4"></div>
          <div class="mb-2">/* Clases de utilidad disponibles */</div>
          <div class="mb-1">.bg-brand-primary-10, .bg-brand-primary-20, .bg-brand-primary-30</div>
          <div class="mb-1">.text-brand-primary, .border-brand-primary</div>
        </div>
      </section>
    </div>
  `
})
export class ColorsSectionComponent {}
