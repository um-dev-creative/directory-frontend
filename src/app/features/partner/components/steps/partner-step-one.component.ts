import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StepOneData } from '../partner-registration-stepper.component';
import { InputComponent, Button, CardComponent, TextareaComponent, IconComponent } from '@app/components/ui';

@Component({
  selector: 'app-partner-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, Button, CardComponent, TextareaComponent, IconComponent],
  template: `
    <form [formGroup]="reactiveForm" (ngSubmit)="onContinue()" class="tw-space-y-6">
      <!-- Step Header -->
      <div class="tw-text-center tw-pb-4 tw-border-b tw-border-beige-200">
        <h2 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700 tw-mb-2">
          Información Básica de tu Negocio
        </h2>
        <p class="tw-text-beige-600">
          Cuéntanos sobre tu negocio para que podamos crear tu perfil
        </p>
      </div>

      <!-- Form Fields -->
      <div class="tw-space-y-6">
        <!-- Business Name -->
        <app-input
          label="Nombre del Negocio"
          placeholder="Ej: Restaurante El Buen Sabor"
          [required]="true"
          [variant]="getFieldVariant('name')"
          [errorMessage]="getFieldError('name')"
          formControlName="name"
        />

        <!-- Business Description -->
        <app-textarea
          label="Descripción del Negocio"
          placeholder="Describe brevemente tu negocio, productos o servicios que ofreces..."
          [required]="true"
          [variant]="getFieldVariant('description')"
          [errorMessage]="getFieldError('description')"
          [helperText]="'Mínimo 20 caracteres, máximo 500 caracteres'"
          [rows]="4"
          [maxLength]="500"
          [showCharacterCount]="true"
          formControlName="description"
        />
      </div>

      <!-- Example Card -->
      <app-card variant="outlined-blue" margin="sm">
        <div class="tw-flex tw-items-center tw-mb-2">
          <app-icon name="information-circle" size="md" class="tw-text-sky-blue-700 tw-mr-1"></app-icon>
          <h4 class="tw-text-md tw-font-semibold tw-text-sky-blue-700">
            Ejemplo de buena descripción:
          </h4>
        </div>
        <p class="tw-text-sm tw-text-sky-blue-700">
          "Restaurante familiar especializado en cocina tradicional mexicana.
          Ofrecemos desayunos, comidas y cenas preparadas con ingredientes frescos y locales.
          Ambiente acogedor ideal para familias y eventos especiales."
        </p>
      </app-card>

      <!-- Action Buttons -->
      <div class="tw-flex tw-justify-end tw-pt-4 tw-border-t tw-border-beige-200">
        <app-button
          type="submit"
          variant="primary"
          size="lg"
          [disabled]="isLoading || reactiveForm.invalid"
          [loading]="isLoading"
        >
          Continuar
        </app-button>
      </div>
    </form>
  `
})
export class PartnerStepOneComponent {
  @Input() isLoading = false;
  @Output() stepCompleted = new EventEmitter<StepOneData>();

  reactiveForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  onContinue(): void {
    if (this.reactiveForm.valid) {
      const formData: StepOneData = {
        name: this.reactiveForm.get('name')?.value,
        description: this.reactiveForm.get('description')?.value
      };
      this.stepCompleted.emit(formData);
    } else {
      this.reactiveForm.markAllAsTouched();
    }
  }

  getFieldVariant(fieldName: string): 'default' | 'success' | 'error' | 'info' {
    const field = this.reactiveForm.get(fieldName);
    return field && field.invalid && field.touched ? 'error' : 'default';
  }

  getFieldError(fieldName: string): string {
    const field = this.reactiveForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return fieldName === 'name'
          ? 'El nombre del negocio es requerido'
          : 'La descripción del negocio es requerida';
      }
      if (field.errors?.['minlength']) {
        return 'La descripción debe tener al menos 20 caracteres';
      }
      if (field.errors?.['maxlength']) {
        return 'La descripción no puede exceder 500 caracteres';
      }
    }
    return '';
  }
}
