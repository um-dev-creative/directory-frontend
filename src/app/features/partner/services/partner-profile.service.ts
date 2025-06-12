import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface PartnerProfile {
  id: number;
  slug: string;
  name: string;
  logo: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  categories: string[];
  website: string;
  availableChannels: ('online' | 'in-store')[];
  rating: number;
  reviewCount: number;
  redemptionInstructions: string;
  termsAndConditions: string;
  images: string[];
  location?: {
    address: string;
    city: string;
    country: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  offers: {
    id: number;
    name: string; // Cambiar de title a name
    image: string;
    discount: string;
    isOnline: boolean;
    isInStore: boolean;
  }[];
  isBookmarked: boolean;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class PartnerProfileService {
  private useMockData = true;

  private mockPartners: PartnerProfile[] = [
    {
      id: 1,
      slug: 'muji',
      name: 'MUJI',
      logo: 'https://storage.spccard.ca/MUJI_LOGO_192x192-min.jpg',
      description: 'MUJI es una marca japonesa de estilo de vida minimalista que ofrece productos de alta calidad sin marca aparente. Desde 1980, MUJI ha estado comprometida con la simplicidad, la funcionalidad y la sostenibilidad. Nuestra filosofía se basa en crear productos que sean simples, duraderos y accesibles para todos. Ofrecemos una amplia gama de productos que incluyen artículos para el hogar, ropa, papelería, alimentos y mucho más. Cada producto MUJI está diseñado con cuidado para eliminar lo innecesario y mantener solo lo esencial.',
      shortDescription: '10% de descuento en mercancía a precio regular.',
      benefits: [
        '10% de descuento en mercancía a precio regular',
        'Envío gratuito en compras superiores a $50',
        'Acceso exclusivo a productos de temporada',
        'Descuentos adicionales en eventos especiales'
      ],
      categories: ['Hogar', 'Estilo de Vida', 'Minimalista'],
      website: 'https://www.muji.com',
      availableChannels: ['online', 'in-store'],
      rating: 4.8,
      reviewCount: 2847,
      redemptionInstructions: 'Presenta tu tarjeta de miembro al momento de la compra en tienda o ingresa tu código de miembro al finalizar la compra en línea.',
      termsAndConditions: 'No acumulable con otras promociones. Válido solo para productos a precio regular. Expiración: 31 de diciembre de 2025.',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      location: {
        address: '123 Main Street',
        city: 'Toronto',
        country: 'Canada'
      },
      socialMedia: {
        instagram: '@muji_global',
        facebook: 'MUJI.jp',
        twitter: '@muji_net'
      },
      contact: {
        email: 'contact@muji.com',
        phone: '+1-800-123-4567'
      },
      offers: [
        {
          id: 101,
          name: 'Descuento en Hogar',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          discount: '10% OFF',
          isOnline: true,
          isInStore: true
        },
        {
          id: 102,
          name: 'Envío Gratis',
          image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
          discount: 'Free Shipping',
          isOnline: true,
          isInStore: false
        }
      ],
      isBookmarked: false,
      status: 'active'
    },
    {
      id: 2,
      slug: 'gymshark',
      name: 'Gymshark',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      description: 'Gymshark hace ropa deportiva de alta calidad para entrenar. Pero eso no es ni la mitad de lo que hacemos. Existimos para unir a la comunidad de acondicionamiento. Lo hacemos proporcionando las herramientas para ayudar a todos a convertirse en su mejor versión personal: la ropa en la que sudarás, el contenido que te inspirará y la comunidad a la que sentirás que perteneces. Somos una familia global de más de 10 millones de personas. Dicen que su comunidad "no está unida por nuestros objetivos, sino por las cosas que hacemos para lograrlos". Fundada en 2012 por el entonces adolescente Ben Francis y un grupo de sus amigos de la escuela secundaria, Gymshark ha crecido desde una operación de serigrafía en un garaje hasta convertirse en una de las marcas de más rápido crecimiento y más reconocibles en el fitness.',
      shortDescription: '15% de descuento en toda la colección deportiva.',
      benefits: [
        '15% de descuento en toda la colección',
        'Envío gratuito en compras superiores a $75',
        'Acceso prioritario a nuevos lanzamientos',
        'Programa de puntos de lealtad'
      ],
      categories: ['Fitness', 'Deportes', 'Ropa Deportiva'],
      website: 'https://www.gymshark.com',
      availableChannels: ['online', 'in-store'],
      rating: 4.6,
      reviewCount: 5623,
      redemptionInstructions: 'Usa el código MEMBER15 al finalizar tu compra en línea o muestra tu membresía en tienda.',
      termsAndConditions: 'Válido hasta el 31 de marzo de 2025. No acumulable con otras ofertas. Excluye artículos en oferta.',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      ],
      contact: {
        email: 'support@gymshark.com'
      },
      offers: [],
      isBookmarked: true,
      status: 'active'
    },
    {
      id: 3,
      slug: 'starbucks',
      name: 'Starbucks',
      logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
      description: 'Starbucks Corporation es una cadena estadounidense de cafeterías fundada en Seattle, Washington, en 1971. Es la compañía de café más grande del mundo, con más de 30,000 ubicaciones en todo el mundo. Starbucks es conocido por su café de alta calidad, bebidas especializadas y ambiente acogedor. Nuestra misión es inspirar y nutrir el espíritu humano, una persona, una taza y un barrio a la vez.',
      shortDescription: '20% de descuento en bebidas y alimentos.',
      benefits: [
        '20% de descuento en bebidas y alimentos',
        'Acumulación doble de estrellas',
        'Bebida gratis en tu cumpleaños',
        'Acceso anticipado a nuevos productos'
      ],
      categories: ['Café', 'Bebidas', 'Alimentación'],
      website: 'https://www.starbucks.com',
      availableChannels: ['online', 'in-store'],
      rating: 4.3,
      reviewCount: 8921,
      redemptionInstructions: 'Presenta tu tarjeta de miembro en tienda o usa el código MEMBER20 en pedidos online.',
      termsAndConditions: 'Válido en ubicaciones participantes. No válido con otras promociones. Válido hasta el 30 de junio de 2025.',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      contact: {
        email: 'support@starbucks.com'
      },
      offers: [
        {
          id: 301,
          name: '20% en Bebidas',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          discount: '20% OFF',
          isOnline: false,
          isInStore: true
        }
      ],
      isBookmarked: false,
      status: 'active'
    },
    {
      id: 4,
      slug: 'nike',
      name: 'Nike',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      description: 'Nike, Inc. es una corporación multinacional estadounidense que se dedica al diseño, desarrollo, fabricación y comercialización mundial de calzado, ropa, equipo, accesorios y servicios. La compañía tiene su sede cerca de Beaverton, Oregón, en el área metropolitana de Portland. Es el proveedor más grande del mundo de calzado atlético y ropa y un importante fabricante de equipos deportivos.',
      shortDescription: '25% de descuento en colección atlética.',
      benefits: [
        '25% de descuento en productos seleccionados',
        'Acceso exclusivo a lanzamientos limitados',
        'Envío gratuito en todas las compras',
        'Devoluciones extendidas de 60 días'
      ],
      categories: ['Deportes', 'Calzado', 'Ropa Deportiva'],
      website: 'https://www.nike.com',
      availableChannels: ['online', 'in-store'],
      rating: 4.7,
      reviewCount: 12456,
      redemptionInstructions: 'Aplica automáticamente al checkout con tu cuenta de miembro o presenta tu tarjeta en tienda.',
      termsAndConditions: '* Máximo $600 por cupón. La oferta no se puede combinar con ventas, liquidaciones o artículos en promoción. La oferta no es válida en lanzamientos especiales, incluyendo pero no limitado a Yeezy, Jordan Retros, Nike Lebron, Air Jordans, Nike Air Force series, Nike Kyrie, Nike Foamposite, Nike Kobe, Nike PG y Adidas Ultra Boost. Pueden aplicarse exclusiones adicionales. Las ofertas de SPC son válidas solo en las ubicaciones y socios participantes en Canadá. Se aplican restricciones, las ofertas pueden variar. El uso puede estar restringido cuando se combine con cualquier otra oferta, liquidación, promoción en tienda o en línea, o tarjeta de fidelidad de minorista. No se puede utilizar para la compra de tarjetas de regalo o certificados. Las ofertas son solo para miembros SPC; se puede requerir una identificación de estudiante válida (excepto para miembros VIP y CIBC) y un código promocional al realizar una compra. Las ofertas pueden expirar o ser eliminadas en cualquier momento sin previo aviso.',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'
      ],
      location: {
        address: '456 Athletic Street',
        city: 'Portland',
        country: 'United States'
      },
      contact: {
        email: 'members@nike.com',
        phone: '+1-800-806-6453'
      },
      offers: [
        {
          id: 401,
          name: '25% en Calzado',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
          discount: '25% OFF',
          isOnline: true,
          isInStore: true
        }
      ],
      isBookmarked: false,
      status: 'active'
    },
    {
      id: 5,
      slug: 'umdevcreative',
      name: 'UM DEV Creative',
      logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
      description: 'UM DEV Creative es una agencia de desarrollo web y diseño digital especializada en crear experiencias digitales únicas y efectivas. Nuestro equipo de expertos combina creatividad y tecnología para ofrecer soluciones personalizadas que impulsan el crecimiento de nuestros clientes. Desde sitios web atractivos hasta aplicaciones móviles innovadoras, estamos comprometidos con la excelencia en cada proyecto.',
      shortDescription: '30% de descuento en servicios de desarrollo web.',
      benefits: [
        '30% de descuento en el primer proyecto',
        'Consultoría gratuita de 1 hora',
        'Soporte técnico gratuito durante 3 meses',
        'Actualizaciones y mantenimiento a precios reducidos'
      ],
      categories: ['Desarrollo Web', 'Diseño Digital', 'Marketing Digital'],
      website: 'https://www.umdevcreative.com',
      availableChannels: ['online'],
      rating: 4.9,
      reviewCount: 1023,
      redemptionInstructions: 'Contacta a nuestro equipo a través del formulario en nuestro sitio web y menciona tu membresía para obtener el descuento.',
      termsAndConditions: 'Oferta válida hasta el 31 de diciembre de 2025. No acumulable con otras promociones. Aplican términos y condiciones adicionales.',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      contact: {
        email: 'hello@uumdc.com',
        phone: '+1-555-123-4567'
      },
      offers: [
        {
          id: 501,
          name: '30% en Desarrollo Web',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          discount: '30% OFF',
          isOnline: true,
          isInStore: false
        }
      ],
      isBookmarked: true,
      status: 'active'
    }
  ];

  constructor() {}

  getPartnerById(id: string): Observable<PartnerProfile | null> {
    if (this.useMockData) {
      const partner = this.mockPartners.find(p => p.id.toString() === id);
      console.log('🎯 Mock: Getting partner profile by ID:', partner);
      return of(partner || null).pipe(delay(800));
    }

    // In real implementation, this would be an HTTP request
    return of(null);
  }

  getPartnerBySlug(slug: string): Observable<PartnerProfile | null> {
    if (this.useMockData) {
      const partner = this.mockPartners.find(p => p.slug === slug);
      console.log('🎯 Mock: Getting partner profile by slug:', partner);
      return of(partner || null).pipe(delay(800));
    }

    // In real implementation, this would be an HTTP request
    return of(null);
  }

  getAllPartners(): Observable<PartnerProfile[]> {
    if (this.useMockData) {
      console.log('🎯 Mock: Getting all partner profiles');
      return of([...this.mockPartners]).pipe(delay(500));
    }

    return of([]);
  }

  toggleBookmark(partnerId: string | number): Observable<boolean> {
    if (this.useMockData) {
      const partner = this.mockPartners.find(p => p.id.toString() === partnerId.toString());
      if (partner) {
        partner.isBookmarked = !partner.isBookmarked;
        console.log('🎯 Mock: Toggled bookmark for partner:', partner.name, partner.isBookmarked);
        return of(partner.isBookmarked).pipe(delay(300));
      }
    }

    return of(false);
  }

  getSimilarPartners(partnerId: string | number, limit: number = 6): Observable<PartnerProfile[]> {
    if (this.useMockData) {
      const similarPartners = this.mockPartners
        .filter(p => p.id.toString() !== partnerId.toString())
        .slice(0, limit);

      console.log('🎯 Mock: Getting similar partners');
      return of(similarPartners).pipe(delay(600));
    }

    return of([]);
  }
}
