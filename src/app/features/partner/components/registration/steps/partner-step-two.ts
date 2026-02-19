import { Component, Output, EventEmitter, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { StepTwoData } from '@app/features/partner';
import { PartnerRegistrationService } from '@app/features/partner/services/partner-registration.service';
import { Button, CardComponent, Avatar, IconComponent } from '@app/components/ui';
import { LoggerService } from '@app/core/services/logger.service';

@Component({
  selector: 'app-partner-step-two',
  standalone: true,
  imports: [CommonModule, Button, CardComponent, Avatar, IconComponent],
  template: `
    <div class="space-y-6">
      <!-- Step Header -->
      <div class="text-center pb-4 border-b border-beige-200">
        <h2 class="text-xl font-semibold text-emerald-green-700 mb-2">
          Imagen de tu Negocio
        </h2>
        <p class="text-beige-600">
          Agrega un avatar para personalizar el perfil de tu negocio
        </p>
      </div>

      <!-- Upload Sections -->
      <div class="flex justify-center">
        <div class="w-full max-w-md">
          <!-- Logo Upload -->
          <div class="my-2">
            <div>
            <!-- Logo Preview -->
            <div class="flex justify-center py-4">
              <div class="relative">
                <app-avatar
                  size="2xl"
                  variant="rounded"
                  [src]="logoPreview || ''"
                  alt="Logo del negocio"
                  [loading]="uploadingLogo"
                  iconName="business">
                </app-avatar>
              </div>
            </div>

            <!-- Logo Upload Button -->
            <div class="flex justify-center">
              <div class="w-full max-w-xs mt-0 flex justify-center">
                <input
                  #logoFileInput
                  type="file"
                  accept="image/*"
                  (change)="onLogoSelect($event)"
                  class="hidden"
                  [disabled]="uploadingLogo"
                />
                <app-button
                  variant="info"
                  [disabled]="uploadingLogo"
                  [loading]="uploadingLogo"
                  (buttonClick)="logoFileInput.click()"
                >
                  <app-icon name="image" size="sm" class="mr-2"></app-icon>
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
        <div class="flex items-start mb-3">
          <app-icon name="information-circle" size="md" class="text-sky-blue-700 mr-3 mt-0.5 shrink-0"></app-icon>
          <div>
            <h4 class="text-md font-semibold text-sky-blue-700 mb-2">
              Recomendaciones para las imágenes:
            </h4>
            <ul class="text-sm text-sky-blue-700 space-y-1.5 leading-relaxed">
              <li class="flex items-start">
                <span class="w-1.5 h-1.5 bg-sky-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                <span><strong>Avatar:</strong> Imagen cuadrada, mínimo 200x200px, ideal para representar tu negocio</span>
              </li>
              <li class="flex items-start">
                <span class="w-1.5 h-1.5 bg-sky-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                <span><strong>Logo:</strong> Formato horizontal preferido</span>
              </li>
              <li class="flex items-start">
                <span class="w-1.5 h-1.5 bg-sky-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                <span><strong>Tamaño máximo:</strong> 5MB por imagen</span>
              </li>
              <li class="flex items-start">
                <span class="w-1.5 h-1.5 bg-sky-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                <span><strong>Formatos aceptados:</strong> JPG, PNG</span>
              </li>
            </ul>
          </div>
        </div>
      </app-card>
      <!-- Action Buttons -->
      <div class="flex justify-end pt-4 border-t border-beige-200">
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
export class PartnerStepTwo implements OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly logger = inject(LoggerService);

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
            this.logger.error('Error uploading avatar:', error);
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
            this.logger.error('Error uploading logo:', error);
            this.uploadingLogo = false;
          }
        });
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.formData.avatar = undefined;
  }

  onPrevious(): void {
    this.previousStep.emit();
  }

  onContinue(): void {
    this.stepCompleted.emit(this.formData);
  }
}
