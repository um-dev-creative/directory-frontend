import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Offer, OfferStatus} from '../../services/partner-offers.service';
import {CampaignClient} from '@app/core/services/campaign/campaign.client';
import {NotificationService} from '@app/core/services/notification.service';

// Importar componentes UI
import {Button, InputComponent, SelectComponent, SelectOption, TextareaComponent} from '@app/components/ui';
import {CategoryClient} from '@core/services/category/category.client';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {SessionData, SessionState} from '@core/store/session/session.state';
import {formatDate} from '@shared/handler/date.handler';
import {CampaignMapper} from '@core/services';
import {LoggerService} from '@app/core/services/logger.service';

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
  templateUrl: 'offer-edit-modal.html',
  styleUrls: ['./offer-edit-modal.css']
})
export class OfferEditModal implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() offer: Offer | null = null;
  @Input() isEditMode: boolean = false;

  @Output() closeEventEmitter = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Offer>>();

  // Señales para el estado
  private readonly submittingSignal = signal<boolean>(false);
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly campaignMapper = inject(CampaignMapper);

  private readonly destroy$ = new Subject<void>();
  protected sessionData: SessionData | undefined;
  private readonly logger = inject(LoggerService);

  categories: { value: string; label: string }[] = [];

  // Getters para las señales
  isSubmitting = this.submittingSignal.asReadonly();

  offerForm!: FormGroup;

  // PENDING - Implementing status options as a service
  statusOptions: SelectOption[] = [
    {value: OfferStatus.ACTIVE, label: 'Activa'},
    {value: OfferStatus.INACTIVE, label: 'Inactiva'},
    {value: OfferStatus.EXPIRED, label: 'Expirada'}
  ];

  // PENDING - Implementing type options as a service
  typeOptions: SelectOption[] = [
    {value: 'online', label: 'Online'},
    {value: 'en_tienda', label: 'En Tienda'},
    {value: 'ambos', label: 'Online y En Tienda'}
  ];

  constructor(private readonly fb: FormBuilder, private readonly campaignClient: CampaignClient,
              private readonly categoryClient: CategoryClient, private readonly notification: NotificationService) {
    // use injected logger
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
      categoryId: new FormControl(
        (this.offer as any)?.categoryId ?? (this.offer as any)?.category ?? '',
        [Validators.required]
      ),
      type: new FormControl(
        this.offer?.type || 'online',
        [Validators.required]
      ),
      validUntil: new FormControl(
        this.offer?.validUntil ? this.formatDateForInput(this.offer.validUntil) : this.formatDateForInput(tomorrow),
        [Validators.required, this.futureDateValidator]
      ),
      status: new FormControl(
        this.offer?.status || OfferStatus.ACTIVE,
        [Validators.required]
      ),
      terms: new FormControl(
        this.offer?.terms || '',
        [Validators.required, Validators.minLength(200), Validators.maxLength(2500)]
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
        this.logger.error('Error loading categories:', err);
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

    return inputDate > today ? null : {futureDate: true};
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
        this.updateCampaign(offerData);
      } else {
        this.createCampaign(offerData);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      for (const key of Object.keys(this.offerForm.controls)) {
        this.offerForm.get(key)?.markAsTouched();
      }
    }
  }

  private createCampaign(offerData: Partial<Offer>): void {
    // Map offer data to campaign payload and call backend via CampaignClient
    // NOTE: Backend expects local date-time format without milliseconds or timezone, e.g., 2025-11-17T00:00:00
    if (this.sessionData) {
      const campaignCreatePayload = this.campaignMapper.mapToCampaignCreateRequest(offerData, this.sessionData.userAuth.businesses[0]);

      this.campaignClient.create(campaignCreatePayload as any).subscribe({
        next: (res) => {
          // res is { status, body }
          this.submittingSignal.set(false);
          this.logger.debug('Campaign create response:', res);
          this.notification.success('Offer created successfully (campaign recorded)');
          // Optionally attach returned campaign id to emitted data
          const emitted = {...offerData} as Partial<Offer>;
          const createdId = (res && res.body && (res.body as any).id) || (res && (res as any).id);
          if (createdId) {
            (emitted as any).campaignId = createdId;
          }
          this.save.emit(emitted);
          this.onClose();
        },
        error: (err) => {
          this.submittingSignal.set(false);
          this.logger.error('Error creating campaign from offer (normalized):', err);

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
                control.setErrors({server: Array.isArray(value) ? value.join(' ') : String(value)});
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
      this.notification.error('No user logged in. Please log in to create an offer.');
      this.submittingSignal.set(false);
    }
  }

  private updateCampaign(offerData: Partial<Offer>) {
    this.logger.debug('Updating campaign with offer data:', offerData);
    // Determine campaign id from payload or existing offer
    const campaignId = (offerData as any).id || (offerData as any).campaignId || this.offer?.id || (this.offer as any)?.campaignId;
    if (!campaignId) {
      this.submittingSignal.set(false);
      this.notification.error('No campaign id available to update.');
      return;
    }

    const payload: any = {
      title: offerData.title || this.offer?.title || '',
      description: offerData.description || this.offer?.description || '',
      businessId: this.sessionData ? this.sessionData.userAuth?.businesses?.[0] : null,
      categoryId: (offerData as any).categoryId ?? (this.offer as any)?.categoryId ?? (this.offer as any)?.category ?? null,
      endDate: formatDate((offerData.validUntil as Date) || ((this.offer as any)?.validUntil ? new Date((this.offer as any).validUntil) : undefined)),
      // endDate: toLocalDateTime((offerData.validUntil as Date) || ((this.offer as any)?.validUntil ? new Date((this.offer as any).validUntil) : undefined)),
      discount: Number(offerData.discount ?? this.offer?.discount ?? 0),
      active: (offerData.status ? String(offerData.status).toLowerCase() === String(OfferStatus.ACTIVE).toLowerCase() : (this.offer?.status ? String(this.offer.status).toLowerCase() === String(OfferStatus.ACTIVE).toLowerCase() : true)),
      terms: offerData.terms || this.offer?.terms || ''
    };

    this.campaignClient.patchCampaign(String(campaignId), payload).subscribe({
      next: (res) => {
        this.submittingSignal.set(false);
        this.notification.success('Offer updated successfully (campaign updated)');
        const emitted = {...offerData} as Partial<Offer>;
        // Optionally attach returned lastUpdate/id
        if (res && res.body) {
          (emitted as any).campaignId = res.body.id;
          (emitted as any).campaignLastUpdate = res.body.lastUpdate;
        }
        this.save.emit(emitted);
        this.onClose();
        this.logger.debug('Campaign update response:', res);
      },
      error: (err) => {
        this.submittingSignal.set(false);
        this.logger.error('Error updating campaign from offer (normalized):', err);

        const extractErrors = (e: any): any => {
          if (!e) return null;
          if (e.errors && typeof e.errors === 'object') return e.errors;
          if (e.body && e.body.errors && typeof e.body.errors === 'object') return e.body.errors;
          if (e.body && e.body.ModelState) return e.body.ModelState;
          if (e.body && e.body.modelState) return e.body.modelState;
          if (e.body && typeof e.body === 'object') {
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
              control.setErrors({server: Array.isArray(value) ? value.join(' ') : String(value)});
              control.markAsTouched();
            }
          }
          const msg = err?.message || 'Validation errors occurred. Please check the form.';
          this.notification.error(msg);
          return;
        }

        if (err?.message) {
          this.notification.error(err.message);
          return;
        }

        this.notification.error('Unable to update offer right now. Please try again.');
      }
    });
  }

  onClose(): void {
    this.offerForm?.reset();
    this.submittingSignal.set(false);
    this.closeEventEmitter.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
