import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StepOneData } from '../partner-registration-stepper.component';
import { InputComponent, Button, CardComponent, TextareaComponent, IconComponent } from '@app/components/ui';

@Component({
  selector: 'app-partner-step-one',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, Button, CardComponent, TextareaComponent, IconComponent],
  template: `
    <div class="tw-space-y-6">
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
          [disabled]="isLoading"
          [variant]="showErrors && !formData.name ? 'error' : 'default'"
          [errorMessage]="showErrors && !formData.name ? 'El nombre del negocio es requerido' : ''"
          [(ngModel)]="formData.name"
        />

        <!-- Business Description -->
        <app-textarea
          label="Descripción del Negocio"
          placeholder="Describe brevemente tu negocio, productos o servicios que ofreces..."
          [required]="true"
          [disabled]="isLoading"
          [variant]="showErrors && !formData.description ? 'error' : 'default'"
          [errorMessage]="showErrors && !formData.description ? 'La descripción del negocio es requerida' : ''"
          [helperText]="'Mínimo 20 caracteres, máximo 500 caracteres'"
          [rows]="4"
          [maxLength]="500"
          [showCharacterCount]="true"
          [(ngModel)]="formData.description"
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
          variant="primary"
          size="lg"
          [disabled]="isLoading"
          [loading]="isLoading"
          (buttonClick)="onContinue()"
        >
          Continuar
        </app-button>
      </div>
    </div>
  `
})
export class PartnerStepOneComponent {
  @Input() isLoading = false;
  @Output() stepCompleted = new EventEmitter<StepOneData>();

  formData: StepOneData = {
    name: '',
    description: ''
  };

  showErrors = false;

  onContinue(): void {
    this.showErrors = true;

    if (this.isFormValid()) {
      this.stepCompleted.emit(this.formData);
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.name?.trim() &&
      this.formData.description?.trim() &&
      this.formData.description.trim().length >= 20
    );
  }
}
