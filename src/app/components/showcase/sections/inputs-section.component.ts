import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button, InputComponent } from '@app/components/ui';

@Component({
  selector: 'app-inputs-section',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, Button],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Inputs</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Ejemplos de diferentes tipos de inputs con estilos consistentes
      </p>

      <!-- Inputs Básicos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Inputs Básicos</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
              Nombre
            </label>
            <input
              type="text"
              [(ngModel)]="formData.name"
              placeholder="Ingresa tu nombre"
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 placeholder:tw-text-beige-400 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all"
            />
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
              Email
            </label>
            <input
              type="email"
              [(ngModel)]="formData.email"
              placeholder="ejemplo@correo.com"
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 placeholder:tw-text-beige-400 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all"
            />
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              [(ngModel)]="formData.phone"
              placeholder="+1 234 567 8900"
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 placeholder:tw-text-beige-400 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all"
            />
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
              Sitio Web
            </label>
            <input
              type="url"
              [(ngModel)]="formData.website"
              placeholder="https://tusitio.com"
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 placeholder:tw-text-beige-400 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Estados de Input -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Estados de Input</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <!-- Input con error -->
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-alert-600 tw-mb-2">
              Campo con Error
            </label>
            <input
              type="text"
              value="Texto con error"
              class="tw-w-full tw-px-4 tw-py-3 tw-border-2 tw-border-alert-500 tw-rounded-lg tw-text-beige-800 tw-bg-alert-50 focus:tw-ring-2 focus:tw-ring-alert-500 focus:tw-border-alert-500 tw-transition-all"
            />
            <p class="tw-text-sm tw-text-alert-600 tw-mt-1">Este campo contiene errores</p>
          </div>

          <!-- Input exitoso -->
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-success-600 tw-mb-2">
              Campo Válido
            </label>
            <input
              type="text"
              value="Texto válido"
              class="tw-w-full tw-px-4 tw-py-3 tw-border-2 tw-border-success-500 tw-rounded-lg tw-text-beige-800 tw-bg-success-50 focus:tw-ring-2 focus:tw-ring-success-500 focus:tw-border-success-500 tw-transition-all"
            />
            <p class="tw-text-sm tw-text-success-600 tw-mt-1">Campo completado correctamente</p>
          </div>

          <!-- Input deshabilitado -->
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-500 tw-mb-2">
              Campo Deshabilitado
            </label>
            <input
              type="text"
              value="Campo no editable"
              disabled
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-200 tw-rounded-lg tw-text-beige-500 tw-bg-beige-100 tw-cursor-not-allowed"
            />
          </div>

          <!-- Input de solo lectura -->
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-600 tw-mb-2">
              Campo de Solo Lectura
            </label>
            <input
              type="text"
              value="Contenido de solo lectura"
              readonly
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-700 tw-bg-beige-50"
            />
          </div>
        </div>
      </div>

      <!-- Textarea -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Área de Texto</h3>
        <div>
          <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
            Mensaje
          </label>
          <textarea
            [(ngModel)]="formData.message"
            placeholder="Escribe tu mensaje aquí..."
            rows="4"
            class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 placeholder:tw-text-beige-400 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all tw-resize-y"
          ></textarea>
        </div>
      </div>

      <!-- Select -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Select</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
              País
            </label>
            <select
              [(ngModel)]="formData.country"
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all tw-bg-white"
            >
              <option value="">Selecciona un país</option>
              <option value="mx">México</option>
              <option value="us">Estados Unidos</option>
              <option value="ca">Canadá</option>
              <option value="es">España</option>
            </select>
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-green-700 tw-mb-2">
              Categoría
            </label>
            <select
              [(ngModel)]="formData.category"
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-beige-300 tw-rounded-lg tw-text-beige-800 focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-transition-all tw-bg-white"
            >
              <option value="">Selecciona una categoría</option>
              <option value="tech">Tecnología</option>
              <option value="design">Diseño</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Ventas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Checkboxes y Radio buttons -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Checkboxes y Radio Buttons</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
          <!-- Checkboxes -->
          <div>
            <h4 class="tw-text-md tw-font-medium tw-text-beige-700 tw-mb-3">Intereses</h4>
            <div class="tw-space-y-3">
              <label class="tw-flex tw-items-center tw-cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.interests.tech"
                  class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-border-beige-300 tw-rounded focus:tw-ring-emerald-green-500 focus:tw-ring-2"
                />
                <span class="tw-ml-3 tw-text-beige-700">Tecnología</span>
              </label>
              <label class="tw-flex tw-items-center tw-cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.interests.design"
                  class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-border-beige-300 tw-rounded focus:tw-ring-emerald-green-500 focus:tw-ring-2"
                />
                <span class="tw-ml-3 tw-text-beige-700">Diseño</span>
              </label>
              <label class="tw-flex tw-items-center tw-cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.interests.marketing"
                  class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-border-beige-300 tw-rounded focus:tw-ring-emerald-green-500 focus:tw-ring-2"
                />
                <span class="tw-ml-3 tw-text-beige-700">Marketing</span>
              </label>
            </div>
          </div>

          <!-- Radio buttons -->
          <div>
            <h4 class="tw-text-md tw-font-medium tw-text-beige-700 tw-mb-3">Tamaño de Empresa</h4>
            <div class="tw-space-y-3">
              <label class="tw-flex tw-items-center tw-cursor-pointer">
                <input
                  type="radio"
                  name="companySize"
                  value="small"
                  [(ngModel)]="formData.companySize"
                  class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-border-beige-300 focus:tw-ring-emerald-green-500 focus:tw-ring-2"
                />
                <span class="tw-ml-3 tw-text-beige-700">Pequeña (1-10 empleados)</span>
              </label>
              <label class="tw-flex tw-items-center tw-cursor-pointer">
                <input
                  type="radio"
                  name="companySize"
                  value="medium"
                  [(ngModel)]="formData.companySize"
                  class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-border-beige-300 focus:tw-ring-emerald-green-500 focus:tw-ring-2"
                />
                <span class="tw-ml-3 tw-text-beige-700">Mediana (11-100 empleados)</span>
              </label>
              <label class="tw-flex tw-items-center tw-cursor-pointer">
                <input
                  type="radio"
                  name="companySize"
                  value="large"
                  [(ngModel)]="formData.companySize"
                  class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-border-beige-300 focus:tw-ring-emerald-green-500 focus:tw-ring-2"
                />
                <span class="tw-ml-3 tw-text-beige-700">Grande (100+ empleados)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Valores del formulario -->
      <div class="tw-border-t tw-border-beige-200 tw-pt-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-700 tw-mb-4">Valores del Formulario</h3>
        <pre class="tw-bg-beige-50 tw-p-4 tw-rounded-lg tw-text-sm tw-text-beige-700 tw-overflow-auto">{{ getFormDataJson() }}</pre>
      </div>
    </div>

    <!-- Componente Input -->
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
  `
})
export class InputsSectionComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    website: '',
    message: '',
    country: '',
    category: '',
    interests: {
      tech: false,
      design: false,
      marketing: false
    },
    companySize: ''
  };

  inputValues = {
    basicName: '',
    email: '',
    password: '',
    phone: '',
    small: '',
    medium: '',
    large: '',
    successField: 'Datos válidos',
    errorField: 'Campo con error',
    infoField: '',
    search: '',
    website: '',
    formName: '',
    formLastName: '',
    formEmail: '',
    formPhone: ''
  };

  getFormDataJson(): string {
    return JSON.stringify(this.formData, null, 2);
  }

  getInputValuesForDisplay(): string {
    return JSON.stringify(this.inputValues, null, 2);
  }

  showFormSubmissionDemo(): void {
    alert('Formulario enviado! Revisa la consola para ver los datos.');
    console.log('Datos del formulario:', {
      nombre: this.inputValues.formName,
      apellido: this.inputValues.formLastName,
      email: this.inputValues.formEmail,
      telefono: this.inputValues.formPhone
    });
  }

  clearFormDemo(): void {
    this.inputValues.formName = '';
    this.inputValues.formLastName = '';
    this.inputValues.formEmail = '';
    this.inputValues.formPhone = '';
  }
}
