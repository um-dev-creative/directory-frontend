import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button, BadgeComponent, TextComponent } from '@app/components/ui';

@Component({
  selector: 'app-text-section',
  standalone: true,
  imports: [CommonModule, Button, TextComponent, BadgeComponent],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Texto</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Sistema de tipografía completo con variantes, tamaños y estilos consistentes con el diseño de marca
      </p>

      <!-- Jerarquía de Títulos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Jerarquía de Títulos</h3>
        <div class="tw-space-y-4">
          <app-text variant="h1" color="primary">
            Título H1 - Principal
          </app-text>
          <app-text variant="h2" color="primary">
            Título H2 - Sección
          </app-text>
          <app-text variant="h3" color="primary">
            Título H3 - Subsección
          </app-text>
          <app-text variant="h4" color="primary">
            Título H4 - Componente
          </app-text>
          <app-text variant="h5" color="primary">
            Título H5 - Subcomponente
          </app-text>
          <app-text variant="h6" color="primary">
            Título H6 - Detalle
          </app-text>
        </div>
      </div>

      <!-- Variantes de Texto -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes de Texto</h3>
        <div class="tw-space-y-3">
          <div>
            <app-text variant="body-large" color="dark">
              Texto body large - Para párrafos importantes o destacados
            </app-text>
          </div>
          <div>
            <app-text variant="body" color="dark">
              Texto body normal - Para el contenido principal de párrafos y descripciones estándar
            </app-text>
          </div>
          <div>
            <app-text variant="body-small" color="muted">
              Texto body small - Para contenido secundario o textos de menor jerarquía
            </app-text>
          </div>
          <div>
            <app-text variant="caption" color="muted">
              Texto caption - Para metadatos, fechas y información auxiliar
            </app-text>
          </div>
          <div>
            <app-text variant="overline" color="muted">
              Texto overline - Para etiquetas y categorías
            </app-text>
          </div>
          <div>
            <app-text variant="label" color="dark">
              Texto label - Para etiquetas de formulario y campos
            </app-text>
          </div>
        </div>
      </div>

      <!-- Tamaños Personalizados -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños Personalizados</h3>
        <div class="tw-space-y-3">
          <app-text size="xs" color="dark">Texto XS (12px)</app-text>
          <app-text size="sm" color="dark">Texto SM (14px)</app-text>
          <app-text size="md" color="dark">Texto MD (16px)</app-text>
          <app-text size="lg" color="dark">Texto LG (18px)</app-text>
          <app-text size="xl" color="dark">Texto XL (20px)</app-text>
          <app-text size="2xl" color="dark">Texto 2XL (24px)</app-text>
          <app-text size="3xl" color="dark">Texto 3XL (30px)</app-text>
        </div>
      </div>

      <!-- Pesos de Fuente -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Pesos de Fuente</h3>
        <div class="tw-space-y-2">
          <app-text weight="light" color="dark">Texto Light (300)</app-text>
          <app-text weight="normal" color="dark">Texto Normal (400)</app-text>
          <app-text weight="medium" color="dark">Texto Medium (500)</app-text>
          <app-text weight="semibold" color="dark">Texto Semibold (600)</app-text>
          <app-text weight="bold" color="dark">Texto Bold (700)</app-text>
          <app-text weight="extrabold" color="dark">Texto Extrabold (800)</app-text>
        </div>
      </div>

      <!-- Colores de Marca -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Colores de Marca</h3>
        <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-4">
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="primary" weight="semibold">Primario</app-text>
            <app-text size="sm" color="primary">Emerald Green</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="secondary" weight="semibold">Secundario</app-text>
            <app-text size="sm" color="secondary">Sky Blue</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="success" weight="semibold">Éxito</app-text>
            <app-text size="sm" color="success">Verde</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="error" weight="semibold">Error</app-text>
            <app-text size="sm" color="error">Coral</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="warning" weight="semibold">Advertencia</app-text>
            <app-text size="sm" color="warning">Naranja</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="info" weight="semibold">Información</app-text>
            <app-text size="sm" color="info">Azul Cielo</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="muted" weight="semibold">Silenciado</app-text>
            <app-text size="sm" color="muted">Beige</app-text>
          </div>
          <div class="tw-p-3 tw-bg-beige-50 tw-rounded-lg">
            <app-text color="dark" weight="semibold">Oscuro</app-text>
            <app-text size="sm" color="dark">Beige Oscuro</app-text>
          </div>
        </div>
      </div>

      <!-- Alineación -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Alineación de Texto</h3>
        <div class="tw-space-y-4 tw-bg-beige-50 tw-p-6 tw-rounded-lg">
          <app-text align="left" color="dark">
            Texto alineado a la izquierda - Alineación estándar para la mayoría de contenido
          </app-text>
          <app-text align="center" color="dark">
            Texto centrado - Ideal para títulos y contenido destacado
          </app-text>
          <app-text align="right" color="dark">
            Texto alineado a la derecha - Para datos numéricos y casos especiales
          </app-text>
          <app-text align="justify" color="dark">
            Texto justificado - Para párrafos largos donde se necesita una alineación uniforme en ambos lados del contenido, creando líneas de longitud consistente.
          </app-text>
        </div>
      </div>

      <!-- Transformaciones -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Transformaciones de Texto</h3>
        <div class="tw-space-y-3">
          <app-text transform="uppercase" color="dark" weight="semibold">
            Texto en mayúsculas - perfecto para títulos
          </app-text>
          <app-text transform="lowercase" color="dark">
            Texto en minúsculas - para contenido específico
          </app-text>
          <app-text transform="capitalize" color="dark">
            texto capitalizado - primera letra en mayúscula
          </app-text>
        </div>
      </div>

      <!-- Utilidades de Texto -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Utilidades de Texto</h3>
        <div class="tw-space-y-4">
          <div>
            <app-text color="dark" weight="medium" class="tw-block tw-mb-2">Texto truncado:</app-text>
            <div class="tw-max-w-64 tw-bg-beige-50 tw-p-3 tw-rounded">
              <app-text [truncate]="true" color="dark">
                Este es un texto muy largo que será truncado cuando exceda el ancho del contenedor
              </app-text>
            </div>
          </div>

          <div>
            <app-text color="dark" weight="medium" class="tw-block tw-mb-2">Texto en cursiva:</app-text>
            <app-text [italic]="true" color="dark">
              Este texto está en cursiva para darle énfasis
            </app-text>
          </div>

          <div>
            <app-text color="dark" weight="medium" class="tw-block tw-mb-2">Texto subrayado:</app-text>
            <app-text [underline]="true" color="dark">
              Este texto está subrayado para destacarlo
            </app-text>
          </div>
        </div>
      </div>

      <!-- Espaciado de Líneas -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Espaciado de Líneas</h3>
        <div class="tw-space-y-6">
          <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
            <app-text size="sm" color="muted" weight="medium" class="tw-block tw-mb-2">Tight (Compacto):</app-text>
            <app-text lineHeight="tight" color="dark">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </app-text>
          </div>

          <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
            <app-text size="sm" color="muted" weight="medium" class="tw-block tw-mb-2">Normal (Estándar):</app-text>
            <app-text lineHeight="normal" color="dark">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </app-text>
          </div>

          <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
            <app-text size="sm" color="muted" weight="medium" class="tw-block tw-mb-2">Relaxed (Relajado):</app-text>
            <app-text lineHeight="relaxed" color="dark">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </app-text>
          </div>
        </div>
      </div>

      <!-- Casos de Uso Reales -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Casos de Uso en Directorio</h3>

        <!-- Tarjeta de Empresa Ejemplo -->
        <div class="tw-bg-gradient-to-br tw-from-emerald-green-50 tw-to-sky-blue-50 tw-p-6 tw-rounded-xl tw-border tw-border-beige-200">
          <div class="tw-flex tw-items-start tw-justify-between tw-mb-4">
            <div class="tw-flex-1">
              <app-text variant="h4" element="h3" color="primary" class="tw-mb-1">
                Restaurante El Sabor Caraqueño
              </app-text>
              <app-text variant="body-small" color="secondary" class="tw-mb-2">
                Restaurante • Comida Venezolana
              </app-text>
              <div class="tw-flex tw-items-center tw-space-x-2 tw-mb-3">
                <app-badge variant="success" size="xs">Abierto</app-badge>
                <app-text variant="caption" color="muted">
                  ⭐ 4.8 (125 reseñas)
                </app-text>
              </div>
            </div>
            <app-text variant="overline" color="warning" class="tw-bg-orange-100 tw-px-2 tw-py-1 tw-rounded">
              Promovido
            </app-text>
          </div>

          <app-text variant="body" color="dark" class="tw-mb-4">
            Auténtica comida venezolana en el corazón de la ciudad. Especialistas en arepas, pabellón criollo y postres tradicionales.
          </app-text>

          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <app-text variant="caption" color="muted">
                📍 Av. Francisco de Miranda, Caracas
              </app-text>
              <app-text variant="caption" color="muted" class="tw-block">
                📞 +58 212 123 4567
              </app-text>
            </div>
            <div class="tw-flex tw-space-x-2">
              <app-button variant="primary" size="sm">
                Ver Detalles
              </app-button>
              <app-button variant="outline" size="sm">
                Contactar
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Accesibilidad y Mejores Prácticas -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Mejores Prácticas</h3>
        <div class="tw-bg-emerald-green-50 tw-p-6 tw-rounded-lg tw-border tw-border-emerald-green-200">
          <app-text variant="h6" color="primary" class="tw-mb-3">
            Recomendaciones de Uso:
          </app-text>
          <ul class="tw-space-y-2">
            <li>
              <app-text variant="body-small" color="dark">
                • Usa <strong>variants</strong> para consistencia semántica en la jerarquía
              </app-text>
            </li>
            <li>
              <app-text variant="body-small" color="dark">
                • Combina <strong>element</strong> y <strong>variant</strong> para HTML semántico correcto
              </app-text>
            </li>
            <li>
              <app-text variant="body-small" color="dark">
                • Los <strong>colores de marca</strong> mantienen la identidad visual consistente
              </app-text>
            </li>
            <li>
              <app-text variant="body-small" color="dark">
                • Usa <strong>truncate</strong> para texto largo en espacios limitados
              </app-text>
            </li>
            <li>
              <app-text variant="body-small" color="dark">
                • El <strong>lineHeight</strong> mejora la legibilidad en párrafos largos
              </app-text>
            </li>
          </ul>
        </div>
      </div>

      <!-- Interacción de Demostración -->
      <div class="tw-mt-8 tw-pt-6 tw-border-t tw-border-beige-200">
        <app-text variant="caption" color="muted" class="tw-block tw-text-center">
          Último componente UI creado: Sistema de Tipografía Completo
        </app-text>
      </div>
    </div>
  `
})
export class TextSectionComponent {
  @Output() textDemo = new EventEmitter<string>();

  onTextDemo(demo: string) {
    this.textDemo.emit(demo);
  }
}
