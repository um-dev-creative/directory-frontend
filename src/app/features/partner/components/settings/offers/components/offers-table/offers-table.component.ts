import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer, PaginatedResponse } from '../../services/partner-offers.service';

// Importar componentes UI
import { Button, ButtonVariant } from '@app/components/ui/buttons/button';
import { BadgeComponent, BadgeVariant } from '@app/components/ui/badges/badge';

@Component({
  selector: 'app-offers-table',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    BadgeComponent
  ],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-overflow-hidden">
      <!-- Header de la tabla -->
      <div class="tw-px-6 tw-py-4 tw-border-b tw-border-beige-200">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700">Lista de Ofertas</h3>
        <p class="tw-text-sm tw-text-gray-600 tw-mt-1">
          Mostrando {{ startIndex }} - {{ endIndex }} de {{ paginatedData?.total || 0 }} ofertas
        </p>
      </div>

      <!-- Tabla -->
      <div class="tw-overflow-x-auto">
        <table class="tw-w-full">
          <thead class="tw-bg-beige-50">
            <tr>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                ID
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                Título
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                Descuento
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                Válido hasta
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                Estado
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                Categoría
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-right tw-text-xs tw-font-medium tw-text-gray-700 tw-uppercase tw-tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="tw-bg-white tw-divide-y tw-divide-beige-200">
            @if (isLoading) {
              @for (item of [1,2,3,4,5,6,7,8,9,10]; track item) {
                <tr class="tw-animate-pulse">
                  <td class="tw-px-6 tw-py-4">
                    <div class="tw-h-4 tw-bg-beige-200 tw-rounded tw-w-8"></div>
                  </td>
                  <td class="tw-px-6 tw-py-4">
                    <div class="tw-h-4 tw-bg-beige-200 tw-rounded tw-w-32"></div>
                  </td>
                  <td class="tw-px-6 tw-py-4">
                    <div class="tw-h-4 tw-bg-beige-200 tw-rounded tw-w-12"></div>
                  </td>
                  <td class="tw-px-6 tw-py-4">
                    <div class="tw-h-4 tw-bg-beige-200 tw-rounded tw-w-24"></div>
                  </td>
                  <td class="tw-px-6 tw-py-4">
                    <div class="tw-h-6 tw-bg-beige-200 tw-rounded-full tw-w-16"></div>
                  </td>
                  <td class="tw-px-6 tw-py-4">
                    <div class="tw-h-4 tw-bg-beige-200 tw-rounded tw-w-20"></div>
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-text-right">
                    <div class="tw-h-8 tw-bg-beige-200 tw-rounded tw-w-20 tw-ml-auto"></div>
                  </td>
                </tr>
              }
            } @else {
              @for (offer of paginatedData?.data || []; track offer.id) {
                <tr
                  class="hover:tw-bg-beige-100/80 tw-transition-colors tw-cursor-pointer"
                  (click)="onOfferClick(offer)"
                >
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium tw-text-gray-900">
                    #{{ offer.id }}
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                    <div>
                      <div class="tw-text-sm tw-font-medium tw-text-gray-900">{{ offer.title }}</div>
                      <div class="tw-text-sm tw-text-gray-500 tw-truncate tw-max-w-xs">{{ offer.description }}</div>
                    </div>
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                    <span class="tw-text-sm tw-font-semibold tw-text-emerald-green-600">
                      {{ offer.discount }}%
                    </span>
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-text-gray-600">
                    {{ formatDate(offer.validUntil) }}
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                    <app-badge [variant]="getStatusVariant(offer.status)">
                      {{ getStatusLabel(offer.status) }}
                    </app-badge>
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-text-gray-600">
                    {{ offer.category }}
                  </td>
                  <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-right tw-text-sm tw-font-medium">
                    <div class="tw-flex tw-justify-end tw-items-center tw-space-x-3">
                      <!-- Icono Editar -->
                      <button
                        type="button"
                        (click)="onEditOffer($event, offer)"
                        title="Editar oferta"
                        class="tw-p-2 tw-rounded-lg tw-text-gray-500 hover:tw-text-emerald-green-600 hover:tw-bg-emerald-green-50 tw-transition-all tw-duration-200 tw-group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tw-w-4 tw-h-4 tw-transition-transform group-hover:tw-scale-110">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>

                      <!-- Icono Ver -->
                      <button
                        type="button"
                        (click)="onViewOffer($event, offer)"
                        title="Ver detalles"
                        class="tw-p-2 tw-rounded-lg tw-text-gray-500 hover:tw-text-sky-blue-600 hover:tw-bg-sky-blue-50 tw-transition-all tw-duration-200 tw-group"
                      >
                        <svg class="tw-w-4 tw-h-4 tw-transition-transform group-hover:tw-scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>

                      <!-- Icono Eliminar (opcional) -->
                      <button
                        type="button"
                        (click)="onDeleteOffer($event, offer)"
                        title="Eliminar oferta"
                        class="tw-p-2 tw-rounded-lg tw-text-gray-500 hover:tw-text-coral-600 hover:tw-bg-coral-50 tw-transition-all tw-duration-200 tw-group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tw-w-4 tw-h-4 tw-transition-transform group-hover:tw-scale-110">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            }

            @if (!isLoading && (!paginatedData || !paginatedData.data || paginatedData.data.length === 0)) {
              <tr>
                <td colspan="7" class="tw-px-6 tw-py-12 tw-text-center">
                  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <svg class="tw-w-16 tw-h-16 tw-text-gray-400 tw-mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h8a2 2 0 012 2v4M6 13h12"></path>
                    </svg>
                    <h3 class="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">No hay ofertas</h3>
                    <p class="tw-text-gray-500 tw-mb-4">Comienza creando tu primera oferta</p>
                    <app-button variant="primary" (click)="onCreateOffer()">
                      <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Crear mi primera oferta
                    </app-button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      @if (paginatedData && paginatedData.totalPages > 1) {
        <div class="tw-px-6 tw-py-4 tw-flex tw-items-center tw-justify-between tw-border-t tw-border-beige-200">
          <!-- Info de página -->
          <div class="tw-text-sm tw-text-gray-600">
            Página {{ currentPage }} de {{ paginatedData.totalPages }}
          </div>

          <!-- Controles de paginación -->
          <div class="tw-flex tw-items-center tw-space-x-2">
            <!-- Botón anterior -->
            <app-button
              variant="outline"
              size="sm"
              [disabled]="currentPage <= 1"
              (click)="onPageChange(currentPage - 1)"
            >
              <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </app-button>

            <!-- Números de página -->
            @for (page of getPageNumbers(); track page) {
              <app-button
                [variant]="page === currentPage ? 'primary' : 'outline'"
                size="sm"
                (click)="onPageChange(page)"
                [class]="page === currentPage ? 'tw-bg-emerald-green-500 tw-text-white tw-rounded-lg tw-border-emerald-green-500' : 'tw-rounded-lg'"
              >
                {{ page }}
              </app-button>
            }

            <!-- Botón siguiente -->
            <app-button
              variant="outline"
              size="sm"
              [disabled]="currentPage >= paginatedData.totalPages"
              (click)="onPageChange(currentPage + 1)"
            >
              <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </app-button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .tw-animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class OffersTableComponent {
  @Input() paginatedData: PaginatedResponse<Offer> | null = null;
  @Input() isLoading: boolean = false;
  @Input() currentPage: number = 1;

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
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'expired':
        return 'warning';
      default:
        return 'default';
    }
  }

  getStatusLabel(status: Offer['status']): string {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'expired':
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
    if (page >= 1 && this.paginatedData && page <= this.paginatedData.totalPages) {
      this.pageChange.emit(page);
    }
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
