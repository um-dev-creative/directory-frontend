import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PartnerRegistrationService, Partner } from '@app/features/partner/services';
import { PartnerStepOne } from '@app/features/partner';
import { PartnerStepTwo } from '@app/features/partner';
import { PartnerStepThree, StepThreeData } from '@app/features/partner';
import { CardComponent } from '@app/components/ui';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';

export interface StepOneData {
  name: string;
  description: string;
}

export interface StepTwoData {
  avatar?: string;
  logo?: string;
}

@Component({
  selector: 'app-partner-registration-stepper',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    PartnerStepOne,
    PartnerStepTwo,
    PartnerStepThree,
    ReportProblem
  ],
  template: `
    <div class="tw-min-h-screen tw-bg-gray-50 tw-py-8">
      <div class="tw-max-w-2xl tw-mx-auto tw-px-4">
        <!-- Header -->
        <div class="tw-text-center tw-mb-8">
          <h1 class="tw-text-3xl tw-font-bold tw-text-emerald-green-700 tw-mb-2">
            Registra tu Negocio
          </h1>
          <p class="tw-text-gray-600">
            Completa los siguientes pasos para crear tu perfil de partner
          </p>
        </div>

        <!-- Progress Indicator -->
        <div class="tw-mb-8">
          <div class="tw-flex tw-items-center tw-justify-center tw-space-x-4">
            @for (step of steps; track step.number) {
              <div class="tw-flex tw-items-center">
                <!-- Step Circle -->
                <div class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full tw-border-2 tw-transition-all tw-duration-300"
                     [class]="getStepCircleClasses(step.number)">
                  @if (step.number < currentStep) {
                    <!-- Completed Step -->
                    <svg class="tw-w-5 tw-h-5 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  } @else {
                    <!-- Step Number -->
                    <span class="tw-text-sm tw-font-medium">{{ step.number }}</span>
                  }
                </div>

                <!-- Step Label -->
                <div class="tw-ml-3 tw-hidden sm:tw-block">
                  <div class="tw-text-sm tw-font-medium tw-transition-colors tw-duration-300"
                       [class]="getStepLabelClasses(step.number)">
                    {{ step.title }}
                  </div>
                  <!--div class="tw-text-xs tw-text-gray-500">
                    {{ step.description }}
                  </div-->
                </div>

                <!-- Connector Line -->
                @if (step.number < steps.length) {
                  <div class="tw-hidden sm:tw-block tw-w-16 tw-h-0.5 tw-ml-4 tw-transition-colors tw-duration-300"
                       [class]="step.number < currentStep ? 'tw-bg-emerald-green-500' : 'tw-bg-gray-300'">
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Step Content -->
        <div class="tw-flex tw-justify-center">
          <app-card variant="elevated" size="lg" padding="lg">
            <div class="tw-flex tw-justify-center">
              @switch (currentStep) {
                @case (1) {
                  <app-partner-step-one
                    [isLoading]="isLoading"
                    (stepCompleted)="onStepOneCompleted($event)"
                  />
                }
                @case (2) {
                  <app-partner-step-two
                    [isLoading]="isLoading"
                    (stepCompleted)="onStepTwoCompleted($event)"
                    (previousStep)="goToPreviousStep()"
                  />
                }
                @case (3) {
                  <app-partner-step-three
                    [isLoading]="isLoading"
                    (stepCompleted)="onStepThreeCompleted($event)"
                    (previousStep)="goToPreviousStep()"
                  />
                }
              }
            </div>
          </app-card>
        </div>

        <!-- Loading Overlay -->
        @if (isLoading) {
          <div class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
            <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-shadow-lg">
              <div class="tw-flex tw-items-center tw-space-x-3">
                <div class="tw-animate-spin tw-rounded-full tw-h-6 tw-w-6 tw-border-b-2 tw-border-emerald-green-500"></div>
                <span class="tw-text-gray-700">{{ loadingMessage }}</span>
              </div>
            </div>
          </div>
        }

        <!-- Support Section -->
        <div class="tw-text-center tw-pt-6 tw-border-t tw-border-gray-200 tw-mt-8">
          <p class="tw-text-sm tw-text-gray-600 tw-mb-4">¿Necesitas ayuda con el registro de tu negocio?</p>
          <app-report-problem
            [options]="reportProblemOptions"
            variant="link"
            size="md"
            [showIcon]="true"
            text="Reportar un problema">
          </app-report-problem>
        </div>
      </div>
    </div>
  `
})
export class PartnerRegistrationStepper implements OnDestroy {
  private destroy$ = new Subject<void>();

  currentStep = 1;
  isLoading = false;
  loadingMessage = '';

  partnerId: number | null = null;

  reportProblemOptions: ReportProblemOptions = {
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=BusinessRegistrationStepper',
    contextData: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      currentPath: '/partner/register',
      component: 'PartnerRegistrationStepper'
    }
  };

  steps = [
    {
      number: 1,
      title: 'Información Básica',
      description: 'Nombre y descripción'
    },
    {
      number: 2,
      title: 'Imagen de Marca',
      description: 'Avatar y logo'
    },
    {
      number: 3,
      title: 'Ubicación',
      description: 'País de operación'
    }
  ];

  constructor(
    private partnerService: PartnerRegistrationService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStepCircleClasses(stepNumber: number): string {
    if (stepNumber < this.currentStep) {
      return 'tw-bg-emerald-green-500 tw-border-emerald-green-500';
    } else if (stepNumber === this.currentStep) {
      return 'tw-bg-emerald-green-100 tw-border-emerald-green-500 tw-text-emerald-green-700';
    } else {
      return 'tw-bg-white tw-border-gray-300 tw-text-gray-500';
    }
  }

  getStepLabelClasses(stepNumber: number): string {
    if (stepNumber <= this.currentStep) {
      return 'tw-text-emerald-green-700';
    } else {
      return 'tw-text-gray-500';
    }
  }

  onStepOneCompleted(data: StepOneData): void {
    this.isLoading = true;
    this.loadingMessage = 'Creando tu negocio...';

    this.partnerService.createPartner(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: Partner) => {
          this.partnerId = partner.id;
          this.partnerService.setCurrentPartner(partner);
          this.currentStep = 2;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating partner:', error);
          this.isLoading = false;
          // Here you could show an error notification
        }
      });
  }

  onStepTwoCompleted(data: StepTwoData): void {
    if (!this.partnerId) {
      console.error('No partner ID available');
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Guardando imágenes...';

    this.partnerService.updatePartner(this.partnerId, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: Partner) => {
          this.partnerService.setCurrentPartner(partner);
          this.currentStep = 3;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error updating partner:', error);
          this.isLoading = false;
        }
      });
  }

  onStepThreeCompleted(data: StepThreeData): void {
    if (!this.partnerId) {
      console.error('No partner ID available');
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Finalizando registro...';

    this.partnerService.updatePartner(this.partnerId, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: Partner) => {
          this.partnerService.setCurrentPartner(partner);
          this.isLoading = false;

          // Redirect to partner profile using slug
          this.router.navigate(['/partner', partner.slug]);
        },
        error: (error: any) => {
          console.error('Error completing registration:', error);
          this.isLoading = false;
        }
      });
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
