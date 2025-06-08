import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Button,
  CardComponent,
  SelectComponent,
  SelectOption,
  IconComponent } from '@app/components/ui';

export interface StepThreeData {
  country: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-partner-step-three',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, CardComponent, SelectComponent, IconComponent],  template: `
    <form [formGroup]="locationForm" (ngSubmit)="onSubmit()" class="tw-space-y-6">
      <!-- Header -->
      <div class="tw-text-center tw-pb-4 tw-border-b tw-border-beige-200">
        <h2 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700 tw-mb-2">
          Ubicación del Negocio
        </h2>
        <p class="tw-text-beige-600">
          Selecciona el país donde opera tu negocio principal
        </p>
      </div>

      <!-- Country Selection -->
      <div class="tw-space-y-4">
        <!-- Country Select Component -->
        <app-select
          label="País de Operación"
          placeholder="Selecciona un país"
          [options]="countryOptions"
          [required]="true"
          formControlName="country"
          [variant]="getFieldVariant('country')"
          [errorMessage]="getFieldError('country')"
          helperText="Selecciona el país donde opera tu negocio principal">
        </app-select>
      </div>

      <!-- Selected Country Preview -->
      @if (selectedCountry) {
        <div class="tw-bg-emerald-green-50 tw-border tw-border-emerald-green-200 tw-rounded-lg tw-p-4">
          <div class="tw-flex tw-items-center tw-space-x-3">
            <span class="tw-text-2xl">{{ selectedCountry.flag }}</span>
            <div>
              <h3 class="tw-text-lg tw-font-medium tw-text-emerald-green-700">
                {{ selectedCountry.name }}
              </h3>
              <p class="tw-text-sm tw-text-emerald-green-600">
                País seleccionado para tu negocio
              </p>
            </div>
          </div>
        </div>
      }

      <!-- Info Card -->
      <app-card variant="outlined-blue">
        <div class="tw-flex tw-items-center tw-mb-2">
          <app-icon name="information-circle" size="md" class="tw-text-sky-blue-700 tw-mr-1"></app-icon>
          <h4 class="tw-text-md tw-font-semibold tw-text-sky-blue-700">
            ¿Por qué necesitamos esta información?
          </h4>
        </div>
        <p class="tw-text-sm tw-text-sky-blue-700">
          La ubicación nos ayuda a conectarte con clientes locales y mostrar tu negocio en búsquedas relevantes de tu región.
        </p>
      </app-card>

      <!-- Action Buttons -->
      <div class="tw-flex tw-justify-end tw-pt-4 tw-border-t tw-border-beige-200">
        <!--app-button
          variant="outline"
          size="lg"
          [fullWidth]="true"
          [disabled]="isLoading"
          (buttonClick)="onPrevious()"
        >
          Anterior
        </app-button-->

        <app-button
          variant="primary"
          size="lg"
          [fullWidth]="true"
          [disabled]="locationForm.invalid || isLoading"
          [loading]="isLoading"
          (buttonClick)="onSubmit()"
        >
          Finalizar
        </app-button>
      </div>
    </form>
  `
})
export class PartnerStepThreeComponent {
  @Input() isLoading = false;
  @Output() stepCompleted = new EventEmitter<StepThreeData>();
  @Output() previousStep = new EventEmitter<void>();

  locationForm: FormGroup;
  selectedCountry: Country | null = null;

  // List of Latin American and Caribbean countries
  countries: Country[] = [
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
    { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
    { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
    { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
    { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
    { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
    { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪' },
    { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
    // Additional popular countries
    { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
    { code: 'ES', name: 'España', flag: '🇪🇸' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' }
  ];

  // Convert countries to SelectOption format
  get countryOptions(): SelectOption[] {
    return this.countries.map(country => ({
      value: country.code,
      label: `${country.flag} ${country.name}`
    }));
  }

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      country: ['', [Validators.required]]
    });

    // Watch for country selection changes
    this.locationForm.get('country')?.valueChanges.subscribe(countryCode => {
      this.selectedCountry = this.countries.find(c => c.code === countryCode) || null;
    });
  }

  getFieldVariant(fieldName: string): 'default' | 'success' | 'error' | 'info' {
    const field = this.locationForm.get(fieldName);
    return field && field.invalid && field.touched ? 'error' : 'default';
  }

  getFieldError(fieldName: string): string {
    const field = this.locationForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'Por favor selecciona un país';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const formData: StepThreeData = {
        country: this.locationForm.value.country
      };

      this.stepCompleted.emit(formData);
    } else {
      // Mark all fields as touched to show validation errors
      this.locationForm.markAllAsTouched();
    }
  }

  onPrevious(): void {
    this.previousStep.emit();
  }
}
