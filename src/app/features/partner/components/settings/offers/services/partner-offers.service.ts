import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Offer {
  id: number;
  title: string;
  description: string;
  discount: number;
  validUntil: Date;
  status: 'active' | 'inactive' | 'expired';
  category: string;
  createdAt: Date;
  terms?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerOffersService {
  private mockOffers: Offer[] = [
    {
      id: 1,
      title: "Descuento de Verano",
      description: "20% de descuento en todos los productos de temporada",
      discount: 20,
      validUntil: new Date('2024-08-31'),
      status: 'active',
      category: 'Temporada',
      createdAt: new Date('2024-06-01'),
      terms: "Válido hasta el 31 de agosto de 2024. No acumulable con otras ofertas. Aplica solo a productos en stock. Descuento aplicado automáticamente al finalizar la compra."
    },
    {
      id: 2,
      title: "Black Friday Especial",
      description: "50% de descuento en productos seleccionados",
      discount: 50,
      validUntil: new Date('2024-11-29'),
      status: 'active',
      category: 'Evento',
      createdAt: new Date('2024-05-15')
    },
    {
      id: 3,
      title: "Oferta de Bienvenida",
      description: "15% de descuento para nuevos clientes",
      discount: 15,
      validUntil: new Date('2024-12-31'),
      status: 'active',
      category: 'Nuevos Clientes',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 4,
      title: "Descuento Estudiantil",
      description: "10% de descuento para estudiantes universitarios",
      discount: 10,
      validUntil: new Date('2024-09-30'),
      status: 'inactive',
      category: 'Educación',
      createdAt: new Date('2024-03-01')
    },
    {
      id: 5,
      title: "Oferta Navideña",
      description: "30% de descuento en la temporada navideña",
      discount: 30,
      validUntil: new Date('2023-12-31'),
      status: 'expired',
      category: 'Temporada',
      createdAt: new Date('2023-11-01')
    },
    {
      id: 6,
      title: "Cyber Monday",
      description: "40% de descuento en productos tecnológicos",
      discount: 40,
      validUntil: new Date('2024-11-30'),
      status: 'active',
      category: 'Tecnología',
      createdAt: new Date('2024-04-10')
    },
    {
      id: 7,
      title: "Oferta de Primavera",
      description: "25% de descuento en productos de jardín",
      discount: 25,
      validUntil: new Date('2024-06-30'),
      status: 'expired',
      category: 'Jardín',
      createdAt: new Date('2024-03-15')
    },
    {
      id: 8,
      title: "Descuento Corporativo",
      description: "35% de descuento para empresas",
      discount: 35,
      validUntil: new Date('2024-10-31'),
      status: 'active',
      category: 'Empresas',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 9,
      title: "Oferta Flash",
      description: "60% de descuento por tiempo limitado",
      discount: 60,
      validUntil: new Date('2024-07-20'),
      status: 'inactive',
      category: 'Flash',
      createdAt: new Date('2024-07-01')
    },
    {
      id: 10,
      title: "Descuento de Aniversario",
      description: "45% de descuento por nuestro aniversario",
      discount: 45,
      validUntil: new Date('2024-09-15'),
      status: 'active',
      category: 'Aniversario',
      createdAt: new Date('2024-05-01')
    },
    {
      id: 11,
      title: "Oferta de Fin de Año",
      description: "55% de descuento para cerrar el año",
      discount: 55,
      validUntil: new Date('2024-12-31'),
      status: 'active',
      category: 'Fin de Año',
      createdAt: new Date('2024-06-15')
    },
    {
      id: 12,
      title: "Descuento Familiar",
      description: "20% de descuento para familias numerosas",
      discount: 20,
      validUntil: new Date('2024-08-15'),
      status: 'inactive',
      category: 'Familia',
      createdAt: new Date('2024-04-01')
    },
    {
      id: 13,
      title: "Oferta VIP",
      description: "70% de descuento para clientes VIP",
      discount: 70,
      validUntil: new Date('2024-11-15'),
      status: 'active',
      category: 'VIP',
      createdAt: new Date('2024-03-20')
    },
    {
      id: 14,
      title: "Descuento de Lealtad",
      description: "25% de descuento por fidelidad",
      discount: 25,
      validUntil: new Date('2024-10-01'),
      status: 'active',
      category: 'Lealtad',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 15,
      title: "Oferta Especial San Valentín",
      description: "40% de descuento en productos románticos",
      discount: 40,
      validUntil: new Date('2024-02-14'),
      status: 'expired',
      category: 'Romántico',
      createdAt: new Date('2024-01-01')
    }
  ];

  // Señales para el estado
  private offersSignal = signal<Offer[]>(this.mockOffers);
  private loadingSignal = signal<boolean>(false);

  // Getters públicos
  get offers() { return this.offersSignal.asReadonly(); }
  get loading() { return this.loadingSignal.asReadonly(); }

  /**
   * Obtiene ofertas con paginación
   */
  getOffers(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Offer>> {
    this.loadingSignal.set(true);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOffers = this.mockOffers.slice(startIndex, endIndex);

    const response: PaginatedResponse<Offer> = {
      data: paginatedOffers,
      total: this.mockOffers.length,
      page,
      limit,
      totalPages: Math.ceil(this.mockOffers.length / limit)
    };

    return of(response).pipe(
      delay(500), // Simular latencia de red
    );
  }

  /**
   * Obtiene una oferta por ID
   */
  getOfferById(id: number): Observable<Offer | null> {
    const offer = this.mockOffers.find(o => o.id === id);
    return of(offer || null).pipe(delay(200));
  }

  /**
   * Actualiza una oferta
   */
  updateOffer(id: number, updatedOffer: Partial<Offer>): Observable<Offer> {
    this.loadingSignal.set(true);

    const index = this.mockOffers.findIndex(o => o.id === id);
    if (index !== -1) {
      this.mockOffers[index] = { ...this.mockOffers[index], ...updatedOffer };
      this.offersSignal.set([...this.mockOffers]);
    }

    return of(this.mockOffers[index]).pipe(
      delay(300)
    );
  }

  /**
   * Crea una nueva oferta
   */
  createOffer(newOffer: Omit<Offer, 'id' | 'createdAt'>): Observable<Offer> {
    this.loadingSignal.set(true);

    const offer: Offer = {
      ...newOffer,
      id: Math.max(...this.mockOffers.map(o => o.id)) + 1,
      createdAt: new Date()
    };

    this.mockOffers.unshift(offer);
    this.offersSignal.set([...this.mockOffers]);

    return of(offer).pipe(delay(300));
  }

  /**
   * Elimina una oferta
   */
  deleteOffer(id: number): Observable<boolean> {
    this.loadingSignal.set(true);

    const index = this.mockOffers.findIndex(o => o.id === id);
    if (index !== -1) {
      this.mockOffers.splice(index, 1);
      this.offersSignal.set([...this.mockOffers]);
      return of(true).pipe(delay(200));
    }

    return of(false).pipe(delay(200));
  }

  /**
   * Actualiza el estado de carga
   */
  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }
}
