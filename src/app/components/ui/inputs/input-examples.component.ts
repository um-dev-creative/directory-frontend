import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from './input';
import { Button } from '../buttons/button';

@Component({
  selector: 'app-input-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent, Button],
  template: `
    <div class="tw-container tw-mx-auto tw-p-8 tw-max-w-4xl">
      <h1 class="tw-text-3xl tw-font-bold tw-text-emerald-green-700 tw-mb-8">
        Ejemplos de Componente Input
      </h1>

      <!-- Basic Inputs -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Inputs Básicos</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <!-- Default Input -->
          <div>
            <app-input
              label="Nombre completo"
              placeholder="Ingresa tu nombre"
              helperText="Este campo es requerido"
              [required]="true"
              [(ngModel)]="basicForm.name">
            </app-input>
          </div>

          <!-- Email Input -->
          <div>
            <app-input
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              variant="info"
              [(ngModel)]="basicForm.email">
            </app-input>
          </div>

          <!-- Password Input -->
          <div>
            <app-input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              [clearable]="true"
              [(ngModel)]="basicForm.password">
            </app-input>
          </div>

          <!-- Phone Input -->
          <div>
            <app-input
              label="Teléfono"
              type="tel"
              placeholder="+58 424 123 4567"
              [leadingIcon]="true"
              [(ngModel)]="basicForm.phone">
              <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </app-input>
          </div>
        </div>
      </section>

      <!-- Sizes -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Tamaños</h2>

        <div class="tw-space-y-4">
          <app-input
            label="Input Pequeño"
            size="sm"
            placeholder="Tamaño pequeño"
            [(ngModel)]="sizeForm.small">
          </app-input>

          <app-input
            label="Input Mediano"
            size="md"
            placeholder="Tamaño mediano (default)"
            [(ngModel)]="sizeForm.medium">
          </app-input>

          <app-input
            label="Input Grande"
            size="lg"
            placeholder="Tamaño grande"
            [(ngModel)]="sizeForm.large">
          </app-input>
        </div>
      </section>

      <!-- Variants -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Variantes</h2>

        <div class="tw-space-y-4">
          <app-input
            label="Input Por Defecto"
            variant="default"
            placeholder="Estado normal"
            helperText="Este es un input en estado normal"
            [(ngModel)]="variantForm.default">
          </app-input>

          <app-input
            label="Input Exitoso"
            variant="success"
            placeholder="Estado de éxito"
            helperText="✓ Los datos son válidos"
            [(ngModel)]="variantForm.success">
          </app-input>

          <app-input
            label="Input con Error"
            variant="error"
            placeholder="Estado de error"
            errorMessage="Este campo contiene errores"
            [(ngModel)]="variantForm.error">
          </app-input>

          <app-input
            label="Input Informativo"
            variant="info"
            placeholder="Estado informativo"
            helperText="ℹ Información adicional sobre este campo"
            [(ngModel)]="variantForm.info">
          </app-input>
        </div>
      </section>

      <!-- States -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Estados</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <app-input
            label="Input Deshabilitado"
            placeholder="Este input está deshabilitado"
            [disabled]="true"
            helperText="Este campo no se puede editar">
          </app-input>

          <app-input
            label="Input Solo Lectura"
            placeholder="Solo lectura"
            [readonly]="true"
            [ngModel]="'Valor de solo lectura'"
            helperText="Este campo es de solo lectura">
          </app-input>
        </div>
      </section>

      <!-- With Icons -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Con Iconos</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <!-- Search Input -->
          <app-input
            label="Buscar"
            type="search"
            placeholder="Buscar productos..."
            [leadingIcon]="true"
            [clearable]="true"
            [(ngModel)]="iconForm.search">
            <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </app-input>

          <!-- URL Input -->
          <app-input
            label="Sitio Web"
            type="url"
            placeholder="https://ejemplo.com"
            [leadingIcon]="true"
            [(ngModel)]="iconForm.website">
            <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </app-input>
        </div>
      </section>

      <!-- Reactive Form Example -->
      <section class="tw-mb-12">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">Formulario Reactivo</h2>

        <form [formGroup]="reactiveForm" (ngSubmit)="onSubmit()" class="tw-space-y-6">
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
            <app-input
              label="Nombre"
              placeholder="Tu nombre"
              [required]="true"
              [variant]="getFieldVariant('firstName')"
              [errorMessage]="getFieldError('firstName')"
              formControlName="firstName">
            </app-input>

            <app-input
              label="Apellido"
              placeholder="Tu apellido"
              [required]="true"
              [variant]="getFieldVariant('lastName')"
              [errorMessage]="getFieldError('lastName')"
              formControlName="lastName">
            </app-input>

            <app-input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              [required]="true"
              [variant]="getFieldVariant('email')"
              [errorMessage]="getFieldError('email')"
              formControlName="email">
            </app-input>

            <app-input
              label="Teléfono"
              type="tel"
              placeholder="+58 424 123 4567"
              [variant]="getFieldVariant('phone')"
              [errorMessage]="getFieldError('phone')"
              formControlName="phone">
            </app-input>
          </div>

          <div class="tw-flex tw-gap-4 tw-pt-4">
            <app-button
              type="submit"
              variant="primary"
              [disabled]="reactiveForm.invalid"
              [loading]="isSubmitting">
              Enviar Formulario
            </app-button>

            <app-button
              type="button"
              variant="outline"
              (buttonClick)="resetForm()">
              Limpiar
            </app-button>
          </div>
        </form>

        <!-- Form Status -->
        <div class="tw-mt-6 tw-p-4 tw-bg-gray-50 tw-rounded-lg">
          <h3 class="tw-font-semibold tw-mb-2">Estado del Formulario:</h3>
          <p><strong>Válido:</strong> {{ reactiveForm.valid ? 'Sí' : 'No' }}</p>
          <p><strong>Tocado:</strong> {{ reactiveForm.touched ? 'Sí' : 'No' }}</p>
          <p><strong>Valores:</strong></p>
          <pre class="tw-text-xs tw-mt-2 tw-bg-white tw-p-2 tw-rounded">{{ getFormValues() }}</pre>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class InputExamplesComponent {
  // Basic form models
  basicForm = {
    name: '',
    email: '',
    password: '',
    phone: ''
  };

  sizeForm = {
    small: '',
    medium: '',
    large: ''
  };

  variantForm = {
    default: '',
    success: 'Datos válidos',
    error: 'Error en los datos',
    info: ''
  };

  iconForm = {
    search: '',
    website: ''
  };

  // Reactive form
  reactiveForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });
  }

  getFieldVariant(fieldName: string): 'default' | 'success' | 'error' | 'info' {
    const field = this.reactiveForm.get(fieldName);
    if (!field) return 'default';

    if (field.invalid && (field.dirty || field.touched)) {
      return 'error';
    }

    if (field.valid && field.value && (field.dirty || field.touched)) {
      return 'success';
    }

    return 'default';
  }

  getFieldError(fieldName: string): string {
    const field = this.reactiveForm.get(fieldName);
    if (!field || !field.errors || (!field.dirty && !field.touched)) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo es requerido';
    }

    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }

    if (field.errors['email']) {
      return 'Ingresa un email válido';
    }

    if (field.errors['pattern']) {
      return 'Formato de teléfono inválido';
    }

    return '';
  }

  onSubmit(): void {
    if (this.reactiveForm.valid) {
      this.isSubmitting = true;

      // Simular envío
      setTimeout(() => {
        console.log('Formulario enviado:', this.reactiveForm.value);
        this.isSubmitting = false;
        alert('¡Formulario enviado exitosamente!');
      }, 2000);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.reactiveForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.reactiveForm.reset();
  }

  getFormValues(): string {
    return JSON.stringify(this.reactiveForm.value, null, 2);
  }
}
