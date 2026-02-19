import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button, InputComponent, TextareaComponent, SelectComponent, SelectOption } from '@app/components/ui';
import { InputExamplesComponent } from '@app/components/ui/inputs/input-examples.component';
import { SearchUsageExampleComponent } from '@app/features/search/search-usage-example';

@Component({
  selector: 'app-inputs-section',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, TextareaComponent, SelectComponent, Button, InputExamplesComponent, SearchUsageExampleComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Inputs</h2>
      <p class="text-beige-700 mb-6">
        Ejemplos de diferentes tipos de inputs con estilos consistentes
      </p>

      <!-- Inputs Básicos -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Inputs Básicos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-emerald-green-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              [(ngModel)]="formData.name"
              placeholder="Ingresa tu nombre"
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 placeholder:text-beige-400 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-green-700 mb-2">
              Email
            </label>
            <input
              type="email"
              [(ngModel)]="formData.email"
              placeholder="ejemplo@correo.com"
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 placeholder:text-beige-400 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-green-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              [(ngModel)]="formData.phone"
              placeholder="+1 234 567 8900"
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 placeholder:text-beige-400 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-green-700 mb-2">
              Sitio Web
            </label>
            <input
              type="url"
              [(ngModel)]="formData.website"
              placeholder="https://tusitio.com"
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 placeholder:text-beige-400 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Estados de Input -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estados de Input</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Input con error -->
          <div>
            <label class="block text-sm font-medium text-alert-600 mb-2">
              Campo con Error
            </label>
            <input
              type="text"
              value="Texto con error"
              class="w-full px-4 py-3 border-2 border-alert-500 rounded-lg text-beige-800 bg-alert-50 focus:ring-2 focus:ring-alert-500 focus:border-alert-500 transition-all"
            />
            <p class="text-sm text-alert-600 mt-1">Este campo contiene errores</p>
          </div>

          <!-- Input exitoso -->
          <div>
            <label class="block text-sm font-medium text-success-600 mb-2">
              Campo Válido
            </label>
            <input
              type="text"
              value="Texto válido"
              class="w-full px-4 py-3 border-2 border-success-500 rounded-lg text-beige-800 bg-success-50 focus:ring-2 focus:ring-success-500 focus:border-success-500 transition-all"
            />
            <p class="text-sm text-success-600 mt-1">Campo completado correctamente</p>
          </div>

          <!-- Input deshabilitado -->
          <div>
            <label class="block text-sm font-medium text-beige-500 mb-2">
              Campo Deshabilitado
            </label>
            <input
              type="text"
              value="Campo no editable"
              disabled
              class="w-full px-4 py-3 border border-beige-200 rounded-lg text-beige-500 bg-beige-100 cursor-not-allowed"
            />
          </div>

          <!-- Input de solo lectura -->
          <div>
            <label class="block text-sm font-medium text-beige-600 mb-2">
              Campo de Solo Lectura
            </label>
            <input
              type="text"
              value="Contenido de solo lectura"
              readonly
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-700 bg-beige-50"
            />
          </div>
        </div>
      </div>

      <!-- Textarea Components -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Componentes de Área de Texto</h3>

        <!-- Textarea básico -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Textarea Básico</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-textarea
              label="Descripción"
              placeholder="Escribe tu descripción aquí..."
              [(ngModel)]="textareaValues.basic"
              name="basicTextarea">
            </app-textarea>

            <app-textarea
              label="Comentarios"
              placeholder="Deja tus comentarios..."
              [(ngModel)]="textareaValues.comments"
              name="commentsTextarea"
              [rows]="6">
            </app-textarea>
          </div>
        </div>

        <!-- Textarea con límite de caracteres -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Con Límite de Caracteres</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-textarea
              label="Mensaje Corto"
              placeholder="Máximo 100 caracteres..."
              [(ngModel)]="textareaValues.short"
              name="shortTextarea"
              [maxLength]="100"
              [showCharacterCount]="true">
            </app-textarea>

            <app-textarea
              label="Mensaje Largo"
              placeholder="Máximo 500 caracteres..."
              [(ngModel)]="textareaValues.long"
              name="longTextarea"
              [maxLength]="500"
              [showCharacterCount]="true"
              [rows]="6">
            </app-textarea>
          </div>
        </div>

        <!-- Estados de Textarea -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Estados de Validación</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <app-textarea
              label="Estado de Éxito"
              placeholder="Campo válido..."
              [(ngModel)]="textareaValues.success"
              name="successTextarea"
              variant="success"
              helperText="Campo completado correctamente">
            </app-textarea>

            <app-textarea
              label="Estado de Error"
              placeholder="Campo con error..."
              [(ngModel)]="textareaValues.error"
              name="errorTextarea"
              variant="error"
              helperText="Este campo contiene errores">
            </app-textarea>

            <app-textarea
              label="Estado de Información"
              placeholder="Campo informativo..."
              [(ngModel)]="textareaValues.info"
              name="infoTextarea"
              variant="info"
              helperText="Información adicional">
            </app-textarea>
          </div>
        </div>

        <!-- Tamaños de Textarea -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Diferentes Tamaños</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <app-textarea
              label="Tamaño Pequeño"
              placeholder="Textarea pequeño..."
              [(ngModel)]="textareaValues.small"
              name="smallTextarea"
              size="sm">
            </app-textarea>

            <app-textarea
              label="Tamaño Mediano"
              placeholder="Textarea mediano..."
              [(ngModel)]="textareaValues.medium"
              name="mediumTextarea"
              size="md">
            </app-textarea>

            <app-textarea
              label="Tamaño Grande"
              placeholder="Textarea grande..."
              [(ngModel)]="textareaValues.large"
              name="largeTextarea"
              size="lg">
            </app-textarea>
          </div>
        </div>

        <!-- Textarea deshabilitado y requerido -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Estados Especiales</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-textarea
              label="Campo Requerido"
              placeholder="Este campo es obligatorio..."
              [(ngModel)]="textareaValues.required"
              name="requiredTextarea"
              [required]="true"
              helperText="Campo obligatorio">
            </app-textarea>

            <app-textarea
              label="Campo Deshabilitado"
              placeholder="Este campo está deshabilitado..."
              [(ngModel)]="textareaValues.disabled"
              name="disabledTextarea"
              [disabled]="true">
            </app-textarea>
          </div>
        </div>
      </div>

      <!-- Textarea Básico (HTML nativo para comparación) -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Textarea Nativo (Comparación)</h3>
        <div>
          <label class="block text-sm font-medium text-emerald-green-700 mb-2">
            Mensaje (HTML Nativo)
          </label>
          <textarea
            [(ngModel)]="formData.message"
            placeholder="Escribe tu mensaje aquí..."
            rows="4"
            class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 placeholder:text-beige-400 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all resize-y"
          ></textarea>
        </div>
      </div>

      <!-- Select Components -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Componentes Select</h3>

        <!-- Select básico -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Select Básico</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-select
              label="País"
              placeholder="Selecciona tu país"
              [options]="selectOptions.countries"
              [(ngModel)]="selectValues.country"
              name="selectCountry">
            </app-select>

            <app-select
              label="Categoría"
              placeholder="Selecciona una categoría"
              [options]="selectOptions.categories"
              [(ngModel)]="selectValues.category"
              name="selectCategory">
            </app-select>
          </div>
        </div>

        <!-- Estados de Select -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Estados de Validación</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <app-select
              label="Estado de Éxito"
              placeholder="Selección válida"
              [options]="selectOptions.status"
              [(ngModel)]="selectValues.success"
              name="selectSuccess"
              variant="success"
              helperText="Selección completada correctamente">
            </app-select>

            <app-select
              label="Estado de Error"
              placeholder="Selección con error"
              [options]="selectOptions.status"
              [(ngModel)]="selectValues.error"
              name="selectError"
              variant="error"
              errorMessage="Debes seleccionar una opción válida">
            </app-select>

            <app-select
              label="Estado de Información"
              placeholder="Información adicional"
              [options]="selectOptions.status"
              [(ngModel)]="selectValues.info"
              name="selectInfo"
              variant="info"
              helperText="Selecciona según tus preferencias">
            </app-select>
          </div>
        </div>

        <!-- Tamaños de Select -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Diferentes Tamaños</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <app-select
              label="Tamaño Pequeño"
              placeholder="Select pequeño..."
              [options]="selectOptions.sizes"
              [(ngModel)]="selectValues.small"
              name="selectSmall"
              size="sm">
            </app-select>

            <app-select
              label="Tamaño Mediano"
              placeholder="Select mediano..."
              [options]="selectOptions.sizes"
              [(ngModel)]="selectValues.medium"
              name="selectMedium"
              size="md">
            </app-select>

            <app-select
              label="Tamaño Grande"
              placeholder="Select grande..."
              [options]="selectOptions.sizes"
              [(ngModel)]="selectValues.large"
              name="selectLarge"
              size="lg">
            </app-select>
          </div>
        </div>

        <!-- Select deshabilitado y requerido -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-emerald-green-600 mb-3">Estados Especiales</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-select
              label="Campo Requerido"
              placeholder="Este campo es obligatorio"
              [options]="selectOptions.priorities"
              [(ngModel)]="selectValues.required"
              name="selectRequired"
              [required]="true"
              helperText="Campo obligatorio">
            </app-select>

            <app-select
              label="Campo Deshabilitado"
              placeholder="Este campo está deshabilitado"
              [options]="selectOptions.priorities"
              [(ngModel)]="selectValues.disabled"
              name="selectDisabled"
              [disabled]="true">
            </app-select>
          </div>
        </div>
      </div>

      <!-- Select Nativo (HTML para comparación) -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Select Nativo (Comparación)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-emerald-green-700 mb-2">
              País (HTML Nativo)
            </label>
            <select
              [(ngModel)]="formData.country"
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all bg-white"
            >
              <option value="">Selecciona un país</option>
              <option value="mx">México</option>
              <option value="us">Estados Unidos</option>
              <option value="ca">Canadá</option>
              <option value="es">España</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-green-700 mb-2">
              Categoría (HTML Nativo)
            </label>
            <select
              [(ngModel)]="formData.category"
              class="w-full px-4 py-3 border border-beige-300 rounded-lg text-beige-800 focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 transition-all bg-white"
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
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Checkboxes y Radio Buttons</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Checkboxes -->
          <div>
            <h4 class="text-md font-medium text-beige-700 mb-3">Intereses</h4>
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.interests.tech"
                  class="w-4 h-4 text-emerald-green-600 border-beige-300 rounded focus:ring-emerald-green-500 focus:ring-2"
                />
                <span class="ml-3 text-beige-700">Tecnología</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.interests.design"
                  class="w-4 h-4 text-emerald-green-600 border-beige-300 rounded focus:ring-emerald-green-500 focus:ring-2"
                />
                <span class="ml-3 text-beige-700">Diseño</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.interests.marketing"
                  class="w-4 h-4 text-emerald-green-600 border-beige-300 rounded focus:ring-emerald-green-500 focus:ring-2"
                />
                <span class="ml-3 text-beige-700">Marketing</span>
              </label>
            </div>
          </div>

          <!-- Radio buttons -->
          <div>
            <h4 class="text-md font-medium text-beige-700 mb-3">Tamaño de Empresa</h4>
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="companySize"
                  value="small"
                  [(ngModel)]="formData.companySize"
                  class="w-4 h-4 text-emerald-green-600 border-beige-300 focus:ring-emerald-green-500 focus:ring-2"
                />
                <span class="ml-3 text-beige-700">Pequeña (1-10 empleados)</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="companySize"
                  value="medium"
                  [(ngModel)]="formData.companySize"
                  class="w-4 h-4 text-emerald-green-600 border-beige-300 focus:ring-emerald-green-500 focus:ring-2"
                />
                <span class="ml-3 text-beige-700">Mediana (11-100 empleados)</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="companySize"
                  value="large"
                  [(ngModel)]="formData.companySize"
                  class="w-4 h-4 text-emerald-green-600 border-beige-300 focus:ring-emerald-green-500 focus:ring-2"
                />
                <span class="ml-3 text-beige-700">Grande (100+ empleados)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Valores del formulario -->
      <div class="border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-beige-700 mb-4">Valores del Formulario</h3>
        <pre class="bg-beige-50 p-4 rounded-lg text-sm text-beige-700 overflow-auto">{{ getFormDataJson() }}</pre>
      </div>
    </div>

    <!-- Componente Input -->
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Componente Input</h2>
      <p class="text-beige-700 mb-6">
        Componente Input reutilizable con colores de marca y funcionalidades avanzadas
      </p>

      <!-- Inputs Básicos -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Inputs Básicos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            [(ngModel)]="inputValues.email"
            style="border: none; padding: 0; background: transparent;">
          </app-input>

          <app-input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            [clearable]="true"
            [(ngModel)]="inputValues.password"
            style="border: none; padding: 0; background: transparent;">
          </app-input>

          <app-input
            label="Teléfono"
            type="tel"
            placeholder="+58 424 123 4567"
            [leadingIcon]="true"
            [(ngModel)]="inputValues.phone"
            style="border: none; padding: 0; background: transparent;">
            <svg slot="leading-icon" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </app-input>
        </div>
      </div>

      <!-- Tamaños -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
        <div class="space-y-4">
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
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Variantes de Estado</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Iconos y Funciones</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-input
            label="Buscar"
            type="search"
            placeholder="Buscar productos..."
            [leadingIcon]="true"
            [clearable]="true"
            [(ngModel)]="inputValues.search"
            style="border: none; padding: 0; background: transparent;">
            <svg slot="leading-icon" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </app-input>

          <app-input
            label="Sitio Web"
            type="url"
            placeholder="https://ejemplo.com"
            [leadingIcon]="true"
            [(ngModel)]="inputValues.website"
            style="border: none; padding: 0; background: transparent;">
            <svg slot="leading-icon" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </app-input>
        </div>
      </div>

      <!-- Formulario Completo de Ejemplo -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Formulario Completo</h3>
        <div class="bg-beige-50 p-6 rounded-lg border border-beige-200">
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="formEmail"
                style="border: none; padding: 0; background: transparent;">
              </app-input>

              <app-input
                label="Teléfono"
                type="tel"
                placeholder="+58 424 123 4567"
                [(ngModel)]="inputValues.formPhone"
                name="formPhone"
                style="border: none; padding: 0; background: transparent;">
              </app-input>
            </div>

            <div class="flex gap-4 pt-4">
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
      <div class="border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-beige-700 mb-4">Valores Actuales (Demo)</h3>
        <div class="bg-beige-50 p-4 rounded-lg text-sm">
          <pre class="text-beige-700 overflow-x-auto">{{ getInputValuesForDisplay() }}</pre>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <div class="bg-beige-50 p-6 rounded-lg border border-beige-200">
        <app-input-examples></app-input-examples>
      </div>
    </div>
    <app-search-usage-example></app-search-usage-example>
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

  textareaValues = {
    basic: '',
    comments: '',
    short: '',
    long: '',
    success: 'Contenido válido',
    error: 'Contenido con error',
    info: '',
    small: '',
    medium: '',
    large: '',
    required: '',
    disabled: 'Contenido deshabilitado'
  };

  selectValues = {
    country: '',
    category: '',
    success: 'active',
    error: '',
    info: '',
    small: '',
    medium: '',
    large: '',
    required: '',
    disabled: 'option1'
  };

  selectOptions = {
    countries: [
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'Estados Unidos' },
      { value: 'ca', label: 'Canadá' },
      { value: 'es', label: 'España' },
      { value: 'ar', label: 'Argentina' },
      { value: 'co', label: 'Colombia' }
    ] as SelectOption[],
    categories: [
      { value: 'tech', label: 'Tecnología' },
      { value: 'design', label: 'Diseño' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Ventas' },
      { value: 'finance', label: 'Finanzas' }
    ] as SelectOption[],
    status: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'pending', label: 'Pendiente' },
      { value: 'suspended', label: 'Suspendido' }
    ] as SelectOption[],
    sizes: [
      { value: 'xs', label: 'Extra Pequeño' },
      { value: 'sm', label: 'Pequeño' },
      { value: 'md', label: 'Mediano' },
      { value: 'lg', label: 'Grande' },
      { value: 'xl', label: 'Extra Grande' }
    ] as SelectOption[],
    priorities: [
      { value: 'low', label: 'Baja Prioridad' },
      { value: 'medium', label: 'Prioridad Media' },
      { value: 'high', label: 'Alta Prioridad' },
      { value: 'urgent', label: 'Urgente' }
    ] as SelectOption[]
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
