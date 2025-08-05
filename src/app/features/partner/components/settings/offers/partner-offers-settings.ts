import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';


// Importar servicios
import { PartnerOffersService, Offer, PaginatedResponse } from './services/partner-offers.service';

// Importar componentes
import { OffersTableComponent } from './components/offers-table/offers-table.component';
import { OfferEditModalComponent } from './components/offer-edit-modal/offer-edit-modal.component';

// Importar componentes UI
import { Button } from '@app/components/ui/buttons/button';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';

@Component({
  selector: 'app-partner-offers-settings',
  standalone: true,
  imports: [
    CommonModule,
    OffersTableComponent,
    OfferEditModalComponent,
    Button,
    ReportProblem
  ],
  template: `
    <div class="tw-p-6 tw-bg-gradient-hero tw-min-h-screen">
      <div class="tw-max-w-7xl tw-mx-auto">
        <h2 class="tw-text-2xl tw-font-semibold tw-text-center tw-mb-5 tw-text-emerald-green-700">Configuración de Ofertas</h2>

        <!-- Breadcrumb -->
        <nav class="tw-text-sm tw-mb-5 tw-text-center">
          <span class="tw-text-sky-blue-600 tw-cursor-pointer" (click)="goBack()">Configuración del Negocio</span>
          <span class="tw-mx-2">&gt;</span>
          <span class="tw-text-emerald-green-700 tw-font-medium">Ofertas</span>
        </nav>

        <!-- Card de información y Botón Agregar Oferta -->
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-stretch tw-mb-8 tw-gap-6">
          <!-- Card de información izquierdo -->
          <div class="tw-w-full md:tw-w-2/3 lg:tw-w-3/4 tw-bg-white tw-rounded-lg tw-shadow-soft tw-p-4 tw-relative tw-overflow-hidden">
            <!-- Decoración de fondo -->
            <div class="tw-absolute tw-top-0 tw-right-0 tw-w-16 tw-h-16 tw-bg-sky-blue-100 tw-rounded-full tw-opacity-30 tw--mr-8 tw--mt-8"></div>
            <div class="tw-absolute tw-bottom-0 tw-left-0 tw-w-12 tw-h-12 tw-bg-emerald-green-100 tw-rounded-full tw-opacity-40 tw--ml-6 tw--mb-6"></div>

            <div class="tw-relative tw-flex tw-items-start tw-space-x-3">
              <!-- Icono mejorado -->
              <div class="tw-bg-gradient-to-br tw-from-sky-blue-500 tw-to-emerald-green-500 tw-p-2 tw-rounded-lg tw-shadow-sm tw-flex-shrink-0">
                <svg class="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>

              <div class="tw-flex-1">
                <h3 class="tw-text-base tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Consejos para Ofertas Efectivas</h3>

                <!-- Lista de consejos -->
                <ul class="tw-space-y-1.5 tw-list-none tw-pl-0">
                  <li class="tw-flex tw-items-start tw-space-x-2">
                    <span class="tw-w-1.5 tw-h-1.5 tw-bg-emerald-green-500 tw-rounded-full tw-mt-1.5 tw-flex-shrink-0"></span>
                    <p class="tw-text-xs tw-text-gray-700 tw-leading-relaxed">
                      <span class="tw-font-medium tw-text-emerald-green-700">Descuentos efectivos:</span> 15-25% generan mejor conversión
                    </p>
                  </li>
                  <li class="tw-flex tw-items-start tw-space-x-2">
                    <span class="tw-w-1.5 tw-h-1.5 tw-bg-sky-blue-500 tw-rounded-full tw-mt-1.5 tw-flex-shrink-0"></span>
                    <p class="tw-text-xs tw-text-gray-700 tw-leading-relaxed">
                      <span class="tw-font-medium tw-text-sky-blue-700">Fechas claras:</span> Urgencia aumenta las ventas
                    </p>
                  </li>
                  <li class="tw-flex tw-items-start tw-space-x-2">
                    <span class="tw-w-1.5 tw-h-1.5 tw-bg-coral-500 tw-rounded-full tw-mt-1.5 tw-flex-shrink-0"></span>
                    <p class="tw-text-xs tw-text-gray-700 tw-leading-relaxed">
                      <span class="tw-font-medium tw-text-coral-700">Términos específicos:</span> Evita confusiones
                    </p>
                  </li>
                </ul>

                <!-- Enlace de ayuda -->
                <div class="tw-mt-2 tw-pt-2 tw-border-t tw-border-sky-blue-200/50">
                  <button class="tw-text-xs tw-text-sky-blue-600 hover:tw-text-sky-blue-800 tw-font-medium tw-transition-colors tw-flex tw-items-center tw-space-x-1">
                    <span>Ver más consejos</span>
                    <svg class="tw-w-3 tw-h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón Agregar Oferta mejorado -->
          <div class="tw-flex tw-flex-col tw-justify-end tw-items-stretch md:tw-items-end tw-space-y-3 tw-w-full md:tw-w-auto">
            <app-button
              variant="primary"
              size="lg"
              (click)="onCreateOffer()"
              class="tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-w-full md:tw-w-auto"
            >
                                    <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
              <span class="tw-font-medium">Nueva Oferta</span>
            </app-button>

            <!-- Indicador de estado -->
            <div class="tw-flex tw-items-center tw-justify-center md:tw-justify-end tw-space-x-2 tw-text-xs tw-text-gray-500">
              <div class="tw-w-2 tw-h-2 tw-bg-emerald-green-500 tw-rounded-full tw-animate-pulse"></div>
              <span>{{ activeOffers() }} ofertas activas</span>
            </div>
          </div>
        </div>

        <!-- Botón para mostrar/ocultar estadísticas -->
        <div class="tw-mb-6">
          <button
            (click)="toggleStats()"
            class="tw-flex tw-items-center tw-space-x-2 tw-text-sm tw-font-medium tw-text-emerald-green-600 hover:tw-text-emerald-green-800 tw-transition-colors tw-bg-white tw-rounded-lg tw-shadow-soft tw-px-4 tw-py-2"
          >
            <svg
              class="tw-w-4 tw-h-4 tw-transition-transform tw-duration-200"
              [class.tw-rotate-180]="showStats()"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span>{{ showStats() ? 'Ocultar' : 'Mostrar' }} estadísticas</span>
          </button>
        </div>

        <!-- Estadísticas rápidas (condicional) -->
        @if (showStats()) {
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-6 tw-mb-8 tw-animate-fade-in">
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-beige-600 tw-mb-1">Total Ofertas</p>
                <p class="tw-text-2xl tw-font-bold tw-text-emerald-green-700">
                  {{ totalOffers() }}
                </p>
              </div>
              <div class="tw-bg-emerald-green-100 tw-p-3 tw-rounded-lg">
                <svg class="tw-w-6 tw-h-6 tw-text-emerald-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-beige-600 tw-mb-1">Ofertas Activas</p>
                <p class="tw-text-2xl tw-font-bold tw-text-success-600">
                  {{ activeOffers() }}
                </p>
              </div>
              <div class="tw-bg-sky-blue-100 tw-p-3 tw-rounded-lg">
                <svg class="tw-w-6 tw-h-6 tw-text-sky-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-beige-600 tw-mb-1">Ofertas Inactivas</p>
                <p class="tw-text-2xl tw-font-bold tw-text-beige-700">
                  {{ inactiveOffers() }}
                </p>
              </div>
              <div class="tw-bg-beige-100 tw-p-3 tw-rounded-lg">
                <svg class="tw-w-6 tw-h-6 tw-text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div>
                <p class="tw-text-sm tw-text-beige-600 tw-mb-1">Ofertas Expiradas</p>
                <p class="tw-text-2xl tw-font-bold tw-text-coral-600">
                  {{ expiredOffers() }}
                </p>
              </div>
              <div class="tw-bg-coral-100 tw-p-3 tw-rounded-lg">
                <svg class="tw-w-6 tw-h-6 tw-text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        }

        <!-- Tabla de ofertas -->
        <app-offers-table
          [paginatedData]="paginatedOffers()"
          [isLoading]="isLoading()"
          [currentPage]="currentPage()"
          (pageChange)="onPageChange($event)"
          (editOffer)="onEditOffer($event)"
          (viewOffer)="onViewOffer($event)"
          (deleteOffer)="onDeleteOffer($event)"
          (createOffer)="onCreateOffer()"
          (offerClick)="onOfferClick($event)"
        ></app-offers-table>

        <!-- Modal de edición/creación -->
        <app-offer-edit-modal
          [isOpen]="showEditModal()"
          [offer]="selectedOffer()"
          [isEditMode]="isEditMode()"
          (close)="onCloseModal()"
          (save)="onSaveOffer($event)"
        ></app-offer-edit-modal>

        <!-- Estado de carga global (opcional) -->
        @if (isLoading()) {
          <div class="tw-fixed tw-top-4 tw-right-4 tw-bg-white tw-rounded-lg tw-shadow-soft tw-p-4 tw-flex tw-items-center tw-space-x-3 tw-z-50">
            <svg class="tw-animate-spin tw-h-5 tw-w-5 tw-text-emerald-green-600" viewBox="0 0 24 24">
              <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="tw-text-sm tw-text-beige-700">Cargando ofertas...</span>
          </div>
        }

        <!-- Support Section -->
        <div class="tw-text-center tw-pt-6 tw-border-t tw-border-gray-200 tw-mt-8">
          <p class="tw-text-sm tw-text-gray-600 tw-mb-4">¿Necesitas ayuda con la gestión de ofertas?</p>
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
  `,
  styles: [`
    .tw-animate-spin {
      animation: spin 1s linear infinite;
    }

    .tw-animate-fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class PartnerOffersSettings implements OnInit {
  // Señales para el estado
  private paginatedOffersSignal = signal<PaginatedResponse<Offer> | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private currentPageSignal = signal<number>(1);
  private showEditModalSignal = signal<boolean>(false);
  private selectedOfferSignal = signal<Offer | null>(null);
  private isEditModeSignal = signal<boolean>(false);
  private showStatsSignal = signal<boolean>(false); // Por defecto oculta

  // Getters computados
  paginatedOffers = this.paginatedOffersSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  currentPage = this.currentPageSignal.asReadonly();
  showEditModal = this.showEditModalSignal.asReadonly();
  selectedOffer = this.selectedOfferSignal.asReadonly();
  isEditMode = this.isEditModeSignal.asReadonly();
  showStats = this.showStatsSignal.asReadonly();

  // Estadísticas computadas
  totalOffers = computed(() => {
    const data = this.paginatedOffers();
    return data?.total || 0;
  });

  activeOffers = computed(() => {
    return this.offersService.offers().filter(offer => offer.status === 'active').length;
  });

  inactiveOffers = computed(() => {
    return this.offersService.offers().filter(offer => offer.status === 'inactive').length;
  });

  expiredOffers = computed(() => {
    return this.offersService.offers().filter(offer => offer.status === 'expired').length;
  });

  // Opciones para el componente ReportProblem
  reportProblemOptions: ReportProblemOptions = {
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=PartnerOffersSettings',
    contextData: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      currentPath: '/partner/settings/offers',
      component: 'PartnerOffersSettings'
    }
  };

  constructor(
    private router: Router,
    private offersService: PartnerOffersService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  private loadOffers(page: number = 1): void {
    this.isLoadingSignal.set(true);

    this.offersService.getOffers(page, 10)
      .pipe(
        finalize(() => this.isLoadingSignal.set(false))
      )
      .subscribe({
        next: (response) => {
          this.paginatedOffersSignal.set(response);
          this.currentPageSignal.set(page);
        },
        error: (error) => {
          console.error('Error loading offers:', error);
          // Aquí podrías mostrar una notificación de error
        }
      });
  }

  onPageChange(page: number): void {
    this.loadOffers(page);
  }

  toggleStats(): void {
    this.showStatsSignal.set(!this.showStatsSignal());
  }

  onCreateOffer(): void {
    this.selectedOfferSignal.set(null);
    this.isEditModeSignal.set(false);
    this.showEditModalSignal.set(true);
  }

  onEditOffer(offer: Offer): void {
    this.selectedOfferSignal.set(offer);
    this.isEditModeSignal.set(true);
    this.showEditModalSignal.set(true);
  }

  onViewOffer(offer: Offer): void {
    // Por ahora, abre en modo edición
    // Más adelante puedes crear un modal de solo lectura
    this.onEditOffer(offer);
  }

  onOfferClick(offer: Offer): void {
    // Abre el modal de edición cuando se hace click en una fila
    this.onEditOffer(offer);
  }

  onDeleteOffer(offer: Offer): void {
    // Mostrar confirmación antes de eliminar
    if (confirm(`¿Estás seguro de que deseas eliminar la oferta "${offer.title}"?`)) {
      this.offersService.deleteOffer(offer.id).subscribe({
        next: () => {
          console.log('Oferta eliminada:', offer);
          this.loadOffers();
        },
        error: (error: any) => {
          console.error('Error al eliminar la oferta:', error);
        }
      });
    }
  }

  onCloseModal(): void {
    this.showEditModalSignal.set(false);
    this.selectedOfferSignal.set(null);
    this.isEditModeSignal.set(false);
  }

  onSaveOffer(offerData: Partial<Offer>): void {
    if (this.isEditMode() && offerData.id) {
      // Actualizar oferta existente
      this.offersService.updateOffer(offerData.id, offerData)
        .pipe(
          finalize(() => this.offersService.setLoading(false))
        )
        .subscribe({
          next: (updatedOffer) => {
            console.log('Offer updated:', updatedOffer);
            this.loadOffers(this.currentPage());
            // Aquí podrías mostrar una notificación de éxito
          },
          error: (error) => {
            console.error('Error updating offer:', error);
            // Aquí podrías mostrar una notificación de error
          }
        });
    } else {
      // Crear nueva oferta
      this.offersService.createOffer(offerData as Omit<Offer, 'id' | 'createdAt'>)
        .pipe(
          finalize(() => this.offersService.setLoading(false))
        )
        .subscribe({
          next: (newOffer) => {
            console.log('Offer created:', newOffer);
            this.loadOffers(1); // Volver a la primera página
            // Aquí podrías mostrar una notificación de éxito
          },
          error: (error) => {
            console.error('Error creating offer:', error);
            // Aquí podrías mostrar una notificación de error
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/partner/settings']);
  }
}
