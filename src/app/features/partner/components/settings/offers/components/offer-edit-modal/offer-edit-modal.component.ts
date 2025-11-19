import {Component, Input, Output, EventEmitter, OnInit, OnChanges, signal, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Offer } from '../../services/partner-offers.service';
import { CampaignClient } from '@app/core/services/campaign/campaign.client';
import { NotificationService } from '@app/core/services/notification.service';

// Importar componentes UI
import { Button, InputComponent, TextareaComponent, SelectComponent, SelectOption } from '@app/components/ui';
import {CategoryClient} from '@core/services/category/category.client';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {SessionData, SessionState} from '@core/store/session/session.state';

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
                  [options]="categories"
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
  private readonly submittingSignal = signal<boolean>(false);
  private readonly store: Store<{ session: SessionState }> = inject(Store);

  private readonly destroy$ = new Subject<void>();
  protected logInfo: (...arg: any) => void;
  protected logError: (...arg: any) => void;
  protected sessionData: SessionData | undefined;

  categories: { value: string; label: string }[] = [];

  // Getters para las señales
  isSubmitting = this.submittingSignal.asReadonly();

  offerForm!: FormGroup;

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

  constructor(private fb: FormBuilder, private readonly campaignClient: CampaignClient,
              private readonly categoryClient: CategoryClient, private readonly  notification: NotificationService) {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
    this.initializeForm();
  }

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      if (sessionState?.sessionData) {
        this.sessionData = sessionState.sessionData;
        // Aquí podrías cargar más datos del negocio si es necesario
      }
    });
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
    this.loadCategories();

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

  private loadCategories(): void {
    this.categoryClient.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (getCategoryResponse) => {
        if (getCategoryResponse.headers.status === 200 && getCategoryResponse.data.length > 0) {
          this.categories = getCategoryResponse.data
            .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
            .map((category: any) => ({value: category.id, label: category.name}));
        }
      },
      error: (err) => {
        this.logError('Error loading categories:', err);
      }
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
    for (const key of Object.keys(this.offerForm.controls)) {
      const control = this.offerForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    }
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

      // Map offer data to campaign payload and call backend via CampaignClient
      // NOTE: Backend expects local date-time format without milliseconds or timezone, e.g., 2025-11-17T00:00:00
      const toLocalDateTime = (d?: Date) => {
        if (!d) return undefined;
        const date = new Date(d);
        // Set to local midnight
        date.setHours(0, 0, 0, 0);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      const campaignPayload = {
        name: offerData.title || '',
        description: offerData.description || offerData.terms || '',
        startDate: toLocalDateTime(new Date()),
        endDate: toLocalDateTime(offerData.validUntil as Date),
        businessId: this.sessionData ? this.sessionData.userAuth.businesses[0] : null,
        discount: offerData.discount,
        categoryId: offerData.category,
        active: offerData.status === 'active'
      };

      this.campaignClient.create(campaignPayload as any).subscribe({
        next: (res) => {
          // res is { status, body }
          this.submittingSignal.set(false);
          console.debug('Campaign create response:', res);
          this.notification.success('Offer created successfully (campaign recorded)');
          // Optionally attach returned campaign id to emitted data
          const emitted = { ...offerData } as Partial<Offer>;
          const createdId = (res && res.body && (res.body as any).id) || (res && (res as any).id);
          if (createdId) {
            (emitted as any).campaignId = createdId;
          }
          this.save.emit(emitted);
          this.onClose();
        },
        error: (err) => {
          this.submittingSignal.set(false);
          console.error('Error creating campaign from offer (normalized):', err);

          // Helper to extract errors object from various backend shapes
          const extractErrors = (e: any): any => {
            if (!e) return null;
            if (e.errors && typeof e.errors === 'object') return e.errors;
            if (e.body && e.body.errors && typeof e.body.errors === 'object') return e.body.errors;
            if (e.body && e.body.ModelState) return e.body.ModelState;
            if (e.body && e.body.modelState) return e.body.modelState;
            // Some APIs return validation errors keyed by field name directly in body
            if (e.body && typeof e.body === 'object') {
              // attempt to find fields with array values
              const candidates: any = {};
              for (const k of Object.keys(e.body)) {
                if (Array.isArray(e.body[k]) || typeof e.body[k] === 'string') {
                  candidates[k] = e.body[k];
                }
              }
              if (Object.keys(candidates).length) return candidates;
            }
            return null;
          };

          const serverErrors = extractErrors(err) || extractErrors(err?.error) || null;

          if (serverErrors) {
            for (const field of Object.keys(serverErrors)) {
              const control = this.offerForm.get(field);
              const value = serverErrors[field];
              if (control) {
                control.setErrors({ server: Array.isArray(value) ? value.join(' ') : String(value) });
                control.markAsTouched();
              }
            }
            const msg = err?.message || 'Validation errors occurred. Please check the form.';
            this.notification.error(msg);
            return;
          }

          // If there's a top-level message, show it
          if (err?.message) {
            this.notification.error(err.message);
            return;
          }

          // Generic fallback
          this.notification.error('Unable to save offer right now. Please try again.');
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      for (const key of Object.keys(this.offerForm.controls)) {
        this.offerForm.get(key)?.markAsTouched();
      }
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
