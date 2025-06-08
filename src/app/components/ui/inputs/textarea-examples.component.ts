import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaComponent } from './textarea';

@Component({
  selector: 'app-textarea-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, TextareaComponent],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Textarea</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Componente Textarea reutilizable con diferentes variantes, tamaños y funcionalidades
      </p>

      <!-- Variantes -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Variantes</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Default</h4>
            <app-textarea
              label="Comentarios"
              placeholder="Escribe tus comentarios aquí..."
              helperText="Este es un textarea por defecto"
              [(ngModel)]="defaultValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Success</h4>
            <app-textarea
              label="Descripción"
              placeholder="Descripción del proyecto..."
              variant="success"
              helperText="La descripción es válida"
              [(ngModel)]="successValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Error</h4>
            <app-textarea
              label="Mensaje"
              placeholder="Escribe tu mensaje..."
              variant="error"
              errorMessage="Este campo es requerido"
              [(ngModel)]="errorValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Info</h4>
            <app-textarea
              label="Instrucciones"
              placeholder="Proporciona instrucciones detalladas..."
              variant="info"
              helperText="Información adicional útil"
              [(ngModel)]="infoValue"
            />
          </div>
        </div>
      </div>

      <!-- Tamaños -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Tamaños</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Small</h4>
            <app-textarea
              label="Nota pequeña"
              placeholder="Nota breve..."
              size="sm"
              [rows]="2"
              [(ngModel)]="smallValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Medium (Default)</h4>
            <app-textarea
              label="Descripción"
              placeholder="Descripción estándar..."
              size="md"
              [rows]="4"
              [(ngModel)]="mediumValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Large</h4>
            <app-textarea
              label="Texto largo"
              placeholder="Contenido extenso..."
              size="lg"
              [rows]="6"
              [(ngModel)]="largeValue"
            />
          </div>
        </div>
      </div>

      <!-- Con Límite de Caracteres -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Con Límite de Caracteres</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Con Contador</h4>
            <app-textarea
              label="Descripción del producto"
              placeholder="Máximo 200 caracteres..."
              [maxLength]="200"
              [showCharacterCount]="true"
              helperText="Describe tu producto brevemente"
              [(ngModel)]="limitedValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Sin Contador Visual</h4>
            <app-textarea
              label="Reseña"
              placeholder="Máximo 500 caracteres..."
              [maxLength]="500"
              [showCharacterCount]="false"
              helperText="Comparte tu experiencia"
              [(ngModel)]="reviewValue"
            />
          </div>
        </div>
      </div>

      <!-- Estados -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estados</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Normal</h4>
            <app-textarea
              label="Comentario"
              placeholder="Escribe aquí..."
              [(ngModel)]="normalValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Deshabilitado</h4>
            <app-textarea
              label="Campo deshabilitado"
              placeholder="No puedes escribir aquí"
              [disabled]="true"
              [(ngModel)]="disabledValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Solo lectura</h4>
            <app-textarea
              label="Contenido de solo lectura"
              [readonly]="true"
              [(ngModel)]="readonlyValue"
            />
          </div>
        </div>
      </div>

      <!-- Con Redimensionamiento -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Redimensionamiento</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Sin Redimensionar (Default)</h4>
            <app-textarea
              label="Texto fijo"
              placeholder="No se puede redimensionar..."
              [resize]="false"
              [(ngModel)]="fixedValue"
            />
          </div>
          <div>
            <h4 class="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Redimensionable</h4>
            <app-textarea
              label="Texto redimensionable"
              placeholder="Puedes cambiar el tamaño verticalmente..."
              [resize]="true"
              [(ngModel)]="resizableValue"
            />
          </div>
        </div>
      </div>

      <!-- Requerido -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Campo Requerido</h3>
        <div class="tw-max-w-md">
          <app-textarea
            label="Mensaje obligatorio"
            placeholder="Este campo es requerido..."
            [required]="true"
            [variant]="requiredValue.trim() === '' ? 'error' : 'default'"
            [errorMessage]="requiredValue.trim() === '' ? 'Este campo es obligatorio' : ''"
            helperText="Por favor, completa este campo"
            [(ngModel)]="requiredValue"
          />
        </div>
      </div>

      <!-- Ejemplos de Validación -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Validación en Tiempo Real</h3>
        <div class="tw-max-w-md">
          <app-textarea
            label="Descripción del negocio"
            placeholder="Mínimo 20 caracteres..."
            [required]="true"
            [maxLength]="500"
            [showCharacterCount]="true"
            [variant]="getValidationVariant()"
            [errorMessage]="getValidationMessage()"
            helperText="Describe tu negocio (mínimo 20 caracteres)"
            [rows]="4"
            [(ngModel)]="validationValue"
          />
        </div>
      </div>

      <!-- Código de Ejemplo -->
      <div class="tw-bg-beige-50 tw-rounded-lg tw-p-4">
        <h4 class="tw-text-sm tw-font-semibold tw-text-emerald-green-700 tw-mb-3">Código de Ejemplo:</h4>
        <pre class="tw-text-sm tw-text-beige-700 tw-overflow-x-auto"><code>&lt;!-- Textarea básico --&gt;
&lt;app-textarea
  label="Comentarios"
  placeholder="Escribe tus comentarios..."
  [(ngModel)]="comentarios"&gt;
&lt;/app-textarea&gt;

&lt;!-- Textarea con validación --&gt;
&lt;app-textarea
  label="Descripción"
  placeholder="Describe tu producto..."
  [required]="true"
  [maxLength]="200"
  [showCharacterCount]="true"
  [variant]="descripcion.length &lt; 20 ? 'error' : 'success'"
  [errorMessage]="descripcion.length &lt; 20 ? 'Mínimo 20 caracteres' : ''"
  [(ngModel)]="descripcion"&gt;
&lt;/app-textarea&gt;

&lt;!-- Textarea redimensionable --&gt;
&lt;app-textarea
  label="Notas"
  placeholder="Notas adicionales..."
  [resize]="true"
  [rows]="6"
  size="lg"
  [(ngModel)]="notas"&gt;
&lt;/app-textarea&gt;</code></pre>
      </div>
    </div>
  `
})
export class TextareaExamplesComponent {
  // Values for different examples
  defaultValue = '';
  successValue = 'Esta es una descripción válida que cumple con todos los requisitos.';
  errorValue = '';
  infoValue = '';

  smallValue = '';
  mediumValue = '';
  largeValue = '';

  limitedValue = '';
  reviewValue = '';

  normalValue = '';
  disabledValue = 'Este texto no se puede editar porque el campo está deshabilitado.';
  readonlyValue = 'Este es contenido de solo lectura que no se puede modificar.';

  fixedValue = '';
  resizableValue = '';

  requiredValue = '';
  validationValue = '';

  getValidationVariant(): 'default' | 'success' | 'error' {
    if (this.validationValue.trim() === '') return 'error';
    if (this.validationValue.trim().length < 20) return 'error';
    return 'success';
  }

  getValidationMessage(): string {
    if (this.validationValue.trim() === '') return 'Este campo es requerido';
    if (this.validationValue.trim().length < 20) return 'Mínimo 20 caracteres requeridos';
    return '';
  }
}
