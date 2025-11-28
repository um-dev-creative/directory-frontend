import {Injectable, signal} from '@angular/core';
import {delay, Observable, of} from 'rxjs';

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

export interface Offer {
  _id:number;
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: Date;
  status: OfferStatus;
  categoryId: string;
  categoryName?: string;
  type?: string;
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
      _id:1,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Descuento de Verano",
      description: "20% de descuento en todos los productos de temporada",
      discount: 20,
      validUntil: new Date('2024-08-31'),
      status: OfferStatus.ACTIVE,
      categoryId: '8609db8d-8825-4cd3-ae66-c94249bc1023',
      categoryName: 'Temporada',
      createdAt: new Date('2024-06-01'),
      terms: "Válido hasta el 31 de agosto de 2024. No acumulable con otras ofertas. Aplica solo a productos en stock. Descuento aplicado automáticamente al finalizar la compra."
    },
    {
      _id:2,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Black Friday Especial",
      description: "50% de descuento en productos seleccionados",
      discount: 50,
      validUntil: new Date('2024-11-29'),
      status: OfferStatus.ACTIVE,
      categoryId: 'f1dbe0d5-694b-4d48-bd9b-afd2fffc36a5',
      categoryName: 'Evento',
      createdAt: new Date('2024-05-15')
    },
    {
      _id:3,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta de Bienvenida",
      description: "15% de descuento para nuevos clientes",
      discount: 15,
      validUntil: new Date('2024-12-31'),
      status: OfferStatus.ACTIVE,
      categoryId: 'a77bb4a7-9845-487c-bbdd-a9bc55da5214',
      categoryName: 'Nuevos Clientes',
      createdAt: new Date('2024-01-01')
    },
    {
      _id:4,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Descuento Estudiantil",
      description: "10% de descuento para estudiantes universitarios",
      discount: 10,
      validUntil: new Date('2024-09-30'),
      status: OfferStatus.INACTIVE,
      categoryId: 'e43fdffc-4128-408b-b987-53000c79744d',
      categoryName: 'Educación',
      createdAt: new Date('2024-03-01')
    },
    {
      _id:5,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta Navideña",
      description: "30% de descuento en la temporada navideña",
      discount: 30,
      validUntil: new Date('2023-12-31'),
      status: OfferStatus.EXPIRED,
      categoryId: '124814d6-5751-4941-a471-5f989790c377',
      categoryName: 'Temporada',
      createdAt: new Date('2023-11-01')
    },
    {
      _id:6,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Cyber Monday",
      description: "40% de descuento en productos tecnológicos",
      discount: 40,
      validUntil: new Date('2024-11-30'),
      status: OfferStatus.ACTIVE,
      categoryId: '85366e4a-fcdf-4406-98cd-13fbdfba0e57',
      categoryName: 'Tecnología',
      createdAt: new Date('2024-04-10')
    },
    {
      _id:7,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta de Primavera",
      description: "25% de descuento en productos de jardín",
      discount: 25,
      validUntil: new Date('2024-06-30'),
      status: OfferStatus.EXPIRED,
      categoryId: '798c1fa4-ece4-4a61-b0a4-947aae22fba4',
      categoryName: 'Jardín',
      createdAt: new Date('2024-03-15')
    },
    {
      _id:8,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Descuento Corporativo",
      description: "35% de descuento para empresas",
      discount: 35,
      validUntil: new Date('2024-10-31'),
      status: OfferStatus.ACTIVE,
      categoryId: 'df10f334-115c-4bba-88be-6d5b38a60869',
      categoryName: 'Empresas',
      createdAt: new Date('2024-02-01')
    },
    {
      _id:9,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta Flash",
      description: "60% de descuento por tiempo limitado",
      discount: 60,
      validUntil: new Date('2024-07-20'),
      status: OfferStatus.INACTIVE,
      categoryId: 'a7d966c8-df71-431a-97fd-1d2d1e642a28',
      categoryName: 'Flash',
      createdAt: new Date('2024-07-01')
    },
    {
      _id:10,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Descuento de Aniversario",
      description: "45% de descuento por nuestro aniversario",
      discount: 45,
      validUntil: new Date('2024-09-15'),
      status: OfferStatus.ACTIVE,
      categoryId: '18f7abf8-a1f5-4c6d-9ab5-ce4ee018de89',
      categoryName: 'Aniversario',
      createdAt: new Date('2024-05-01')
    },
    {
      _id:11,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta de Fin de Año",
      description: "55% de descuento para cerrar el año",
      discount: 55,
      validUntil: new Date('2024-12-31'),
      status: OfferStatus.ACTIVE,
      categoryId: '60d9d00f-efd6-42cc-bbff-69ad4c613cf8',
      categoryName: 'Fin de Año',
      createdAt: new Date('2024-06-15')
    },
    {
      _id:12,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Descuento Familiar",
      description: "20% de descuento para familias numerosas",
      discount: 20,
      validUntil: new Date('2024-08-15'),
      status: OfferStatus.INACTIVE,
      categoryId: '052e5903-cf7e-40c5-a852-bf35111a323b',
      categoryName: 'Familia',
      createdAt: new Date('2024-04-01')
    },
    {
      _id:13,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta VIP",
      description: "70% de descuento para clientes VIP",
      discount: 70,
      validUntil: new Date('2024-11-15'),
      status: OfferStatus.ACTIVE,
      categoryId: '6c101466-c5ab-4f59-aa8a-02443dc27399',
      categoryName: 'VIP',
      createdAt: new Date('2024-03-20')
    },
    {
      _id:14,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Descuento de Lealtad",
      description: "25% de descuento por fidelidad",
      discount: 25,
      validUntil: new Date('2024-10-01'),
      status: OfferStatus.ACTIVE,
      categoryId: '5f305402-a452-464d-b6e7-d95d0d5f7a49',
      categoryName: 'Lealtad',
      createdAt: new Date('2024-01-15')
    },
    {
      _id:15,
      id: "7fa5e73a-07d0-4763-8498-ef28168616fb",
      title: "Oferta Especial San Valentín",
      description: "40% de descuento en productos románticos",
      discount: 40,
      validUntil: new Date('2024-02-14'),
      status: OfferStatus.EXPIRED,
      categoryId: 'c82970dc-b867-440f-be0b-2d7e8f38b0fa',
      categoryName: 'Romántico',
      createdAt: new Date('2024-01-01')
    }
  ];

  // Señales para el estado
  private readonly offersSignal = signal<Offer[]>(this.mockOffers);
  private readonly loadingSignal = signal<boolean>(false);

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
  getOfferById(_id: number): Observable<Offer | null> {
    const offer = this.mockOffers.find(o => o._id === _id);
    return of(offer || null).pipe(delay(200));
  }

  /**
   * Actualiza una oferta
   */
  updateOffer(_id: number, updatedOffer: Partial<Offer>): Observable<Offer> {
    this.loadingSignal.set(true);

    const index = this.mockOffers.findIndex(o => o._id === _id);
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
  createOffer(newOffer: Omit<Offer, '_id' | 'createdAt'>): Observable<Offer> {
    this.loadingSignal.set(true);

    const offer: Offer = {
      ...newOffer,
      _id: Math.max(...this.mockOffers.map(o => o._id)) + 1,
      createdAt: new Date()
    };

    this.mockOffers.unshift(offer);
    this.offersSignal.set([...this.mockOffers]);

    return of(offer).pipe(delay(300));
  }

  /**
   * Elimina una oferta
   */
  deleteOffer(id: string): Observable<boolean> {
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
