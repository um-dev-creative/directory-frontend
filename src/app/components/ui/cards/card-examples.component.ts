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
    <div class="p-8 bg-gradient-hero min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-emerald-green-700 mb-4">
            Card Component Examples
          </h1>
          <p class="text-lg text-beige-800">
            Ejemplos completos del componente Card para tu directory
          </p>
        </div>

        <!-- Basic Card Variants -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Variantes Básicas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Cards con Header y Footer</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Business Card with Status -->
            <app-card
              variant="elevated"
              title="Restaurante El Sabor"
              subtitle="Gastronomía Tradicional"
              [hasHeader]="true"
              [hasFooter]="true">

              <div slot="header" class="flex items-center justify-between w-full">
                <div class="flex space-x-2">
                  <app-badge variant="success" [dot]="true">Abierto</app-badge>
                  <app-badge variant="primary" size="xs">Destacado</app-badge>
                </div>
                <span class="text-sm text-gray-500">★ 4.8</span>
              </div>

              <p class="mb-3">Auténtica comida tradicional con ingredientes frescos y recetas familiares.</p>
              <p class="text-sm text-gray-600">📍 Centro Histórico • 📞 +58 412 123 4567</p>

              <div slot="footer" class="flex justify-between items-center w-full">
                <div class="flex space-x-2">
                  <app-button variant="primary" size="sm" (buttonClick)="contactBusiness('Restaurante El Sabor')">
                    Contactar
                  </app-button>
                  <app-button variant="outline" size="sm">
                    Ver Menú
                  </app-button>
                </div>
                <span class="text-xs text-gray-500">Hace 2 días</span>
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

              <div slot="header" class="flex items-center justify-between w-full">
                <div class="flex space-x-2">
                  <app-badge variant="warning" [dot]="true">Ocupado</app-badge>
                  <app-badge variant="info" size="xs">Verificado</app-badge>
                </div>
                <span class="text-sm text-gray-500">★ 4.9</span>
              </div>

              <p class="mb-3">Reparación especializada de computadoras, teléfonos y equipos electrónicos.</p>
              <p class="text-sm text-gray-600">🔧 Técnicos certificados • ⚡ Servicio rápido</p>

              <div slot="footer" class="flex justify-between items-center w-full">
                <div class="flex space-x-2">
                  <app-button variant="primary" size="sm">
                    Solicitar
                  </app-button>
                  <app-button variant="outline" size="sm">
                    Cotizar
                  </app-button>
                </div>
                <span class="text-xs text-gray-500">En línea</span>
              </div>
            </app-card>
          </div>
        </div>

        <!-- Cards with Media -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Cards con Imágenes</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <app-card
              variant="elevated"
              title="Café Central"
              subtitle="Cafetería Artesanal"
              [hasMedia]="true"
              [hasFooter]="true">

              <div slot="media" class="h-48 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">☕</div>
                  <span class="text-sm text-gray-600">Imagen del café</span>
                </div>
              </div>

              <p class="mb-3">El mejor café de la ciudad con granos seleccionados y preparación artesanal.</p>

              <div slot="footer" class="flex justify-between items-center w-full">
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

              <div slot="media" class="h-48 bg-gradient-to-br from-emerald-green-100 to-emerald-green-200 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">💪</div>
                  <span class="text-sm text-gray-600">Instalaciones modernas</span>
                </div>
              </div>

              <p class="mb-3">Equipos de última generación y entrenadores profesionales certificados.</p>

              <div slot="footer" class="flex justify-between items-center w-full">
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

              <div slot="media" class="h-48 bg-gradient-to-br from-sky-blue-100 to-sky-blue-200 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">📚</div>
                  <span class="text-sm text-gray-600">Gran variedad de libros</span>
                </div>
              </div>

              <p class="mb-3">Amplio catálogo de libros, material escolar y artículos de oficina.</p>

              <div slot="footer" class="flex justify-between items-center w-full">
                <app-button variant="outline" size="sm">Catálogo</app-button>
                <app-badge variant="secondary" size="xs">Nuevo</app-badge>
              </div>
            </app-card>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Card con Formulario</h2>
          <div class="max-w-lg mx-auto">

            <app-card
              variant="elevated"
              title="Contacto Rápido"
              subtitle="Envía tu consulta"
              [hasFooter]="true"
              padding="lg">

              <form (ngSubmit)="submitContactForm()" class="space-y-4">
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

              <div slot="footer" class="flex justify-between items-center w-full">
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
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Directory Interactivo</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (business of businesses; track business.name) {
              <app-card
                variant="interactive"
                [title]="business.name"
                [subtitle]="business.category"
                [clickable]="true"
                [hasFooter]="true"
                size="sm"
                (cardClick)="selectBusiness(business)">

                <p class="text-sm mb-2">{{ business.description }}</p>
                <div class="flex flex-wrap gap-1 mb-3">
                  @for (tag of business.tags; track tag) {
                    <app-badge
                      variant="secondary"
                      size="xs">
                      {{ tag }}
                    </app-badge>
                  }
                </div>

                <div slot="footer" class="flex justify-between items-center w-full">
                  <span class="text-xs text-gray-500">{{ business.location }}</span>
                  <app-badge
                    [variant]="business.status === 'open' ? 'success' : 'error'"
                    size="xs"
                    [dot]="true">
                    {{ business.status === 'open' ? 'Abierto' : 'Cerrado' }}
                  </app-badge>
                </div>
              </app-card>
            }
          </div>
        </div>

        <!-- Feedback -->
        @if (selectedBusiness) {
          <div class="fixed bottom-4 right-4 max-w-sm">
            <app-card
              variant="gradient"
              [hasHeader]="true"
              [hasFooter]="true">

            <div slot="header" class="flex justify-between items-center w-full">
              <span class="font-semibold text-emerald-green-700">Seleccionado</span>
              <button
                (click)="selectedBusiness = null"
                class="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <h4 class="font-semibold mb-1">{{ selectedBusiness.name }}</h4>
            <p class="text-sm text-gray-600">{{ selectedBusiness.category }}</p>

            <div slot="footer" class="flex space-x-2 w-full">
              <app-button variant="primary" size="sm">Contactar</app-button>
              <app-button variant="outline" size="sm">Ver Perfil</app-button>
            </div>
          </app-card>
          </div>
        }
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
