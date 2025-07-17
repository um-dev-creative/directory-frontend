import {Component, Output, EventEmitter, Input, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {StepOneData} from '../partner-registration-stepper.component';
import {InputComponent, Button, CardComponent, TextareaComponent, IconComponent} from '@app/components/ui';
import {BusinessClient} from '@app/core/services/business/business.client';
import {BusinessCreateRequest} from '@shared/models/business.model';
import {Store} from '@ngrx/store';
import {BusinessData, SessionData, SessionState} from '@core/store/session/session.state';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {AuthClient} from '@app/features/auth/auth.client';
import {NotificationService} from '@core/services';
import {SessionStoreService} from '@core/store/session/session-store.service';

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
          [maxLength]="25"
          [showCharacterCount]="true"
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
export class PartnerStepOneComponent implements OnInit {
  @Input() isLoading = false;
  @Output() stepCompleted = new EventEmitter<StepOneData>();

  private readonly notificationService: NotificationService = inject(NotificationService);
  /**
   * Partner services for session data management
   * @type {SessionStoreService}
   */
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);
  private readonly backboneJwtPipe: BackboneJwtPipe = inject(BackboneJwtPipe);
  private readonly businessClient: BusinessClient = inject(BusinessClient);
  private readonly authClient: AuthClient = inject(AuthClient);
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly destroy$ = new Subject<void>();
  private readonly fb: FormBuilder = inject(FormBuilder);

  private userId: string = '';
  protected sessionData: SessionData | undefined;

  reactiveForm: FormGroup;
  /** Function to log information */
  logInfo: (...arg: any) => void;
  /** Function to log errors */
  logError: (...arg: any) => void;

  constructor() {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      this.userId = this.backboneJwtPipe.transform(this.sessionData?.userAuth?.sessionTokenBkd ?? "")?.uid ?? "";
    });
  }

  onContinue(): void {
    if (this.reactiveForm.valid) {
      this.logInfo('Form data is valid, proceeding with business creation');
      const formData: StepOneData = {
        name: this.reactiveForm.get('name')?.value,
        description: this.reactiveForm.get('description')?.value
      };
      this.logInfo('Form data:', formData);
      this.businessClient.create(this.getBusinessData(formData)).pipe(
        takeUntil(this.destroy$),
        switchMap((response) => {
          this.logInfo('Business creation response:', response);
          // TODO: Change to status code #202
          if (response.headers.status === 201) {
            this.logInfo('Business created successfully with ID:', response.body);
            // let businessData: BusinessData = {
            //   id: response.body.id,
            //   name: response.body.name,
            //   description: response.body.description,
            //   createdAt: new Date(response.body.createdAt),
            //   updatedAt: new Date(response.body.updatedAt)
            // }

            let sessionDataNew = {
              ...this.sessionData,
              userAuth: {
                alias: this.sessionData?.userAuth?.alias ?? '',
                email: this.sessionData?.userAuth?.email ?? '',
                fullName: this.sessionData?.userAuth?.fullName ?? '',
                sessionToken: this.sessionData?.userAuth?.sessionToken ?? '',
                sessionTokenBkd: response.data?.token ?? this.sessionData?.userAuth?.sessionTokenBkd,
                authorization: this.sessionData?.userAuth?.authorization??'',
                features: this.sessionData?.userAuth?.features ?? [],
              },
              token: this.sessionData?.token ?? '',
            };
            this.notificationService.success('Business created successfully');

            this.sessionStoreService.saveSessionData(sessionDataNew);
            this.logInfo('Business created successfully:', response);
            // Mark all form controls as touched to show validation errors
            this.reactiveForm.markAllAsTouched();
            // Emit the form data to the parent component
            this.stepCompleted.emit(formData);
            return response;
          }

          if (response.status === 409) {
            this.logError('Business already exists for this user');
            this.notificationService.error('Ya tienes un negocio creado. Por favor, edítalo si deseas realizar cambios.');
            throw new Error('Business already exists for this user');
          } else {
            this.logError('Unexpected response status:', response.status);
            throw new Error(`Unexpected response status: ${response.status}`);
          }
        })
      ).subscribe({
        next: (response) => {
          this.logInfo('Business created successfully:', response);
          // Mark all form controls as touched to show validation errors
          this.reactiveForm.markAllAsTouched();
          // Emit the form data to the parent component
          this.stepCompleted.emit(formData);
        },
        error: (error) => {
          if (error.status === 409) {
            this.notificationService.error('Ya existe un negocio con el nombre ingresado. Por favor, Ingresar otro nombre.');
          } else {
            this.logError('Error creating business:', error);
          }
        }
      });
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
        if (fieldName === 'name') {
          return 'El nombre no puede exceder 25 caracteres';
        }
        return 'La descripción no puede exceder 500 caracteres';
      }
    }
    return '';
  }

  private getBusinessData(formData: any): BusinessCreateRequest {
    return {
      name: formData.name,
      description: formData.description,
      userId: this.userId,
      categoryId: '3536c5be-e56a-4a22-8f3c-d36da4a86f61', // This should be set based on your application logic,
      email: null,
      customerServiceEmail: null,
      orderManagementEmail: null,
      website: '' // Optional, can be added later
    }
  }
}
