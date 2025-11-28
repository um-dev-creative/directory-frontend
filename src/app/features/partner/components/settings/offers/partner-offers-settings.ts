/**
 * Partner Offers Settings
 *
 * This standalone Angular component is the parent container for managing a
 * partner's offers (campaigns). It coordinates fetching campaigns from the
 * backend via `CampaignClient`, maps campaigns into the local `Offer` shape
 * using `CampaignMapper`, and presents the data to UI children such as
 * `OffersTableComponent` and `OfferEditModal`.
 *
 * The component uses Angular signals for internal state (paginated data,
 * loading, modal visibility, selected offer, edit mode). It encapsulates
 * paging, error handling and CRUD interactions delegating to
 * `PartnerOffersService` for local mock operations and `CampaignClient` for
 * backend campaign persistence.
 */
import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';


// Importar servicios
import {Offer, OfferStatus, PaginatedResponse, PartnerOffersService} from './services/partner-offers.service';
import {CampaignClient} from '@app/core/services/campaign/campaign.client';

// Importar componentes
import {OffersTableComponent} from './components/offers-table/offers-table.component';
import {OfferEditModal} from './components/offer-edit-modal/offer-edit-modal';

// Importar componentes UI
import {Button} from '@app/components/ui/buttons/button';
import {ReportProblem, ReportProblemOptions} from '@app/layout/report-problem/report-problem';
import {CampaignMapper} from '@core/services';

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
/**
 * Component: PartnerOffersSettings
 *
 * Responsibilities:
 * - Load a paginated list of campaigns from the backend and map them to the
 *   local `Offer` shape for display.
 * - Manage local UI state (loading, paging, selected offer, edit/create
 *   modal visibility) using Angular signals.
 * - Delegate create/update/delete actions to `PartnerOffersService` and
 *   backend persistence to `CampaignClient`.
 * - Provide event handlers that child components (table/modal) call to
 *   perform actions (edit, view, create, delete, save).
 *
 * Notes about important members:
 * - `paginatedOffersSignal`: signal storing the current page of Offer data.
 * - `isLoadingSignal`: boolean signal used to toggle loading UI.
 * - `campaignMapper`: injected mapper service that converts Campaign -> Offer.
 */
export class PartnerOffersSettings implements OnInit {
  // Señales para el estado
  private readonly paginatedOffersSignal = signal<PaginatedResponse<Offer> | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly currentPageSignal = signal<number>(1);
  private readonly showEditModalSignal = signal<boolean>(false);
  private readonly selectedOfferSignal = signal<Offer | null>(null);
  private readonly isEditModeSignal = signal<boolean>(false);
  private readonly showStatsSignal = signal<boolean>(false); // Por defecto oculta

  private readonly router: Router = inject(Router);
  private readonly offersService: PartnerOffersService = inject(PartnerOffersService);
  private readonly campaignClient: CampaignClient = inject(CampaignClient);
  private readonly campaignMapper = inject(CampaignMapper);

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
  ) {}

  /**
   * Lifecycle hook: OnInit
   *
   * Clears the campaign cache and loads the first page of offers.
   */
  ngOnInit(): void {
    this.campaignClient.clearCache();
    this.loadOffers();
  }

  /**
   * Fetch a page of campaigns from the backend and map each campaign to
   * an `Offer` for UI consumption.
   *
   * @param page - 1-based page number to load (defaults to 1)
   * @remarks
   * - Uses `campaignClient.list({page, limit})` to fetch data.
   * - Maps backend Campaigns to Offer via `campaignMapper.mapCampaignToOffer`.
   * - Updates internal signals for paginated data and current page.
   * - Handles errors by setting `errorMessageSignal` with a friendly message.
   */
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
          const offers: Offer[] = campaignResp.items.map((c, index) =>
            this.campaignMapper.mapCampaignToOffer(c, {index: index})
          );

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

  /**
   * Change page in the table and trigger a reload when necessary.
   * @param page - requested 1-based page number
   */
  onPageChange(page: number): void {
    this.loadOffers(page);
  }

  /**
   * Toggle display of the statistics panel in the UI.
   */
  toggleStats(): void {
    this.showStatsSignal.set(!this.showStatsSignal());
  }

  /**
   * Retry the current page load (used by the UI when an error happened).
   */
  retry(): void {
    this.loadOffers(this.currentPageSignal());
  }

  /**
   * Dismiss any shown error message.
   */
  dismissError(): void {
    this.errorMessageSignal.set(null);
  }

  /**
   * Open the modal to create a new offer.
   */
  onCreateOffer(): void {
    this.selectedOfferSignal.set(null);
    this.isEditModeSignal.set(false);
    this.showEditModalSignal.set(true);
  }

  /**
   * Open the edit modal for a selected offer.
   * @param offer - the Offer selected for editing
   */
  onEditOffer(offer: Offer): void {
    this.selectedOfferSignal.set(offer);
    this.isEditModeSignal.set(true);
    this.showEditModalSignal.set(true);
  }

  /**
   * View details for an offer (currently reuses the edit modal).
   * @param offer - Offer to view
   */
  onViewOffer(offer: Offer): void {
    // Por ahora, abre en modo edición
    // Más adelante puedes crear un modal de solo lectura
    this.onEditOffer(offer);
  }

  /**
   * Handler for clicking an offer row. Opens the edit modal for the offer.
   * @param offer - the clicked Offer
   */
  onOfferClick(offer: Offer): void {
    // Abre el modal de edición cuando se hace click en una fila
    this.onEditOffer(offer);
  }

  /**
   * Delete an offer after user confirmation.
   * @param offer - the Offer to delete
   * @remarks Calls `offersService.deleteOffer` and reloads the list on success.
   */
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

  /**
   * Close the edit/create modal and reset selection state.
   */
  onCloseModal(): void {
    this.showEditModalSignal.set(false);
    this.selectedOfferSignal.set(null);
    this.isEditModeSignal.set(false);
  }

  /**
   * Save handler for offer create/update events emitted by the modal.
   * Maps to either update or create flows depending on `isEditMode`.
   * @param offerData - partial Offer payload coming from the modal form
   */
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

  /**
   * Navigate back to the partner settings overview.
   */
  goBack(): void {
    this.router.navigate(['/partner/settings']);
  }
}
