import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';


// Importar servicios
import { PartnerOffersService, Offer, PaginatedResponse, OfferStatus } from './services/partner-offers.service';
import { CampaignClient } from '@app/core/services/campaign/campaign.client';

// Importar componentes
import { OffersTableComponent } from './components/offers-table/offers-table.component';
import { OfferEditModal } from './components/offer-edit-modal/offer-edit-modal';

// Importar componentes UI
import { Button } from '@app/components/ui/buttons/button';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';

@Component({
  selector: 'app-partner-offers-settings',
  standalone: true,
  imports: [
    CommonModule,
    OffersTableComponent,
    OfferEditModal,
    Button,
    ReportProblem
  ],
  templateUrl: './partner-offers-settings.html',
  styleUrl: './partner-offers-settings.css'
})
export class PartnerOffersSettings implements OnInit {
  // Señales para el estado
  private readonly paginatedOffersSignal = signal<PaginatedResponse<Offer> | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly currentPageSignal = signal<number>(1);
  private readonly showEditModalSignal = signal<boolean>(false);
  private readonly selectedOfferSignal = signal<Offer | null>(null);
  private readonly isEditModeSignal = signal<boolean>(false);
  private readonly showStatsSignal = signal<boolean>(false); // Por defecto oculta

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
    return this.offersService.offers().filter(offer => offer.status === OfferStatus.ACTIVE).length;
  });

  inactiveOffers = computed(() => {
    return this.offersService.offers().filter(offer => offer.status === OfferStatus.INACTIVE).length;
  });

  expiredOffers = computed(() => {
    return this.offersService.offers().filter(offer => offer.status === OfferStatus.EXPIRED).length;
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

  // internal error message
  private readonly errorMessageSignal = signal<string | null>(null);
  errorMessage = this.errorMessageSignal.asReadonly();

  constructor(
    private readonly router: Router,
    private readonly offersService: PartnerOffersService,
    private readonly campaignClient: CampaignClient
  ) {}

  ngOnInit(): void {
    this.campaignClient.clearCache();
    this.loadOffers();
  }

  private loadOffers(page: number = 1): void {
    this.isLoadingSignal.set(true);
    this.errorMessageSignal.set(null);

    // Use CampaignClient.list to fetch campaigns from backend and map into the PaginatedResponse<Offer>
    this.campaignClient.list({ page, limit: 10 })
      .pipe(
        finalize(() => this.isLoadingSignal.set(false))
      )
      .subscribe({
        next: (campaignResp) => {
          // Map Campaign -> Offer minimal fields expected by UI
          const offers: Offer[] = campaignResp.items.map((c, index) => ({
            _id: (index+1),
            id: c.id ?? '',
            title: c.title??'',
            description: c.description ?? '',
            discount: c.discount ?? 0,
            validUntil: c.endDate ? new Date(c.endDate) : new Date(),
            status: c.status === OfferStatus.ACTIVE ? c.status as unknown as OfferStatus : OfferStatus.INACTIVE,
            category: { id: c.categoryId??'', name: c.categoryName??'' },
            createdAt: new Date(),
            terms: c.terms ?? '',
          }));

          const paginated: PaginatedResponse<Offer> = {
            data: offers,
            total: campaignResp.total_count,
            page: campaignResp.page,
            limit: campaignResp.per_page,
            totalPages: campaignResp.total_pages
          };

          this.paginatedOffersSignal.set(paginated);
          this.currentPageSignal.set(page);
        },
        error: (error) => {
          const message = error?.message ?? 'No se pudieron cargar las campañas. Intenta nuevamente.';
          this.errorMessageSignal.set(String(message));
          console.error('Error loading campaigns:', error);
        }
      });
  }

  onPageChange(page: number): void {
    this.loadOffers(page);
  }

  toggleStats(): void {
    this.showStatsSignal.set(!this.showStatsSignal());
  }

  // Retry the current page load after an error
  retry(): void {
    this.loadOffers(this.currentPageSignal());
  }
  // Dismiss the error banner
  dismissError(): void {
    this.errorMessageSignal.set(null);
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
    if (this.isEditMode() && offerData._id) {
      // Actualizar oferta existente
      this.offersService.updateOffer(offerData._id, offerData)
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
      // Reload the offers list if creating a new offer
      this.loadOffers(1); // Volver a la primera página
    }
  }

  goBack(): void {
    this.router.navigate(['/partner/settings']);
  }
}
