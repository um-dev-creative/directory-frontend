import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent, SelectOption } from './select';

@Component({
  selector: 'app-select-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Componente Select</h2>
      <p class="text-beige-700 mb-6">
        Componente Select personalizado con los colores de la marca y funcionalidad completa.
      </p>

      <!-- Select Básico -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Select Básico</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-select
            label="País"
            placeholder="Selecciona tu país"
            [options]="countryOptions"
            [(ngModel)]="selectedValues.country"
            name="country">
          </app-select>

          <app-select
            label="Categoría"
            placeholder="Selecciona una categoría"
            [options]="categoryOptions"
            [(ngModel)]="selectedValues.category"
            name="category">
          </app-select>
        </div>
      </div>

      <!-- Estados de Validación -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estados de Validación</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-select
            label="Estado de Éxito"
            placeholder="Selección válida"
            [options]="statusOptions"
            [(ngModel)]="selectedValues.success"
            name="success"
            variant="success"
            helperText="Selección completada correctamente">
          </app-select>

          <app-select
            label="Estado de Error"
            placeholder="Selección con error"
            [options]="statusOptions"
            [(ngModel)]="selectedValues.error"
            name="error"
            variant="error"
            errorMessage="Debes seleccionar una opción válida">
          </app-select>

          <app-select
            label="Estado de Información"
            placeholder="Información adicional"
            [options]="statusOptions"
            [(ngModel)]="selectedValues.info"
            name="info"
            variant="info"
            helperText="Selecciona según tus preferencias">
          </app-select>
        </div>
      </div>

      <!-- Diferentes Tamaños -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Diferentes Tamaños</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-select
            label="Tamaño Pequeño"
            placeholder="Select pequeño..."
            [options]="sizeOptions"
            [(ngModel)]="selectedValues.small"
            name="small"
            size="sm">
          </app-select>

          <app-select
            label="Tamaño Mediano"
            placeholder="Select mediano..."
            [options]="sizeOptions"
            [(ngModel)]="selectedValues.medium"
            name="medium"
            size="md">
          </app-select>

          <app-select
            label="Tamaño Grande"
            placeholder="Select grande..."
            [options]="sizeOptions"
            [(ngModel)]="selectedValues.large"
            name="large"
            size="lg">
          </app-select>
        </div>
      </div>

      <!-- Estados Especiales -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estados Especiales</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-select
            label="Campo Requerido"
            placeholder="Este campo es obligatorio"
            [options]="priorityOptions"
            [(ngModel)]="selectedValues.required"
            name="required"
            [required]="true"
            helperText="Campo obligatorio">
          </app-select>

          <app-select
            label="Campo Deshabilitado"
            placeholder="Este campo está deshabilitado"
            [options]="priorityOptions"
            [(ngModel)]="selectedValues.disabled"
            name="disabled"
            [disabled]="true">
          </app-select>
        </div>
      </div>

      <!-- Select con Opciones Agrupadas -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Ejemplos Avanzados</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-select
            label="Meses del Año"
            placeholder="Selecciona un mes"
            [options]="monthOptions"
            [(ngModel)]="selectedValues.month"
            name="month"
            helperText="Útil para formularios de fecha">
          </app-select>

          <app-select
            label="Años Recientes"
            placeholder="Selecciona un año"
            [options]="yearOptions"
            [(ngModel)]="selectedValues.year"
            name="year"
            helperText="Años desde 2020 hasta actualidad">
          </app-select>
        </div>
      </div>

      <!-- Select con Opciones Deshabilitadas -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Opciones Deshabilitadas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-select
            label="Productos Disponibles"
            placeholder="Selecciona un producto"
            [options]="productOptions"
            [(ngModel)]="selectedValues.product"
            name="product"
            helperText="Algunos productos no están disponibles">
          </app-select>

          <app-select
            label="Servicios"
            placeholder="Selecciona un servicio"
            [options]="serviceOptions"
            [(ngModel)]="selectedValues.service"
            name="service"
            helperText="Servicios premium requieren suscripción">
          </app-select>
        </div>
      </div>

      <!-- Formulario de Ejemplo -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Formulario Completo</h3>
        <div class="bg-beige-50 p-6 rounded-lg border border-beige-200">
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-select
                label="País de Residencia"
                placeholder="Selecciona tu país"
                [options]="countryOptions"
                [(ngModel)]="formValues.country"
                name="formCountry"
                [required]="true">
              </app-select>

              <app-select
                label="Estado/Provincia"
                placeholder="Selecciona tu estado"
                [options]="stateOptions"
                [(ngModel)]="formValues.state"
                name="formState"
                [required]="true">
              </app-select>

              <app-select
                label="Industria"
                placeholder="Selecciona tu industria"
                [options]="industryOptions"
                [(ngModel)]="formValues.industry"
                name="formIndustry">
              </app-select>

              <app-select
                label="Tamaño de Empresa"
                placeholder="Selecciona el tamaño"
                [options]="companySizeOptions"
                [(ngModel)]="formValues.companySize"
                name="formCompanySize">
              </app-select>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                (click)="submitForm()"
                class="px-6 py-2 bg-emerald-green-600 text-white rounded-lg font-medium hover:bg-emerald-green-700 transition-colors">
                Enviar Formulario
              </button>

              <button
                type="button"
                (click)="clearForm()"
                class="px-6 py-2 bg-beige-200 text-emerald-green-700 rounded-lg font-medium hover:bg-beige-300 transition-colors">
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Valores Actuales (Demo) -->
      <div class="border-t border-beige-200 pt-6">
        <h3 class="text-lg font-semibold text-beige-700 mb-4">Valores Seleccionados (Demo)</h3>
        <div class="bg-beige-50 p-4 rounded-lg text-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-emerald-green-700 mb-2">Ejemplos Básicos:</h4>
              <pre class="text-beige-700 overflow-x-auto">{{ getBasicValuesForDisplay() }}</pre>
            </div>
            <div>
              <h4 class="font-medium text-emerald-green-700 mb-2">Formulario:</h4>
              <pre class="text-beige-700 overflow-x-auto">{{ getFormValuesForDisplay() }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SelectExamplesComponent {
  selectedValues = {
    country: '',
    category: '',
    success: 'active',
    error: '',
    info: '',
    small: '',
    medium: '',
    large: '',
    required: '',
    disabled: 'option1',
    month: '',
    year: '',
    product: '',
    service: ''
  };

  formValues = {
    country: '',
    state: '',
    industry: '',
    companySize: ''
  };

  // Opciones para diferentes selects
  countryOptions: SelectOption[] = [
    { value: 'mx', label: 'México' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'ca', label: 'Canadá' },
    { value: 'es', label: 'España' },
    { value: 'ar', label: 'Argentina' },
    { value: 'co', label: 'Colombia' },
    { value: 've', label: 'Venezuela' },
    { value: 'pe', label: 'Perú' },
    { value: 'cl', label: 'Chile' },
    { value: 'br', label: 'Brasil' }
  ];

  categoryOptions: SelectOption[] = [
    { value: 'tech', label: 'Tecnología' },
    { value: 'design', label: 'Diseño' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Ventas' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'hr', label: 'Recursos Humanos' }
  ];

  statusOptions: SelectOption[] = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'suspended', label: 'Suspendido' }
  ];

  sizeOptions: SelectOption[] = [
    { value: 'xs', label: 'Extra Pequeño' },
    { value: 'sm', label: 'Pequeño' },
    { value: 'md', label: 'Mediano' },
    { value: 'lg', label: 'Grande' },
    { value: 'xl', label: 'Extra Grande' }
  ];

  priorityOptions: SelectOption[] = [
    { value: 'low', label: 'Baja Prioridad' },
    { value: 'medium', label: 'Prioridad Media' },
    { value: 'high', label: 'Alta Prioridad' },
    { value: 'urgent', label: 'Urgente' }
  ];

  monthOptions: SelectOption[] = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  yearOptions: SelectOption[] = [
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' },
    { value: 2022, label: '2022' },
    { value: 2021, label: '2021' },
    { value: 2020, label: '2020' }
  ];

  productOptions: SelectOption[] = [
    { value: 'basic', label: 'Plan Básico' },
    { value: 'pro', label: 'Plan Pro' },
    { value: 'enterprise', label: 'Plan Enterprise', disabled: true },
    { value: 'custom', label: 'Plan Personalizado' },
    { value: 'trial', label: 'Prueba Gratuita', disabled: true }
  ];

  serviceOptions: SelectOption[] = [
    { value: 'support', label: 'Soporte Técnico' },
    { value: 'consulting', label: 'Consultoría', disabled: true },
    { value: 'training', label: 'Entrenamiento' },
    { value: 'premium', label: 'Soporte Premium', disabled: true },
    { value: 'maintenance', label: 'Mantenimiento' }
  ];

  stateOptions: SelectOption[] = [
    { value: 'cdmx', label: 'Ciudad de México' },
    { value: 'jal', label: 'Jalisco' },
    { value: 'nl', label: 'Nuevo León' },
    { value: 'pue', label: 'Puebla' },
    { value: 'qro', label: 'Querétaro' },
    { value: 'gto', label: 'Guanajuato' }
  ];

  industryOptions: SelectOption[] = [
    { value: 'tech', label: 'Tecnología' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'healthcare', label: 'Salud' },
    { value: 'education', label: 'Educación' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufactura' },
    { value: 'services', label: 'Servicios' }
  ];

  companySizeOptions: SelectOption[] = [
    { value: '1-10', label: '1-10 empleados' },
    { value: '11-50', label: '11-50 empleados' },
    { value: '51-200', label: '51-200 empleados' },
    { value: '201-500', label: '201-500 empleados' },
    { value: '500+', label: 'Más de 500 empleados' }
  ];

  getBasicValuesForDisplay(): string {
    return JSON.stringify({
      país: this.selectedValues.country,
      categoría: this.selectedValues.category,
      mes: this.selectedValues.month,
      año: this.selectedValues.year,
      producto: this.selectedValues.product
    }, null, 2);
  }

  getFormValuesForDisplay(): string {
    return JSON.stringify(this.formValues, null, 2);
  }

  submitForm(): void {
    alert('Formulario enviado! Revisa la consola para ver los datos.');
    console.log('Datos del formulario:', this.formValues);
  }

  clearForm(): void {
    this.formValues = {
      country: '',
      state: '',
      industry: '',
      companySize: ''
    };
  }
}
