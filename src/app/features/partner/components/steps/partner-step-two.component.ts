import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { StepTwoData } from '../partner-registration-stepper.component';
import { PartnerRegistrationService } from '../../services/partner-registration.service';
import { Button, CardComponent, Avatar, IconComponent } from '@app/components/ui';

@Component({
  selector: 'app-partner-step-two',
  standalone: true,
  imports: [CommonModule, Button, CardComponent, Avatar, IconComponent],
  template: `
    <div class="tw-space-y-6">
      <!-- Step Header -->
      <div class="tw-text-center tw-pb-4 tw-border-b tw-border-beige-200">
        <h2 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700 tw-mb-2">
          Imagen de tu Negocio
        </h2>
        <p class="tw-text-beige-600">
          Agrega un avatar para personalizar el perfil de tu negocio
        </p>
      </div>

      <!-- Upload Sections -->
      <div class="tw-flex tw-justify-center">
        <div class="tw-w-full tw-max-w-md">
          <!-- Logo Upload -->
          <div class="tw-my-2">
            <div>
            <!-- Logo Preview -->
            <div class="tw-flex tw-justify-center tw-py-4">
              <div class="tw-relative">
                <app-avatar
                  size="2xl"
                  variant="rounded"
                  [src]="logoPreview || ''"
                  alt="Logo del negocio"
                  [loading]="uploadingLogo"
                  iconName="business">
                </app-avatar>
                @if (logoPreview) {
                  <button
                    type="button"
                    (click)="removeLogo()"
                    class="tw-absolute tw--top-2 tw--right-2 tw-bg-coral-500 tw-text-white tw-rounded-full tw-p-1.5 hover:tw-bg-coral-600 tw-transition-colors tw-shadow-md"
                    aria-label="Eliminar logo"
                  >
                    <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                }
              </div>
            </div>

            <!-- Logo Upload Button -->
            <div class="tw-flex tw-justify-center">
              <div class="tw-w-full tw-max-w-xs tw-mt-0 tw-flex tw-justify-center">
                <input
                  #logoFileInput
                  type="file"
                  accept="image/*"
                  (change)="onLogoSelect($event)"
                  class="tw-hidden"
                  [disabled]="uploadingLogo"
                />
                <app-button
                  variant="info"
                  [disabled]="uploadingLogo"
                  [loading]="uploadingLogo"
                  (buttonClick)="logoFileInput.click()"
                >
                  <app-icon name="image" size="sm" class="tw-mr-2"></app-icon>
                  {{ logoPreview ? 'Cambiar Logo' : 'Seleccionar Logo' }}
                </app-button>
              </div>
            </div>
          </div>
         </div>
        </div>
      </div>

      <!-- Guidelines -->
      <app-card variant="outlined-blue" padding="lg">
        <div class="tw-flex tw-items-start tw-mb-3">
          <app-icon name="information-circle" size="md" class="tw-text-sky-blue-700 tw-mr-3 tw-mt-0.5 tw-flex-shrink-0"></app-icon>
          <div>
            <h4 class="tw-text-md tw-font-semibold tw-text-sky-blue-700 tw-mb-2">
              Recomendaciones para las imágenes:
            </h4>
            <ul class="tw-text-sm tw-text-sky-blue-700 tw-space-y-1.5 tw-leading-relaxed">
              <li class="tw-flex tw-items-start">
                <span class="tw-w-1.5 tw-h-1.5 tw-bg-sky-blue-500 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
                <span><strong>Avatar:</strong> Imagen cuadrada, mínimo 200x200px, ideal para representar tu negocio</span>
              </li>
              <li class="tw-flex tw-items-start">
                <span class="tw-w-1.5 tw-h-1.5 tw-bg-sky-blue-500 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
                <span><strong>Logo:</strong> Formato horizontal preferido</span>
              </li>
              <li class="tw-flex tw-items-start">
                <span class="tw-w-1.5 tw-h-1.5 tw-bg-sky-blue-500 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
                <span><strong>Tamaño máximo:</strong> 5MB por imagen</span>
              </li>
              <li class="tw-flex tw-items-start">
                <span class="tw-w-1.5 tw-h-1.5 tw-bg-sky-blue-500 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></span>
                <span><strong>Formatos aceptados:</strong> JPG, PNG</span>
              </li>
            </ul>
          </div>
        </div>
      </app-card>
      <!-- Action Buttons -->
      <div class="tw-flex tw-justify-end tw-pt-4 tw-border-t tw-border-beige-200">
        <!--app-button
          variant="outline"
          size="lg"
          [disabled]="isLoading"
          (buttonClick)="onPrevious()"
        >
          Anterior
              </app-button--> <!--este no es el flujo que quiero seguir-->

        <app-button
          variant="primary"
          size="lg"
          [disabled]="isLoading || uploadingAvatar || uploadingLogo"
          (buttonClick)="onContinue()"
        >
          Guardar y Continuar
        </app-button>
      </div>
    </div>
  `
})
export class PartnerStepTwoComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() isLoading = false;
  @Output() stepCompleted = new EventEmitter<StepTwoData>();
  @Output() previousStep = new EventEmitter<void>();

  avatarPreview: string | null = null;
  logoPreview: string | null = null;
  uploadingAvatar = false;
  uploadingLogo = false;

  formData: StepTwoData = {
    avatar: undefined,
    logo: undefined
  };

  constructor(private partnerService: PartnerRegistrationService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAvatarSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.uploadingAvatar = true;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload file
      this.partnerService.uploadAvatar(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.formData.avatar = response.url;
            this.uploadingAvatar = false;
          },
          error: (error: any) => {
            console.error('Error uploading avatar:', error);
            this.uploadingAvatar = false;
            this.removeAvatar();
          }
        });
    }
  }

  onLogoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.uploadingLogo = true;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload file
      this.partnerService.uploadLogo(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.formData.logo = response.url;
            this.uploadingLogo = false;
          },
          error: (error: any) => {
            console.error('Error uploading logo:', error);
            this.uploadingLogo = false;
            this.removeLogo();
          }
        });
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.formData.avatar = undefined;
  }

  removeLogo(): void {
    this.logoPreview = null;
    this.formData.logo = undefined;
  }

  onPrevious(): void {
    this.previousStep.emit();
  }

  onContinue(): void {
    this.stepCompleted.emit(this.formData);
  }
}
