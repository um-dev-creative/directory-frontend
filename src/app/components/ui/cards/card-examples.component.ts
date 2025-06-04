import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Button,
  CardComponent,
  BadgeComponent,
  InputComponent
} from '@app/components/ui';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, Button, InputComponent],
  template: `
    <div class="tw-p-8 tw-bg-gradient-hero tw-min-h-screen">
      <div class="tw-max-w-7xl tw-mx-auto">
        <div class="tw-text-center tw-mb-12">
          <h1 class="tw-text-4xl tw-font-bold tw-text-emerald-green-700 tw-mb-4">
            Card Component Examples
          </h1>
          <p class="tw-text-lg tw-text-beige-800">
            Ejemplos completos del componente Card para tu directory
          </p>
        </div>

        <!-- Basic Card Variants -->
        <div class="tw-mb-12">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Variantes Básicas</h2>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">

            <!-- Default Card -->
            <app-card
              variant="default"
              title="Empresa ABC"
              subtitle="Servicios Profesionales">
              <p>Una empresa líder en consultoría y servicios especializados con más de 10 años de experiencia.</p>
            </app-card>

            <!-- Elevated Card -->
            <app-card
              variant="elevated"
              title="Tech Solutions"
              subtitle="Desarrollo de Software">
              <p>Soluciones tecnológicas innovadoras para empresas modernas.</p>
            </app-card>

            <!-- Outlined Card -->
            <app-card
              variant="outlined"
              title="Creative Studio"
              subtitle="Diseño y Marketing">
              <p>Estudio creativo especializado en branding y marketing digital.</p>
            </app-card>

            <!-- Interactive Card -->
            <app-card
              variant="interactive"
              title="Startup Hub"
              subtitle="Incubadora de Empresas"
              [clickable]="true"
              (cardClick)="onCardClick('Startup Hub')">
              <p>Espacio colaborativo para emprendedores y startups emergentes.</p>
            </app-card>

            <!-- Gradient Card -->
            <app-card
              variant="gradient"
              title="Premium Business"
              subtitle="Servicios Exclusivos">
              <p>Servicios premium para empresas de alto nivel con atención personalizada.</p>
            </app-card>

            <!-- Loading Card -->
            <app-card
              variant="elevated"
              [loading]="true"
              title="Cargando..."
              subtitle="Obteniendo información">
              <p>Esta card muestra el estado de carga.</p>
            </app-card>
          </div>
        </div>

        <!-- Cards with Headers and Footers -->
        <div class="tw-mb-12">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Cards con Header y Footer</h2>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">

            <!-- Business Card with Status -->
            <app-card
              variant="elevated"
              title="Restaurante El Sabor"
              subtitle="Gastronomía Tradicional"
              [hasHeader]="true"
              [hasFooter]="true">

              <div slot="header" class="tw-flex tw-items-center tw-justify-between tw-w-full">
                <div class="tw-flex tw-space-x-2">
                  <app-badge variant="success" [dot]="true">Abierto</app-badge>
                  <app-badge variant="primary" size="xs">Destacado</app-badge>
                </div>
                <span class="tw-text-sm tw-text-gray-500">★ 4.8</span>
              </div>

              <p class="tw-mb-3">Auténtica comida tradicional con ingredientes frescos y recetas familiares.</p>
              <p class="tw-text-sm tw-text-gray-600">📍 Centro Histórico • 📞 +58 412 123 4567</p>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <div class="tw-flex tw-space-x-2">
                  <app-button variant="primary" size="sm" (buttonClick)="contactBusiness('Restaurante El Sabor')">
                    Contactar
                  </app-button>
                  <app-button variant="outline" size="sm">
                    Ver Menú
                  </app-button>
                </div>
                <span class="tw-text-xs tw-text-gray-500">Hace 2 días</span>
              </div>
            </app-card>

            <!-- Service Provider Card -->
            <app-card
              variant="interactive"
              title="TechFix Solutions"
              subtitle="Reparación de Equipos"
              [hasHeader]="true"
              [hasFooter]="true"
              [clickable]="true"
              (cardClick)="onCardClick('TechFix Solutions')">

              <div slot="header" class="tw-flex tw-items-center tw-justify-between tw-w-full">
                <div class="tw-flex tw-space-x-2">
                  <app-badge variant="warning" [dot]="true">Ocupado</app-badge>
                  <app-badge variant="info" size="xs">Verificado</app-badge>
                </div>
                <span class="tw-text-sm tw-text-gray-500">★ 4.9</span>
              </div>

              <p class="tw-mb-3">Reparación especializada de computadoras, teléfonos y equipos electrónicos.</p>
              <p class="tw-text-sm tw-text-gray-600">🔧 Técnicos certificados • ⚡ Servicio rápido</p>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <div class="tw-flex tw-space-x-2">
                  <app-button variant="primary" size="sm">
                    Solicitar
                  </app-button>
                  <app-button variant="outline" size="sm">
                    Cotizar
                  </app-button>
                </div>
                <span class="tw-text-xs tw-text-gray-500">En línea</span>
              </div>
            </app-card>
          </div>
        </div>

        <!-- Cards with Media -->
        <div class="tw-mb-12">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Cards con Imágenes</h2>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">

            <app-card
              variant="elevated"
              title="Café Central"
              subtitle="Cafetería Artesanal"
              [hasMedia]="true"
              [hasFooter]="true">

              <div slot="media" class="tw-h-48 tw-bg-gradient-to-br tw-from-amber-100 tw-to-orange-200 tw-flex tw-items-center tw-justify-center">
                <div class="tw-text-center">
                  <div class="tw-text-4xl tw-mb-2">☕</div>
                  <span class="tw-text-sm tw-text-gray-600">Imagen del café</span>
                </div>
              </div>

              <p class="tw-mb-3">El mejor café de la ciudad con granos seleccionados y preparación artesanal.</p>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <app-button variant="primary" size="sm">Ver Carta</app-button>
                <app-badge variant="success" size="xs">Abierto</app-badge>
              </div>
            </app-card>

            <app-card
              variant="gradient"
              title="Gimnasio FitLife"
              subtitle="Centro de Entrenamiento"
              [hasMedia]="true"
              [hasFooter]="true">

              <div slot="media" class="tw-h-48 tw-bg-gradient-to-br tw-from-emerald-green-100 tw-to-emerald-green-200 tw-flex tw-items-center tw-justify-center">
                <div class="tw-text-center">
                  <div class="tw-text-4xl tw-mb-2">💪</div>
                  <span class="tw-text-sm tw-text-gray-600">Instalaciones modernas</span>
                </div>
              </div>

              <p class="tw-mb-3">Equipos de última generación y entrenadores profesionales certificados.</p>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <app-button variant="primary" size="sm">Membresía</app-button>
                <app-badge variant="info" size="xs">24/7</app-badge>
              </div>
            </app-card>

            <app-card
              variant="outlined"
              title="Librería Conocimiento"
              subtitle="Libros y Papelería"
              [hasMedia]="true"
              [hasFooter]="true">

              <div slot="media" class="tw-h-48 tw-bg-gradient-to-br tw-from-sky-blue-100 tw-to-sky-blue-200 tw-flex tw-items-center tw-justify-center">
                <div class="tw-text-center">
                  <div class="tw-text-4xl tw-mb-2">📚</div>
                  <span class="tw-text-sm tw-text-gray-600">Gran variedad de libros</span>
                </div>
              </div>

              <p class="tw-mb-3">Amplio catálogo de libros, material escolar y artículos de oficina.</p>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <app-button variant="outline" size="sm">Catálogo</app-button>
                <app-badge variant="secondary" size="xs">Nuevo</app-badge>
              </div>
            </app-card>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div class="tw-mb-12">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Card con Formulario</h2>
          <div class="tw-max-w-lg tw-mx-auto">

            <app-card
              variant="elevated"
              title="Contacto Rápido"
              subtitle="Envía tu consulta"
              [hasFooter]="true"
              padding="lg">

              <form (ngSubmit)="submitContactForm()" class="tw-space-y-4">
                <app-input
                  label="Nombre"
                  placeholder="Tu nombre completo"
                  [required]="true"
                  [(ngModel)]="contactForm.name"
                  name="contactName">
                </app-input>

                <app-input
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  [required]="true"
                  [(ngModel)]="contactForm.email"
                  name="contactEmail">
                </app-input>

                <app-input
                  label="Mensaje"
                  placeholder="Escribe tu consulta..."
                  [required]="true"
                  [(ngModel)]="contactForm.message"
                  name="contactMessage">
                </app-input>
              </form>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <app-button
                  variant="outline"
                  size="sm"
                  (buttonClick)="clearContactForm()">
                  Limpiar
                </app-button>
                <app-button
                  variant="primary"
                  size="sm"
                  (buttonClick)="submitContactForm()">
                  Enviar Consulta
                </app-button>
              </div>
            </app-card>
          </div>
        </div>

        <!-- Interactive Grid -->
        <div class="tw-mb-12">
          <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Directory Interactivo</h2>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
            <app-card
              *ngFor="let business of businesses"
              variant="interactive"
              [title]="business.name"
              [subtitle]="business.category"
              [clickable]="true"
              [hasFooter]="true"
              size="sm"
              (cardClick)="selectBusiness(business)">

              <p class="tw-text-sm tw-mb-2">{{ business.description }}</p>
              <div class="tw-flex tw-flex-wrap tw-gap-1 tw-mb-3">
                <app-badge
                  *ngFor="let tag of business.tags"
                  variant="secondary"
                  size="xs">
                  {{ tag }}
                </app-badge>
              </div>

              <div slot="footer" class="tw-flex tw-justify-between tw-items-center tw-w-full">
                <span class="tw-text-xs tw-text-gray-500">{{ business.location }}</span>
                <app-badge
                  [variant]="business.status === 'open' ? 'success' : 'error'"
                  size="xs"
                  [dot]="true">
                  {{ business.status === 'open' ? 'Abierto' : 'Cerrado' }}
                </app-badge>
              </div>
            </app-card>
          </div>
        </div>

        <!-- Feedback -->
        <div *ngIf="selectedBusiness" class="tw-fixed tw-bottom-4 tw-right-4 tw-max-w-sm">
          <app-card
            variant="gradient"
            [hasHeader]="true"
            [hasFooter]="true">

            <div slot="header" class="tw-flex tw-justify-between tw-items-center tw-w-full">
              <span class="tw-font-semibold tw-text-emerald-green-700">Seleccionado</span>
              <button
                (click)="selectedBusiness = null"
                class="tw-text-gray-400 hover:tw-text-gray-600">
                ✕
              </button>
            </div>

            <h4 class="tw-font-semibold tw-mb-1">{{ selectedBusiness.name }}</h4>
            <p class="tw-text-sm tw-text-gray-600">{{ selectedBusiness.category }}</p>

            <div slot="footer" class="tw-flex tw-space-x-2 tw-w-full">
              <app-button variant="primary" size="sm">Contactar</app-button>
              <app-button variant="outline" size="sm">Ver Perfil</app-button>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CardExamplesComponent {
  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  selectedBusiness: any = null;

  businesses = [
    {
      name: 'Panadería Doña María',
      category: 'Alimentación',
      description: 'Pan fresco y repostería casera desde 1985.',
      tags: ['Pan', 'Dulces', 'Tradicional'],
      location: 'Centro',
      status: 'open'
    },
    {
      name: 'AutoTaller Pérez',
      category: 'Automotriz',
      description: 'Reparación y mantenimiento de vehículos.',
      tags: ['Mecánica', 'Pintura', 'Repuestos'],
      location: 'Industrial',
      status: 'open'
    },
    {
      name: 'Farmacia Salud Plus',
      category: 'Salud',
      description: 'Medicamentos y productos de cuidado personal.',
      tags: ['Medicinas', '24h', 'Delivery'],
      location: 'Residencial',
      status: 'open'
    },
    {
      name: 'Boutique Elegancia',
      category: 'Moda',
      description: 'Ropa y accesorios de última tendencia.',
      tags: ['Ropa', 'Accesorios', 'Moda'],
      location: 'Centro Comercial',
      status: 'closed'
    },
    {
      name: 'Ferretería El Tornillo',
      category: 'Construcción',
      description: 'Herramientas y materiales de construcción.',
      tags: ['Herramientas', 'Construcción', 'Hogar'],
      location: 'Industrial',
      status: 'open'
    },
    {
      name: 'Peluquería Style',
      category: 'Belleza',
      description: 'Cortes, peinados y tratamientos capilares.',
      tags: ['Cortes', 'Tinte', 'Tratamientos'],
      location: 'Centro',
      status: 'open'
    },
    {
      name: 'Pizzería Nápoles',
      category: 'Restaurante',
      description: 'Pizzas artesanales con ingredientes frescos.',
      tags: ['Pizza', 'Italiana', 'Delivery'],
      location: 'Zona Norte',
      status: 'open'
    },
    {
      name: 'Óptica Visión',
      category: 'Salud',
      description: 'Lentes, monturas y exámenes de la vista.',
      tags: ['Lentes', 'Exámenes', 'Monturas'],
      location: 'Centro Médico',
      status: 'closed'
    }
  ];

  onCardClick(cardName: string): void {
    console.log(`Card clicked: ${cardName}`);
  }

  contactBusiness(businessName: string): void {
    console.log(`Contacting: ${businessName}`);
  }

  selectBusiness(business: any): void {
    this.selectedBusiness = business;
    console.log('Selected business:', business);
  }

  submitContactForm(): void {
    if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
      console.log('Contact form submitted:', this.contactForm);
      alert('¡Consulta enviada exitosamente!');
      this.clearContactForm();
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  clearContactForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }
}
