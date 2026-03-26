import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PartnerRegistrationService, Partner } from '@app/features/partner/services';
import { PartnerStepOne, PartnerStepTwo, PartnerStepThree, StepThreeData} from './steps';


import { CardComponent } from '@app/components/ui';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';
import { LoggerService } from '@app/core/services/logger.service';

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
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-2xl mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-emerald-green-700 mb-2">
            Registra tu Negocio
          </h1>
          <p class="text-gray-600">
            Completa los siguientes pasos para crear tu perfil de partner
          </p>
        </div>

        <!-- Progress Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-center space-x-4">
            @for (step of steps; track step.number) {
              <div class="flex items-center">
                <!-- Step Circle -->
                <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300"
                     [class]="getStepCircleClasses(step.number)">
                  @if (step.number < currentStep) {
                    <!-- Completed Step -->
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  } @else {
                    <!-- Step Number -->
                    <span class="text-sm font-medium">{{ step.number }}</span>
                  }
                </div>

                <!-- Step Label -->
                <div class="ml-3 hidden sm:block">
                  <div class="text-sm font-medium transition-colors duration-300"
                       [class]="getStepLabelClasses(step.number)">
                    {{ step.title }}
                  </div>
                  <!--div class="text-xs text-gray-500">
                    {{ step.description }}
                  </div-->
                </div>

                <!-- Connector Line -->
                @if (step.number < steps.length) {
                  <div class="hidden sm:block w-16 h-0.5 ml-4 transition-colors duration-300"
                       [class]="step.number < currentStep ? 'bg-emerald-green-500' : 'bg-gray-300'">
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Step Content -->
        <div class="flex justify-center">
          <app-card variant="elevated" size="lg" padding="lg">
            <div class="flex justify-center">
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
          <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-green-500"></div>
                <span class="text-gray-700">{{ loadingMessage }}</span>
              </div>
            </div>
          </div>
        }

        <!-- Support Section -->
        <div class="text-center pt-6 border-t border-gray-200 mt-8">
          <p class="text-sm text-gray-600 mb-4">¿Necesitas ayuda con el registro de tu negocio?</p>
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
  private readonly destroy$ = new Subject<void>();

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
  private readonly logger = inject(LoggerService);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStepCircleClasses(stepNumber: number): string {
    if (stepNumber < this.currentStep) {
      return 'bg-emerald-green-500 border-emerald-green-500';
    } else if (stepNumber === this.currentStep) {
      return 'bg-emerald-green-100 border-emerald-green-500 text-emerald-green-700';
    } else {
      return 'bg-white border-gray-300 text-gray-500';
    }
  }

  getStepLabelClasses(stepNumber: number): string {
    if (stepNumber <= this.currentStep) {
      return 'text-emerald-green-700';
    } else {
      return 'text-gray-500';
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
          this.logger.error('Error creating partner:', error);
          this.isLoading = false;
          // Here you could show an error notification
        }
      });
  }

  onStepTwoCompleted(data: StepTwoData): void {
    if (!this.partnerId) {
      this.logger.error('No partner ID available');
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
          this.logger.error('Error updating partner:', error);
          this.isLoading = false;
        }
      });
  }

  onStepThreeCompleted(data: StepThreeData): void {
    if (!this.partnerId) {
      this.logger.error('No partner ID available');
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
          this.logger.error('Error completing registration:', error);
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
