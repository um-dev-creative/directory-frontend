import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button, ModalComponent, InputComponent, BadgeComponent, CardComponent } from '@app/components/ui';

@Component({
  selector: 'app-modal-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, Button, InputComponent, BadgeComponent, CardComponent],
  template: `
    <div class="tw-p-8 tw-space-y-8">
      <h1 class="tw-text-3xl tw-font-bold tw-text-emerald-green-700">
        Modal Component - Ejemplos de Uso
      </h1>

      <!-- Botones de ejemplo -->
      <div class="tw-space-y-4">
        <h2 class="tw-text-xl tw-font-semibold tw-text-beige-800">Casos de Uso para Directory</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
          <app-card variant="interactive" [clickable]="true" (cardClick)="openBusinessDetails()">
            <h3 class="tw-font-semibold tw-text-emerald-green-700">Ver Detalles de Negocio</h3>
            <p class="tw-text-sm tw-text-beige-600">Modal con información completa de la empresa</p>
          </app-card>

          <app-card variant="interactive" [clickable]="true" (cardClick)="openContactForm()">
            <h3 class="tw-font-semibold tw-text-sky-blue-700">Formulario de Contacto</h3>
            <p class="tw-text-sm tw-text-beige-600">Modal para contactar empresas</p>
          </app-card>

          <app-card variant="interactive" [clickable]="true" (cardClick)="openAdvancedFilters()">
            <h3 class="tw-font-semibold tw-text-coral-700">Filtros Avanzados</h3>
            <p class="tw-text-sm tw-text-beige-600">Drawer lateral con opciones de filtrado</p>
          </app-card>

          <app-card variant="interactive" [clickable]="true" (cardClick)="openAddBusiness()">
            <h3 class="tw-font-semibold tw-text-emerald-green-700">Agregar Negocio</h3>
            <p class="tw-text-sm tw-text-beige-600">Formulario fullscreen para registrar empresa</p>
          </app-card>

          <app-card variant="interactive" [clickable]="true" (cardClick)="openImageGallery()">
            <h3 class="tw-font-semibold tw-text-sky-blue-700">Galería de Imágenes</h3>
            <p class="tw-text-sm tw-text-beige-600">Modal wide para mostrar fotos de negocios</p>
          </app-card>

          <app-card variant="interactive" [clickable]="true" (cardClick)="openDeleteConfirmation()">
            <h3 class="tw-font-semibold tw-text-coral-700">Confirmaciones</h3>
            <p class="tw-text-sm tw-text-beige-600">Modal pequeño para confirmaciones</p>
          </app-card>
        </div>
      </div>

      <!-- Modal de Detalles de Negocio -->
      <app-modal
        [(open)]="businessDetailsOpen"
        size="lg"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <div>
            <h3 class="tw-text-xl tw-font-bold tw-text-emerald-green-700">Restaurante La Tradición</h3>
            <div class="tw-flex tw-gap-2 tw-mt-2">
              <app-badge variant="success" size="sm">Verificado</app-badge>
              <app-badge variant="info" size="sm">Premium</app-badge>
              <app-badge variant="secondary" size="sm">Restaurante</app-badge>
            </div>
          </div>
        </div>
        <div slot="content">
          <div class="tw-space-y-6">
            <!-- Información básica -->
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
              <div>
                <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">📍 Ubicación</h4>
                <p class="tw-text-beige-600">Av. Libertador 456, Centro Histórico</p>
                <p class="tw-text-beige-600">Caracas, Venezuela</p>
              </div>
              <div>
                <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">📞 Contacto</h4>
                <p class="tw-text-beige-600">+58 212-555-0123</p>
                <p class="tw-text-beige-600">info&#64;latradicion.com</p>
              </div>
            </div>

            <!-- Horarios -->
            <div>
              <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">🕒 Horarios de Atención</h4>
              <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-text-sm">
                <p class="tw-text-beige-600">Lunes - Viernes: 11:00 AM - 10:00 PM</p>
                <p class="tw-text-beige-600">Sábados: 12:00 PM - 11:00 PM</p>
                <p class="tw-text-beige-600">Domingos: 12:00 PM - 9:00 PM</p>
                <p class="tw-text-emerald-green-600 tw-font-medium">Abierto ahora</p>
              </div>
            </div>

            <!-- Descripción -->
            <div>
              <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">📝 Descripción</h4>
              <p class="tw-text-beige-600 tw-leading-relaxed">
                Restaurante familiar especializado en comida criolla venezolana con más de 25 años de tradición.
                Ofrecemos platos típicos preparados con recetas familiares y ingredientes frescos de la región.
                Ambiente acogedor perfecto para reuniones familiares y celebraciones especiales.
              </p>
            </div>

            <!-- Especialidades -->
            <div>
              <h4 class="tw-font-semibold tw-text-beige-800 tw-mb-3">⭐ Especialidades</h4>
              <div class="tw-flex tw-flex-wrap tw-gap-2">
                <app-badge variant="secondary" size="sm">Pabellón Criollo</app-badge>
                <app-badge variant="secondary" size="sm">Asado Negro</app-badge>
                <app-badge variant="secondary" size="sm">Hallacas</app-badge>
                <app-badge variant="secondary" size="sm">Quesillo</app-badge>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="businessDetailsOpen = false">
            Cerrar
          </app-button>
          <app-button variant="info" (buttonClick)="openDirections()">
            Como Llegar
          </app-button>
          <app-button variant="primary" (buttonClick)="openContactFromBusiness()">
            Contactar
          </app-button>
        </div>
      </app-modal>

      <!-- Modal de Formulario de Contacto -->
      <app-modal
        [(open)]="contactFormOpen"
        size="md"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
        [loading]="contactLoading"
      >
        <div slot="header">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700">Contactar Restaurante La Tradición</h3>
        </div>
        <div slot="content">
          <div class="tw-space-y-4">
            <app-input
              label="Tu nombre"
              [required]="true"
              [(ngModel)]="contactForm.name"
              placeholder="Ingresa tu nombre completo"
            ></app-input>

            <app-input
              label="Tu email"
              type="email"
              [required]="true"
              [(ngModel)]="contactForm.email"
              placeholder="tu&#64;email.com"
            ></app-input>

            <app-input
              label="Teléfono"
              type="tel"
              [(ngModel)]="contactForm.phone"
              placeholder="+58 412-555-0123"
            ></app-input>

            <app-input
              label="Asunto"
              [(ngModel)]="contactForm.subject"
              placeholder="Reservación, consulta, etc."
            ></app-input>

            <app-input
              label="Mensaje"
              [(ngModel)]="contactForm.message"
              placeholder="Describe tu consulta o solicitud..."
            ></app-input>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="contactFormOpen = false">
            Cancelar
          </app-button>
          <app-button
            variant="primary"
            [loading]="contactLoading"
            (buttonClick)="sendContact()"
          >
            Enviar Mensaje
          </app-button>
        </div>
      </app-modal>

      <!-- Drawer de Filtros Avanzados -->
      <app-modal
        [(open)]="filtersOpen"
        size="lg"
        variant="drawer"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="tw-text-lg tw-font-semibold tw-text-sky-blue-700">Filtros Avanzados</h3>
        </div>
        <div slot="content">
          <div class="tw-space-y-6">
            <!-- Categoría -->
            <div>
              <h4 class="tw-font-medium tw-text-beige-800 tw-mb-3">🏷️ Categoría</h4>
              <div class="tw-space-y-2">
                <app-input label="Buscar categoría" [(ngModel)]="filters.categorySearch"></app-input>
                <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mt-2">
                  @for (cat of popularCategories; track cat) {
                    <app-badge
                      variant="secondary"
                      size="sm"
                      style="tw-cursor-pointer"
                      (click)="selectCategory(cat)"
                    >
                      {{ cat }}
                    </app-badge>
                  }
                </div>
              </div>
            </div>

            <!-- Ubicación -->
            <div>
              <h4 class="tw-font-medium tw-text-beige-800 tw-mb-3">📍 Ubicación</h4>
              <app-input
                label="Ciudad o región"
                [(ngModel)]="filters.location"
                placeholder="Caracas, Maracaibo, Valencia..."
              ></app-input>
            </div>

            <!-- Horario -->
            <div>
              <h4 class="tw-font-medium tw-text-beige-800 tw-mb-3">🕒 Disponibilidad</h4>
              <div class="tw-grid tw-grid-cols-2 tw-gap-2">
                <app-input label="Abierto desde" type="time" [(ngModel)]="filters.openFrom"></app-input>
                <app-input label="Abierto hasta" type="time" [(ngModel)]="filters.openUntil"></app-input>
              </div>
            </div>

            <!-- Características -->
            <div>
              <h4 class="tw-font-medium tw-text-beige-800 tw-mb-3">✨ Características</h4>
              <div class="tw-flex tw-flex-wrap tw-gap-2">
                @for (feature of availableFeatures; track feature) {
                  <app-badge
                    [variant]="isFeatureSelected(feature) ? 'primary' : 'secondary'"
                    size="sm"
                    style="tw-cursor-pointer"
                    (click)="toggleFeature(feature)"
                  >
                    {{ feature }}
                  </app-badge>
                }
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="clearAllFilters()">
            Limpiar Todo
          </app-button>
          <app-button variant="primary" (buttonClick)="applyFilters()">
            Aplicar Filtros ({{ getFilterCount() }})
          </app-button>
        </div>
      </app-modal>

      <!-- Modal Fullscreen para Agregar Negocio -->
      <app-modal
        [(open)]="addBusinessOpen"
        size="full"
        variant="fullscreen"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="tw-text-xl tw-font-bold tw-text-emerald-green-700">Registrar Nuevo Negocio</h3>
          <app-badge variant="info">Formulario Completo</app-badge>
        </div>
        <div slot="content">
          <div class="tw-max-w-4xl tw-mx-auto tw-space-y-8">
            <!-- Información Básica -->
            <div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">1. Información Básica</h4>
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <app-input label="Nombre del negocio" [(ngModel)]="businessForm.name" [required]="true"></app-input>
                <app-input label="Categoría" [(ngModel)]="businessForm.category" [required]="true"></app-input>
                <app-input label="Teléfono principal" type="tel" [(ngModel)]="businessForm.phone"></app-input>
                <app-input label="Email" type="email" [(ngModel)]="businessForm.email"></app-input>
                <app-input label="Sitio web" [(ngModel)]="businessForm.website"></app-input>
                <app-input label="RIF/Documento" [(ngModel)]="businessForm.rif"></app-input>
              </div>
            </div>

            <!-- Ubicación -->
            <div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">2. Ubicación</h4>
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <app-input label="Dirección completa" [(ngModel)]="businessForm.address" [required]="true"></app-input>
                <app-input label="Ciudad" [(ngModel)]="businessForm.city" [required]="true"></app-input>
                <app-input label="Estado/Región" [(ngModel)]="businessForm.state"></app-input>
                <app-input label="Código postal" [(ngModel)]="businessForm.zipCode"></app-input>
              </div>
            </div>

            <!-- Descripción y Servicios -->
            <div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">3. Descripción y Servicios</h4>
              <div class="tw-space-y-4">
                <app-input
                  label="Descripción del negocio"
                  [(ngModel)]="businessForm.description"
                  placeholder="Describe tu negocio, servicios principales, años de experiencia..."
                ></app-input>
                <app-input
                  label="Servicios principales"
                  [(ngModel)]="businessForm.services"
                  placeholder="Servicio 1, Servicio 2, Servicio 3..."
                ></app-input>
              </div>
            </div>

            <!-- Horarios -->
            <div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">4. Horarios de Atención</h4>
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
                <app-input label="Lunes - Viernes" [(ngModel)]="businessForm.weekdayHours"></app-input>
                <app-input label="Sábados" [(ngModel)]="businessForm.saturdayHours"></app-input>
                <app-input label="Domingos" [(ngModel)]="businessForm.sundayHours"></app-input>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="addBusinessOpen = false">
            Cancelar
          </app-button>
          <app-button variant="secondary" (buttonClick)="saveDraft()">
            Guardar Borrador
          </app-button>
          <app-button variant="primary" (buttonClick)="submitBusiness()">
            Enviar para Revisión
          </app-button>
        </div>
      </app-modal>

      <!-- Modal Wide para Galería -->
      <app-modal
        [(open)]="galleryOpen"
        size="xl"
        variant="wide"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="tw-text-lg tw-font-semibold tw-text-sky-blue-700">Galería - Restaurante La Tradición</h3>
        </div>
        <div slot="content">
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
            @for (image of galleryImages; track image) {
              <div class="tw-aspect-square tw-bg-beige-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                <span class="tw-text-beige-500">{{ image }}</span>
              </div>
            }
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="galleryOpen = false">
            Cerrar
          </app-button>
          <app-button variant="primary" (buttonClick)="downloadImages()">
            Descargar Todas
          </app-button>
        </div>
      </app-modal>

      <!-- Modal de Confirmación -->
      <app-modal
        [(open)]="deleteConfirmOpen"
        size="sm"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="tw-text-lg tw-font-semibold tw-text-coral-700">¿Eliminar negocio?</h3>
        </div>
        <div slot="content">
          <p class="tw-text-beige-700">
            Esta acción eliminará permanentemente el negocio <strong>"Restaurante La Tradición"</strong>
            de la plataforma. Esta acción no se puede deshacer.
          </p>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="deleteConfirmOpen = false">
            Cancelar
          </app-button>
          <app-button variant="alert" (buttonClick)="confirmDelete()">
            Eliminar Permanentemente
          </app-button>
        </div>
      </app-modal>
    </div>
  `
})
export class ModalExamplesComponent {
  // Estados de modals
  businessDetailsOpen = false;
  contactFormOpen = false;
  filtersOpen = false;
  addBusinessOpen = false;
  galleryOpen = false;
  deleteConfirmOpen = false;
  contactLoading = false;

  // Formulario de contacto
  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  // Filtros
  filters = {
    categorySearch: '',
    location: '',
    openFrom: '',
    openUntil: '',
    selectedFeatures: [] as string[]
  };

  popularCategories = ['Restaurantes', 'Tecnología', 'Salud', 'Educación', 'Turismo'];
  availableFeatures = ['Verificado', 'Delivery', 'Estacionamiento', 'WiFi', 'Tarjetas', 'Pet Friendly'];

  // Formulario de negocio
  businessForm = {
    name: '',
    category: '',
    phone: '',
    email: '',
    website: '',
    rif: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    services: '',
    weekdayHours: '',
    saturdayHours: '',
    sundayHours: ''
  };

  galleryImages = [
    'Fachada Principal',
    'Interior del Restaurante',
    'Cocina',
    'Pabellón Criollo',
    'Asado Negro',
    'Ambiente Familiar'
  ];

  // Métodos para abrir modals
  openBusinessDetails() { this.businessDetailsOpen = true; }
  openContactForm() { this.contactFormOpen = true; }
  openAdvancedFilters() { this.filtersOpen = true; }
  openAddBusiness() { this.addBusinessOpen = true; }
  openImageGallery() { this.galleryOpen = true; }
  openDeleteConfirmation() { this.deleteConfirmOpen = true; }

  // Métodos de filtros
  selectCategory(category: string) {
    this.filters.categorySearch = category;
  }

  isFeatureSelected(feature: string): boolean {
    return this.filters.selectedFeatures.includes(feature);
  }

  toggleFeature(feature: string) {
    const index = this.filters.selectedFeatures.indexOf(feature);
    if (index > -1) {
      this.filters.selectedFeatures.splice(index, 1);
    } else {
      this.filters.selectedFeatures.push(feature);
    }
  }

  getFilterCount(): number {
    let count = 0;
    if (this.filters.categorySearch) count++;
    if (this.filters.location) count++;
    if (this.filters.openFrom || this.filters.openUntil) count++;
    count += this.filters.selectedFeatures.length;
    return count;
  }

  clearAllFilters() {
    this.filters = {
      categorySearch: '',
      location: '',
      openFrom: '',
      openUntil: '',
      selectedFeatures: []
    };
  }

  applyFilters() {
    console.log('Aplicando filtros:', this.filters);
    this.filtersOpen = false;
  }

  // Métodos de contacto
  sendContact() {
    this.contactLoading = true;
    setTimeout(() => {
      console.log('Enviando contacto:', this.contactForm);
      this.contactLoading = false;
      this.contactFormOpen = false;
      this.contactForm = { name: '', email: '', phone: '', subject: '', message: '' };
    }, 2000);
  }

  openContactFromBusiness() {
    this.businessDetailsOpen = false;
    setTimeout(() => {
      this.contactForm.subject = 'Consulta sobre Restaurante La Tradición';
      this.contactFormOpen = true;
    }, 300);
  }

  // Métodos de negocio
  saveDraft() {
    console.log('Guardando borrador:', this.businessForm);
  }

  submitBusiness() {
    console.log('Enviando negocio para revisión:', this.businessForm);
    this.addBusinessOpen = false;
  }

  // Otros métodos
  openDirections() {
    console.log('Abriendo direcciones...');
  }

  downloadImages() {
    console.log('Descargando imágenes...');
  }

  confirmDelete() {
    console.log('Negocio eliminado');
    this.deleteConfirmOpen = false;
  }
}
