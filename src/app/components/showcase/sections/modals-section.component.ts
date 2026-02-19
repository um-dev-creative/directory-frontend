import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../ui/modals/modal';
import { Button } from '../../ui/buttons/button';
import { InputComponent } from '../../ui/inputs/input';
import { BadgeComponent } from '../../ui/badges/badge';

@Component({
  selector: 'app-modals-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, Button, InputComponent, BadgeComponent],
  template: `
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Modal/Dialog Components</h2>
      <p class="text-beige-700 mb-6">
        Componentes Modal versátiles para formularios, confirmaciones y detalles. Incluye variantes, tamaños y slots para header/content/footer.
      </p>

      <!-- Modal Variants -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Variantes de Modal</h3>
        <div class="flex gap-4 flex-wrap">
          <app-button variant="primary" (buttonClick)="openCentered()">
            Modal Centrado
          </app-button>
          <app-button variant="secondary" (buttonClick)="openWide()">
            Modal Ancho
          </app-button>
          <app-button variant="info" (buttonClick)="openDrawer()">
            Drawer Lateral
          </app-button>
          <app-button variant="outline" (buttonClick)="openFullscreen()">
            Fullscreen
          </app-button>
        </div>
      </div>

      <!-- Modal Sizes -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
        <div class="flex gap-4 flex-wrap">
          <app-button size="sm" variant="outline" (buttonClick)="openSize('xs')">XS</app-button>
          <app-button size="sm" variant="outline" (buttonClick)="openSize('sm')">SM</app-button>
          <app-button size="sm" variant="outline" (buttonClick)="openSize('md')">MD</app-button>
          <app-button size="sm" variant="outline" (buttonClick)="openSize('lg')">LG</app-button>
          <app-button size="sm" variant="outline" (buttonClick)="openSize('xl')">XL</app-button>
        </div>
      </div>

      <!-- Casos de Uso Reales -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Casos de Uso Reales</h3>
        <div class="flex gap-4 flex-wrap">
          <app-button variant="success" (buttonClick)="openContactForm()">
            Formulario de Contacto
          </app-button>
          <app-button variant="alert" (buttonClick)="openConfirmation()">
            Confirmación
          </app-button>
          <app-button variant="info" (buttonClick)="openDetails()">
            Detalles de Empresa
          </app-button>
        </div>
      </div>

      <!-- Modal Centrado -->
      <app-modal
        [(open)]="centeredOpen"
        size="md"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
        ariaLabel="Modal centrado de ejemplo"
      >
        <div slot="header">
          <h3 class="text-lg font-semibold text-emerald-green-700">Modal Centrado</h3>
          <p class="text-sm text-beige-600">Ejemplo de modal tradicional</p>
        </div>
        <div slot="content">
          <p class="mb-4 text-beige-700">
            Este es un modal centrado clásico. Perfecto para formularios rápidos o confirmaciones.
          </p>
          <app-input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            [(ngModel)]="modalData.name"
          ></app-input>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="centeredOpen = false">
            Cancelar
          </app-button>
          <app-button variant="primary" (buttonClick)="saveData('centered')">
            Guardar
          </app-button>
        </div>
      </app-modal>

      <!-- Modal Ancho -->
      <app-modal
        [(open)]="wideOpen"
        size="xl"
        variant="wide"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="text-lg font-semibold text-coral-700">Modal Ancho</h3>
          <app-badge variant="info" size="sm">Responsive</app-badge>
        </div>
        <div slot="content">
          <p class="mb-4 text-beige-700">
            Ideal para mostrar tablas, formularios extensos o contenido que necesita más espacio horizontal.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-input label="Campo 1" [(ngModel)]="modalData.field1"></app-input>
            <app-input label="Campo 2" [(ngModel)]="modalData.field2"></app-input>
            <app-input label="Campo 3" [(ngModel)]="modalData.field3"></app-input>
            <app-input label="Campo 4" [(ngModel)]="modalData.field4"></app-input>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="wideOpen = false">
            Cerrar
          </app-button>
          <app-button variant="primary" (buttonClick)="saveData('wide')">
            Guardar Todo
          </app-button>
        </div>
      </app-modal>

      <!-- Drawer Lateral -->
      <app-modal
        [(open)]="drawerOpen"
        size="lg"
        variant="drawer"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="text-lg font-semibold text-sky-blue-700">Filtros Avanzados</h3>
          <app-badge variant="secondary" size="sm">Drawer</app-badge>
        </div>
        <div slot="content">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-beige-800 mb-2">Categoría</h4>
              <app-input label="Buscar categoría" [(ngModel)]="modalData.category"></app-input>
            </div>
            <div>
              <h4 class="font-medium text-beige-800 mb-2">Ubicación</h4>
              <app-input label="Ciudad o región" [(ngModel)]="modalData.location"></app-input>
            </div>
            <div>
              <h4 class="font-medium text-beige-800 mb-2">Precio</h4>
              <div class="grid grid-cols-2 gap-2">
                <app-input label="Mín" type="number" [(ngModel)]="modalData.priceMin"></app-input>
                <app-input label="Máx" type="number" [(ngModel)]="modalData.priceMax"></app-input>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="clearFilters()">
            Limpiar
          </app-button>
          <app-button variant="primary" (buttonClick)="applyFilters()">
            Aplicar Filtros
          </app-button>
        </div>
      </app-modal>

      <!-- Modal Fullscreen -->
      <app-modal
        [(open)]="fullscreenOpen"
        size="full"
        variant="fullscreen"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="text-xl font-bold text-emerald-green-700">Experiencia Fullscreen</h3>
          <app-badge variant="primary">Inmersivo</app-badge>
        </div>
        <div slot="content">
          <div class="max-w-6xl mx-auto space-y-8">
            <!-- Header Introduction -->
            <div class="text-center max-w-3xl mx-auto">
              <p class="text-xl text-beige-700 leading-relaxed mb-2">
                El modal fullscreen es ideal para experiencias inmersivas, formularios muy largos,
                o cuando necesitas mostrar mucho contenido sin distracciones.
              </p>
              <p class="text-sm text-beige-600">
                Complete todos los campos requeridos para continuar con el proceso.
              </p>
            </div>

            <!-- Progress Indicator -->
            <div class="flex justify-center mb-8">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-emerald-green-500 flex items-center justify-center">
                    <span class="text-white text-sm font-medium">1</span>
                  </div>
                  <span class="text-sm font-medium text-emerald-green-600">Información Personal</span>
                </div>
                <div class="w-8 h-0.5 bg-beige-300"></div>
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-emerald-green-500 flex items-center justify-center">
                    <span class="text-white text-sm font-medium">2</span>
                  </div>
                  <span class="text-sm font-medium text-emerald-green-600">Información Empresarial</span>
                </div>
                <div class="w-8 h-0.5 bg-beige-300"></div>
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-beige-300 flex items-center justify-center">
                    <span class="text-beige-600 text-sm font-medium">3</span>
                  </div>
                  <span class="text-sm font-medium text-beige-600">Preferencias</span>
                </div>
              </div>
            </div>

            <!-- Main Form Content -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Información Personal -->
              <div class="bg-white rounded-lg p-6 shadow-sm border border-beige-200">
                <div class="flex items-center space-x-3 mb-6">
                  <div class="w-10 h-10 rounded-full bg-emerald-green-100 flex items-center justify-center">
                    <span class="text-emerald-green-600 text-lg">👤</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-beige-800 text-lg">Información Personal</h4>
                    <p class="text-sm text-beige-600">Datos básicos de contacto</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <app-input
                    label="Nombre completo"
                    placeholder="Ej: Juan Pérez García"
                    [required]="true"
                    [(ngModel)]="modalData.fullName"
                    style="border: none; padding: 0; background: transparent;">
                  </app-input>
                  <app-input
                    label="Email"
                    type="email"
                    placeholder="juan.perez@email.com"
                    [required]="true"
                    [(ngModel)]="modalData.email"
                    style="border: none; padding: 0; background: transparent;">
                  </app-input>
                  <app-input
                    label="Teléfono"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    [(ngModel)]="modalData.phone"
                    style="border: none; padding: 0; background: transparent;">
                  </app-input>
                  <app-input
                    label="Fecha de nacimiento"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    [(ngModel)]="modalData.birthDate"
                    style="border: none; padding: 0; background: transparent;">
                  </app-input>
                </div>
              </div>

              <!-- Información Empresarial -->
              <div class="bg-white rounded-lg p-6 shadow-sm border border-beige-200">
                <div class="flex items-center space-x-3 mb-6">
                  <div class="w-10 h-10 rounded-full bg-sky-blue-100 flex items-center justify-center">
                    <span class="text-sky-blue-600 text-lg">🏢</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-beige-800 text-lg">Información Empresarial</h4>
                    <p class="text-sm text-beige-600">Detalles de su empresa</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <app-input
                    label="Nombre de empresa"
                    placeholder="Ej: Innovación S.A."
                    [required]="true"
                    [(ngModel)]="modalData.company">
                  </app-input>
                  <app-input
                    label="Cargo"
                    placeholder="Ej: Director de Marketing"
                    [(ngModel)]="modalData.position">
                  </app-input>
                  <app-input
                    label="Sitio web"
                    placeholder="https://miempresa.com"
                    [(ngModel)]="modalData.website">
                  </app-input>
                  <app-input
                    label="Tamaño de empresa"
                    placeholder="Ej: 50-100 empleados"
                    [(ngModel)]="modalData.companySize">
                  </app-input>
                </div>
              </div>
            </div>

            <!-- Sección de Dirección -->
            <div class="bg-white rounded-lg p-6 shadow-sm border border-beige-200">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center">
                  <span class="text-coral-600 text-lg">📍</span>
                </div>
                <div>
                  <h4 class="font-semibold text-beige-800 text-lg">Dirección</h4>
                  <p class="text-sm text-beige-600">Información de ubicación</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <app-input
                  label="País"
                  placeholder="Ej: México"
                  [(ngModel)]="modalData.country">
                </app-input>
                <app-input
                  label="Estado/Provincia"
                  placeholder="Ej: CDMX"
                  [(ngModel)]="modalData.state">
                </app-input>
                <app-input
                  label="Ciudad"
                  placeholder="Ej: Ciudad de México"
                  [(ngModel)]="modalData.city">
                </app-input>
                <div class="md:col-span-2">
                  <app-input
                    label="Dirección completa"
                    placeholder="Ej: Av. Reforma 123, Col. Centro"
                    [(ngModel)]="modalData.address">
                  </app-input>
                </div>
                <app-input
                  label="Código Postal"
                  placeholder="12345"
                  [(ngModel)]="modalData.zipCode">
                </app-input>
              </div>
            </div>

            <!-- Sección de Preferencias -->
            <div class="bg-white rounded-lg p-6 shadow-sm border border-beige-200">
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 text-lg">⚙️</span>
                </div>
                <div>
                  <h4 class="font-semibold text-beige-800 text-lg">Preferencias y Notas</h4>
                  <p class="text-sm text-beige-600">Información adicional opcional</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <app-input
                  label="Industria"
                  placeholder="Ej: Tecnología, Salud, Educación"
                  [(ngModel)]="modalData.industry">
                </app-input>
                <app-input
                  label="Presupuesto aproximado"
                  placeholder="Ej: $10,000 - $50,000"
                  [(ngModel)]="modalData.budget">
                </app-input>
                <div class="md:col-span-2">
                  <app-input
                    label="Comentarios adicionales"
                    placeholder="Comparta cualquier información adicional que considere importante..."
                    [(ngModel)]="modalData.comments">
                  </app-input>
                </div>
              </div>
            </div>

            <!-- Summary Stats -->
            <div class="bg-gradient-to-r from-emerald-green-50 to-sky-blue-50 rounded-lg p-6 border border-emerald-green-200">
              <div class="text-center">
                <h5 class="font-semibold text-beige-800 mb-4">Resumen del Formulario</h5>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-emerald-green-600">12</div>
                    <div class="text-sm text-beige-600">Campos Totales</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-sky-blue-600">3</div>
                    <div class="text-sm text-beige-600">Requeridos</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-coral-600">4</div>
                    <div class="text-sm text-beige-600">Secciones</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">~5min</div>
                    <div class="text-sm text-beige-600">Tiempo Est.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="fullscreenOpen = false">
            Cancelar
          </app-button>
          <app-button variant="primary" (buttonClick)="saveData('fullscreen')">
            Guardar Información
          </app-button>
        </div>
      </app-modal>

      <!-- Modal de Tamaño Variable -->
      <app-modal
        [(open)]="sizeModalOpen"
        [size]="currentSize"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="text-lg font-semibold text-emerald-green-700">Modal {{ currentSize.toUpperCase() }}</h3>
        </div>
        <div slot="content">
          <p class="text-beige-700">
            Este modal está configurado en tamaño <strong>{{ currentSize }}</strong>.
            Cada tamaño se adapta perfectamente a diferentes tipos de contenido.
          </p>
        </div>
        <div slot="footer">
          <app-button variant="primary" (buttonClick)="sizeModalOpen = false">
            Cerrar
          </app-button>
        </div>
      </app-modal>

      <!-- Formulario de Contacto -->
      <app-modal
        [(open)]="contactFormOpen"
        size="md"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
        [loading]="contactLoading"
      >
        <div slot="header">
          <h3 class="text-lg font-semibold text-emerald-green-700">Contactar Empresa</h3>
          <app-badge variant="success" size="sm">Verificado</app-badge>
        </div>
        <div slot="content">
          <div class="space-y-4">
            <app-input
              label="Tu nombre"
              [required]="true"
              [(ngModel)]="contactForm.name"
            ></app-input>
            <app-input
              label="Tu email"
              type="email"
              [required]="true"
              [(ngModel)]="contactForm.email"
            ></app-input>
            <app-input
              label="Asunto"
              [(ngModel)]="contactForm.subject"
            ></app-input>
            <app-input
              label="Mensaje"
              [(ngModel)]="contactForm.message"
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

      <!-- Modal de Confirmación -->
      <app-modal
        [(open)]="confirmationOpen"
        size="sm"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <h3 class="text-lg font-semibold text-coral-700">¿Confirmar acción?</h3>
        </div>
        <div slot="content">
          <p class="text-beige-700">
            Esta acción no se puede deshacer. ¿Estás seguro de que quieres continuar?
          </p>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="confirmationOpen = false">
            Cancelar
          </app-button>
          <app-button variant="alert" (buttonClick)="confirmAction()">
            Confirmar
          </app-button>
        </div>
      </app-modal>

      <!-- Modal de Detalles -->
      <app-modal
        [(open)]="detailsOpen"
        size="lg"
        variant="centered"
        [hasHeader]="true"
        [hasFooter]="true"
      >
        <div slot="header">
          <div>
            <h3 class="text-lg font-semibold text-sky-blue-700">Restaurante El Buen Sabor</h3>
            <div class="flex gap-2 mt-2">
              <app-badge variant="success" size="sm">Verificado</app-badge>
              <app-badge variant="info" size="sm">Premium</app-badge>
              <app-badge variant="secondary" size="sm">Restaurante</app-badge>
            </div>
          </div>
        </div>
        <div slot="content">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium text-beige-800 mb-2">Información de Contacto</h4>
                <p class="text-sm text-beige-600">📍 Av. Principal 123, Centro</p>
                <p class="text-sm text-beige-600">📞 +1 234-567-8900</p>
                <p class="text-sm text-beige-600">✉️ info&#64;elbuensabor.com</p>
              </div>
              <div>
                <h4 class="font-medium text-beige-800 mb-2">Horarios</h4>
                <p class="text-sm text-beige-600">Lun - Vie: 9:00 AM - 10:00 PM</p>
                <p class="text-sm text-beige-600">Sáb - Dom: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-beige-800 mb-2">Descripción</h4>
              <p class="text-sm text-beige-600">
                Restaurante familiar especializado en comida tradicional con más de 20 años de experiencia.
                Ofrecemos un ambiente acogedor y platillos preparados con ingredientes frescos y locales.
              </p>
            </div>
          </div>
        </div>
        <div slot="footer">
          <app-button variant="outline" (buttonClick)="detailsOpen = false">
            Cerrar
          </app-button>
          <app-button variant="primary" (buttonClick)="openContactFromDetails()">
            Contactar
          </app-button>
        </div>
      </app-modal>
    </section>
  `
})
export class ModalsSectionComponent {
  // Estados de modals
  centeredOpen = false;
  wideOpen = false;
  drawerOpen = false;
  fullscreenOpen = false;
  sizeModalOpen = false;
  contactFormOpen = false;
  confirmationOpen = false;
  detailsOpen = false;
  contactLoading = false;

  currentSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  // Datos del modal
  modalData = {
    name: '',
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    website: '',
    birthDate: '',
    companySize: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    industry: '',
    budget: '',
    comments: ''
  };

  // Formulario de contacto
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // Métodos para abrir modals
  openCentered() { this.centeredOpen = true; }
  openWide() { this.wideOpen = true; }
  openDrawer() { this.drawerOpen = true; }
  openFullscreen() { this.fullscreenOpen = true; }
  openContactForm() { this.contactFormOpen = true; }
  openConfirmation() { this.confirmationOpen = true; }
  openDetails() { this.detailsOpen = true; }

  openSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
    this.currentSize = size;
    this.sizeModalOpen = true;
  }

  // Métodos de acción
  saveData(modalType: string) {
    console.log(`Guardando datos del modal ${modalType}:`, this.modalData);
    // Aquí integrarías con tu NotificationService
    // this.notificationService.success(`Datos del modal ${modalType} guardados exitosamente!`);

    // Cerrar el modal correspondiente
    switch(modalType) {
      case 'centered': this.centeredOpen = false; break;
      case 'wide': this.wideOpen = false; break;
      case 'fullscreen': this.fullscreenOpen = false; break;
    }
  }

  clearFilters() {
    this.modalData.category = '';
    this.modalData.location = '';
    this.modalData.priceMin = '';
    this.modalData.priceMax = '';
    console.log('Filtros limpiados');
  }

  applyFilters() {
    console.log('Aplicando filtros:', {
      category: this.modalData.category,
      location: this.modalData.location,
      priceMin: this.modalData.priceMin,
      priceMax: this.modalData.priceMax
    });
    this.drawerOpen = false;
  }

  sendContact() {
    this.contactLoading = true;

    // Simular envío
    setTimeout(() => {
      console.log('Enviando contacto:', this.contactForm);
      this.contactLoading = false;
      this.contactFormOpen = false;

      // Limpiar formulario
      this.contactForm = { name: '', email: '', subject: '', message: '' };
    }, 2000);
  }

  confirmAction() {
    console.log('Acción confirmada');
    this.confirmationOpen = false;
  }

  openContactFromDetails() {
    this.detailsOpen = false;
    setTimeout(() => {
      this.contactForm.subject = 'Consulta sobre Restaurante El Buen Sabor';
      this.contactFormOpen = true;
    }, 300);
  }
}
