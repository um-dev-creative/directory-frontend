import { Component, Input, Output, EventEmitter, OnInit, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Offer } from '../../services/partner-offers.service';

// Importar componentes UI
import { Button, InputComponent, TextareaComponent, SelectComponent, SelectOption } from '@app/components/ui';

@Component({
  selector: 'app-offer-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputComponent,
    TextareaComponent,
    SelectComponent
  ],
  template: `
    @if (isOpen) {
      <!-- Overlay -->
      <div class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4" (click)="onOverlayClick($event)">
        <!-- Modal -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft-lg tw-w-full tw-max-w-2xl tw-max-h-[90vh] tw-overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="tw-p-6">
            <!-- Header -->
            <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
              <h2 class="tw-text-xl tw-font-bold tw-text-emerald-green-700">
                {{ isEditMode ? 'Editar Oferta' : 'Nueva Oferta' }}
              </h2>
              <div class="tw-flex tw-items-center tw-space-x-4">
                @if (isEditMode && offer) {
                  <span class="tw-text-sm tw-text-beige-600">ID: #{{ offer.id }}</span>
                }
                <button
                  type="button"
                  class="tw-text-beige-400 hover:tw-text-beige-600 tw-transition-colors"
                  (click)="onClose()"
                >
                  <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Formulario -->
            <form [formGroup]="offerForm" (ngSubmit)="onSubmit()" class="tw-space-y-6">
              <!-- Título -->
              <app-input
                label="Título de la oferta"
                placeholder="Ej: Descuento de Verano"
                [required]="true"
                [variant]="getFieldVariant('title')"
                [errorMessage]="getFieldError('title')"
                formControlName="title">
              </app-input>

              <!-- Descripción -->
              <app-textarea
                label="Descripción"
                placeholder="Describe los detalles de la oferta..."
                [required]="true"
                [rows]="3"
                [variant]="getFieldVariant('description')"
                [errorMessage]="getFieldError('description')"
                formControlName="description">
              </app-textarea>

              <!-- Fila: Descuento y Categoría -->
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                <!-- Descuento -->
                <app-input
                  label="Porcentaje de descuento"
                  type="number"
                  placeholder="20"
                  [required]="true"
                  [variant]="getFieldVariant('discount')"
                  [errorMessage]="getFieldError('discount')"
                  formControlName="discount"
                  style="border: none; padding: 0; background: transparent; ">
                </app-input>

                <!-- Categoría -->
                <app-select
                  label="Categoría"
                  placeholder="Selecciona una categoría"
                  [required]="true"
                  [variant]="getFieldVariant('category')"
                  [errorMessage]="getFieldError('category')"
                  [options]="categoryOptions"
                  formControlName="category">
                </app-select>
              </div>

              <!-- Tipo de Oferta -->
              <app-select
                label="Tipo de oferta"
                [required]="true"
                [variant]="getFieldVariant('type')"
                [errorMessage]="getFieldError('type')"
                [options]="typeOptions"
                formControlName="type">
              </app-select>

              <!-- Fila: Fecha válida hasta y Estado -->
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                <!-- Fecha válida hasta -->
                <app-input
                  label="Válido hasta"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  [required]="true"
                  [variant]="getFieldVariant('validUntil')"
                  [errorMessage]="getFieldError('validUntil')"
                  formControlName="validUntil"
                  style="border: none; padding: 0; background: transparent; ">
                </app-input>

                <!-- Estado -->
                <app-select
                  label="Estado"
                  [required]="true"
                  [variant]="getFieldVariant('status')"
                  [errorMessage]="getFieldError('status')"
                  [options]="statusOptions"
                  formControlName="status">
                </app-select>
              </div>

              <!-- Términos y Condiciones -->
              <app-textarea
                label="Términos y Condiciones"
                placeholder="Especifica los términos y condiciones de la oferta..."
                [required]="true"
                [rows]="4"
                [variant]="getFieldVariant('terms')"
                [errorMessage]="getFieldError('terms')"
                formControlName="terms">
              </app-textarea>

              <!-- Botones -->
              <div class="tw-flex tw-justify-end tw-space-x-3 tw-pt-6 tw-border-t tw-border-beige-200">
                <app-button
                  type="button"
                  variant="outline"
                  [disabled]="isSubmitting()"
                  (buttonClick)="onClose()">
                  Cancelar
                </app-button>
                <app-button
                  type="submit"
                  variant="primary"
                  [disabled]="offerForm.invalid || isSubmitting()"
                  [loading]="isSubmitting()">
                  {{ isEditMode ? 'Actualizar' : 'Crear' }} Oferta
                </app-button>
              </div>
            </form>

            <!-- Form Status - Development Section (Temporal) -->
            <div class="tw-mt-8 tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-200">
              <h3 class="tw-font-semibold tw-mb-3 tw-text-gray-800">Estado del Formulario (Desarrollo):</h3>
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-text-sm">
                <div>
                  <p><strong>Válido:</strong> @if (offerForm.valid) { Sí } @else { No }</p>
                  <p><strong>Tocado:</strong> @if (offerForm.touched) { Sí } @else { No }</p>
                  <p><strong>Sucio:</strong> @if (offerForm.dirty) { Sí } @else { No }</p>
                </div>
                <div>
                  <p><strong>Estado:</strong> {{ offerForm.status }}</p>
                  <p><strong>Pendiente:</strong> @if (offerForm.pending) { Sí } @else { No }</p>
                  <p><strong>Enviando:</strong> @if (isSubmitting()) { Sí } @else { No }</p>
                </div>
              </div>

              <div class="tw-mt-4">
                <p class="tw-font-medium tw-mb-2">Valores del Formulario:</p>
                <pre class="tw-text-xs tw-bg-white tw-p-3 tw-rounded tw-border tw-overflow-auto tw-max-h-40">{{ getFormValues() }}</pre>
              </div>

              @if (!offerForm.valid) {
                <div class="tw-mt-4">
                  <p class="tw-font-medium tw-mb-2 tw-text-red-600">Errores del Formulario:</p>
                  <pre class="tw-text-xs tw-bg-red-50 tw-p-3 tw-rounded tw-border tw-border-red-200 tw-overflow-auto tw-max-h-32">{{ getFormErrors() }}</pre>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tw-animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class OfferEditModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() offer: Offer | null = null;
  @Input() isEditMode: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Offer>>();

  // Señales para el estado
  private submittingSignal = signal<boolean>(false);

  // Getters para las señales
  isSubmitting = this.submittingSignal.asReadonly();

  offerForm!: FormGroup;

  // Opciones para los selects
  categoryOptions: SelectOption[] = [
    { value: 'Temporada', label: 'Temporada' },
    { value: 'Evento', label: 'Evento' },
    { value: 'Nuevos Clientes', label: 'Nuevos Clientes' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Jardín', label: 'Jardín' },
    { value: 'Empresas', label: 'Empresas' },
    { value: 'Flash', label: 'Flash' },
    { value: 'Aniversario', label: 'Aniversario' },
    { value: 'Fin de Año', label: 'Fin de Año' },
    { value: 'Familia', label: 'Familia' },
    { value: 'VIP', label: 'VIP' },
    { value: 'Lealtad', label: 'Lealtad' },
    { value: 'Romántico', label: 'Romántico' }
  ];

  statusOptions: SelectOption[] = [
    { value: 'active', label: 'Activa' },
    { value: 'inactive', label: 'Inactiva' },
    { value: 'expired', label: 'Expirada' }
  ];

  typeOptions: SelectOption[] = [
    { value: 'online', label: 'Online' },
    { value: 'en_tienda', label: 'En Tienda' },
    { value: 'ambos', label: 'Online y En Tienda' }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.offerForm) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.offerForm = this.fb.group({
      title: new FormControl(
        this.offer?.title || '',
        [Validators.required, Validators.minLength(3)]
      ),
      description: new FormControl(
        this.offer?.description || '',
        [Validators.required, Validators.minLength(10)]
      ),
      discount: new FormControl(
        this.offer?.discount || null,
        [Validators.required, Validators.min(1), Validators.max(100)]
      ),
      category: new FormControl(
        this.offer?.category || '',
        [Validators.required]
      ),
      type: new FormControl(
        (this.offer as any)?.type || 'online',
        [Validators.required]
      ),
      validUntil: new FormControl(
        this.offer?.validUntil ? this.formatDateForInput(this.offer.validUntil) : this.formatDateForInput(tomorrow),
        [Validators.required, this.futureDateValidator]
      ),
      status: new FormControl(
        this.offer?.status || 'active',
        [Validators.required]
      ),
      terms: new FormControl(
        this.offer?.terms || '',
        [Validators.required, Validators.minLength(20)]
      )
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private futureDateValidator(control: any) {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate > today ? null : { futureDate: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.offerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Returns the variant for a form field ('default' or 'error') based on its validation state.
   * @param fieldName Name of the form field
   */
  getFieldVariant(fieldName: string): 'default' | 'error' | 'success' {
    const field = this.offerForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) return 'error';
    if (field && field.valid && field.value && (field.dirty || field.touched)) return 'success';
    return 'default';
  }

  /**
   * Returns the error message for a form field if it is invalid and touched.
   * @param fieldName Name of the form field
   */
  getFieldError(fieldName: string): string {
    const field = this.offerForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `El valor mínimo es ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `El valor máximo es ${field.errors['max'].max}`;
      }
      if (field.errors['futureDate']) {
        return 'La fecha debe ser en el futuro';
      }
    }
    return '';
  }

  /**
   * Retrieves the current values of the offer form as a JSON string.
   */
  getFormValues(): string {
    return JSON.stringify(this.offerForm.value, null, 2);
  }

  /**
   * Retrieves the current errors of the offer form as a JSON string.
   */
  getFormErrors(): string {
    const errors: any = {};
    Object.keys(this.offerForm.controls).forEach(key => {
      const control = this.offerForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return JSON.stringify(errors, null, 2);
  }

  onSubmit(): void {
    if (this.offerForm.valid && !this.isSubmitting()) {
      this.submittingSignal.set(true);

      const formValue = this.offerForm.value;
      const offerData: Partial<Offer> = {
        ...formValue,
        validUntil: new Date(formValue.validUntil),
        discount: Number(formValue.discount)
      };

      // Si es modo edición, incluir el ID
      if (this.isEditMode && this.offer) {
        offerData.id = this.offer.id;
      }

      // Simular delay de guardado
      setTimeout(() => {
        this.submittingSignal.set(false);
        this.save.emit(offerData);
        this.onClose();
      }, 1000);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.offerForm.controls).forEach(key => {
        this.offerForm.get(key)?.markAsTouched();
      });
    }
  }

  onClose(): void {
    this.offerForm?.reset();
    this.submittingSignal.set(false);
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
