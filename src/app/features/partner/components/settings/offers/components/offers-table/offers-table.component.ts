import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer, PaginatedResponse, OfferStatus } from '../../services/partner-offers.service';
import { CampaignClient, PaginatedCampaigns } from '@app/core/services/campaign/campaign.client';

// Importar componentes UI
import { Button } from '@app/components/ui/buttons/button';
import { BadgeComponent, BadgeVariant } from '@app/components/ui/badges/badge';
import {UiVariant} from '@app/components/ui/ui-variant';

@Component({
  selector: 'app-offers-table',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    BadgeComponent
  ],
  templateUrl: 'offers-table.component.html',
  styleUrls: ['./offers-table.component.css']
})
export class OffersTableComponent implements OnInit {
  private readonly campaignClient = inject(CampaignClient);
  @Input() paginatedData: PaginatedResponse<Offer> | null = null;
  @Input() isLoading: boolean = false;
  @Input() currentPage: number = 1;

  // simple error state for template or tests
  internalError: string | null = null;

  @Output() pageChange = new EventEmitter<number>();
  @Output() editOffer = new EventEmitter<Offer>();
  @Output() viewOffer = new EventEmitter<Offer>();
  @Output() deleteOffer = new EventEmitter<Offer>();
  @Output() createOffer = new EventEmitter<void>();
  @Output() offerClick = new EventEmitter<Offer>();

  get startIndex(): number {
    if (!this.paginatedData) return 0;
    return (this.currentPage - 1) * this.paginatedData.limit + 1;
  }

  get endIndex(): number {
    if (!this.paginatedData) return 0;
    return Math.min(
      this.currentPage * this.paginatedData.limit,
      this.paginatedData.total
    );
  }

  getStatusVariant(status: Offer['status']): BadgeVariant {
    switch (status) {
      case OfferStatus.ACTIVE:
        return UiVariant.Success;
      case OfferStatus.INACTIVE:
        return UiVariant.Secondary;
      case OfferStatus.EXPIRED:
        return UiVariant.Warning;
      default:
        return UiVariant.Default;
    }
  }

  // PENDING -  Change to internationalization service if available in future
  getStatusLabel(status: Offer['status']): string {
    switch (status) {
      case OfferStatus.ACTIVE:
        return 'Activa';
      case OfferStatus.INACTIVE:
        return 'Inactiva';
      case OfferStatus.EXPIRED:
        return 'Expirada';
      default:
        return 'Desconocido';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  getPageNumbers(): number[] {
    if (!this.paginatedData) return [];

    const totalPages = this.paginatedData.totalPages;
    const current = this.currentPage;
    const delta = 2; // Mostrar 2 páginas a cada lado de la actual

    const pages: number[] = [];

    // Siempre mostrar la primera página
    if (current > delta + 1) {
      pages.push(1);
      if (current > delta + 2) {
        pages.push(-1); // Placeholder para "..."
      }
    }

    // Páginas alrededor de la actual
    for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
      pages.push(i);
    }

    // Siempre mostrar la última página
    if (current < totalPages - delta) {
      if (current < totalPages - delta - 1) {
        pages.push(-1); // Placeholder para "..."
      }
      pages.push(totalPages);
    }

    return pages.filter(page => page !== -1); // Remover placeholders por ahora
  }

  onPageChange(page: number): void {

    if (page >= 1 && this.paginatedData
      && page <= this.paginatedData.totalPages) {
      if(this.paginatedData?.limit * page > this.paginatedData?.data.length) {
        this.load(page);
      }
      this.pageChange.emit(page);
    }
  }

  ngOnInit(): void {
    // If parent hasn't provided paginatedData, fetch campaigns from backend
    if (!this.paginatedData) {
      this.load(this.currentPage);
    }
  }

  private load(page: number = 1): void {
    this.isLoading = true;
    this.internalError = null;
    this.campaignClient.list({ page, limit: 10 }).subscribe({
      next: (resp: PaginatedCampaigns) => {
        // Map campaigns into Offer-like objects for display (minimal fields)
        const offers = resp.items.map((c, index) => ({
          _id: (index+1),
          id: c.id??'',
          title: c.title,
          description: c.description ?? '',
          discount: c.discount ?? 0,
          validUntil: c.endDate ? new Date(c.endDate) : new Date(),
          status: (c.status === OfferStatus.ACTIVE ? OfferStatus.ACTIVE : (c.status === OfferStatus.EXPIRED ? OfferStatus.EXPIRED : OfferStatus.INACTIVE)) as Offer['status'],
          category: { id: c.categoryId, name: c.categoryName },
          createdAt: new Date(),
        })) as Offer[];

        this.paginatedData = {
          data: offers,
          total: resp.total_count,
          page: resp.page,
          limit: resp.per_page,
          totalPages: resp.total_pages
        };
        this.currentPage = resp.page;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('OffersTableComponent.load error', err);
        this.internalError = err?.message ?? 'Error loading campaigns';
        this.isLoading = false;
      }
    });
  }

  // Retry helper used by tests
  retry(): void {
    this.load(this.currentPage);
  }

  onEditOffer(event: Event, offer: Offer): void {
    event.stopPropagation();
    this.editOffer.emit(offer);
  }

  onViewOffer(event: Event, offer: Offer): void {
    event.stopPropagation();
    this.viewOffer.emit(offer);
  }

  onDeleteOffer(event: Event, offer: Offer): void {
    event.stopPropagation();
    this.deleteOffer.emit(offer);
  }

  onCreateOffer(): void {
    this.createOffer.emit();
  }

  onOfferClick(offer: Offer): void {
    this.offerClick.emit(offer);
  }
}
