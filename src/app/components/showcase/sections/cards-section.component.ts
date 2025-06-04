import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../ui/buttons/button';

@Component({
  selector: 'app-cards-section',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Cards</h2>
      <p class="tw-text-beige-700 tw-mb-6">
        Diferentes estilos de tarjetas para mostrar contenido
      </p>

      <!-- Cards Básicas -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Cards Básicas</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
          <!-- Card Simple -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-p-6 tw-border tw-border-beige-200">
            <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Card Simple</h4>
            <p class="tw-text-beige-600 tw-mb-4">
              Esta es una tarjeta básica con contenido simple y un diseño limpio.
            </p>
            <app-button variant="primary" size="sm">
              Ver más
            </app-button>
          </div>

          <!-- Card con Imagen -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-overflow-hidden tw-border tw-border-beige-200">
            <div class="tw-bg-gradient-to-br tw-from-emerald-green-400 tw-to-emerald-green-600 tw-h-32"></div>
            <div class="tw-p-6">
              <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Card con Header</h4>
              <p class="tw-text-beige-600 tw-mb-4">
                Tarjeta con un header visual colorido usando los colores de marca.
              </p>
              <app-button variant="secondary" size="sm">
                Explorar
              </app-button>
            </div>
          </div>

          <!-- Card con Badge -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-p-6 tw-border tw-border-beige-200 tw-relative">
            <div class="tw-absolute tw-top-4 tw-right-4">
              <span class="tw-bg-success-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                Nuevo
              </span>
            </div>
            <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2 tw-pr-16">Card con Badge</h4>
            <p class="tw-text-beige-600 tw-mb-4">
              Tarjeta que incluye un badge para destacar información importante.
            </p>
            <app-button variant="success" size="sm">
              Descubrir
            </app-button>
          </div>
        </div>
      </div>

      <!-- Cards con Estados -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Cards con Estados</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
          <!-- Card de Éxito -->
          <div class="tw-bg-success-50 tw-rounded-lg tw-shadow-soft tw-p-6 tw-border-2 tw-border-success-200">
            <div class="tw-flex tw-items-center tw-mb-3">
              <div class="tw-w-8 tw-h-8 tw-bg-success-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3">
                <svg class="tw-w-4 tw-h-4 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-success-700">Operación Exitosa</h4>
            </div>
            <p class="tw-text-success-600 tw-mb-4">
              La operación se completó correctamente sin errores.
            </p>
            <app-button variant="success" size="sm" (buttonClick)="onSuccessCardAction()">
              Continuar
            </app-button>
          </div>

          <!-- Card de Error -->
          <div class="tw-bg-alert-50 tw-rounded-lg tw-shadow-soft tw-p-6 tw-border-2 tw-border-alert-200">
            <div class="tw-flex tw-items-center tw-mb-3">
              <div class="tw-w-8 tw-h-8 tw-bg-alert-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3">
                <svg class="tw-w-4 tw-h-4 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-alert-700">Error Detectado</h4>
            </div>
            <p class="tw-text-alert-600 tw-mb-4">
              Se encontró un problema que requiere atención.
            </p>
            <app-button variant="alert" size="sm" (buttonClick)="onErrorCardAction()">
              Resolver
            </app-button>
          </div>

          <!-- Card de Información -->
          <div class="tw-bg-sky-blue-50 tw-rounded-lg tw-shadow-soft tw-p-6 tw-border-2 tw-border-sky-blue-200">
            <div class="tw-flex tw-items-center tw-mb-3">
              <div class="tw-w-8 tw-h-8 tw-bg-sky-blue-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3">
                <svg class="tw-w-4 tw-h-4 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h4 class="tw-text-lg tw-font-semibold tw-text-sky-blue-700">Información</h4>
            </div>
            <p class="tw-text-sky-blue-600 tw-mb-4">
              Aquí tienes información importante para considerar.
            </p>
            <app-button variant="info" size="sm" (buttonClick)="onInfoCardAction()">
              Entendido
            </app-button>
          </div>
        </div>
      </div>

      <!-- Cards de Productos -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Cards de Productos</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-overflow-hidden tw-border tw-border-beige-200 tw-hover:tw-shadow-lg tw-transition-shadow">
            <div class="tw-bg-gradient-to-br tw-from-emerald-green-100 tw-to-emerald-green-200 tw-h-40 tw-flex tw-items-center tw-justify-center">
              <div class="tw-w-16 tw-h-16 tw-bg-emerald-green-500 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <svg class="tw-w-8 tw-h-8 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
            </div>
            <div class="tw-p-6">
              <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Plan Básico</h4>
              <p class="tw-text-beige-600 tw-mb-4">Perfecto para comenzar con las funcionalidades esenciales.</p>
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
                <span class="tw-text-2xl tw-font-bold tw-text-emerald-green-700">$19</span>
                <span class="tw-text-sm tw-text-beige-500">/mes</span>
              </div>
              <app-button variant="primary" size="sm" [fullWidth]="true">
                Seleccionar
              </app-button>
            </div>
          </div>

          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-overflow-hidden tw-border-2 tw-border-emerald-green-300 tw-relative">
            <div class="tw-absolute tw-top-4 tw-right-4">
              <span class="tw-bg-emerald-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                Popular
              </span>
            </div>
            <div class="tw-bg-gradient-to-br tw-from-emerald-green-200 tw-to-emerald-green-300 tw-h-40 tw-flex tw-items-center tw-justify-center">
              <div class="tw-w-16 tw-h-16 tw-bg-emerald-green-600 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <svg class="tw-w-8 tw-h-8 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="tw-p-6">
              <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Plan Pro</h4>
              <p class="tw-text-beige-600 tw-mb-4">Ideal para equipos que necesitan funciones avanzadas.</p>
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
                <span class="tw-text-2xl tw-font-bold tw-text-emerald-green-700">$49</span>
                <span class="tw-text-sm tw-text-beige-500">/mes</span>
              </div>
              <app-button variant="primary" size="sm" [fullWidth]="true">
                Seleccionar
              </app-button>
            </div>
          </div>

          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-overflow-hidden tw-border tw-border-beige-200">
            <div class="tw-bg-gradient-to-br tw-from-beige-100 tw-to-beige-200 tw-h-40 tw-flex tw-items-center tw-justify-center">
              <div class="tw-w-16 tw-h-16 tw-bg-beige-500 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <svg class="tw-w-8 tw-h-8 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm10 0H4V8h12V6zM8 5a1 1 0 112 0v1H8V5z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="tw-p-6">
              <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-2">Plan Enterprise</h4>
              <p class="tw-text-beige-600 tw-mb-4">Solución completa para organizaciones grandes.</p>
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
                <span class="tw-text-2xl tw-font-bold tw-text-emerald-green-700">$99</span>
                <span class="tw-text-sm tw-text-beige-500">/mes</span>
              </div>
              <app-button variant="secondary" size="sm" [fullWidth]="true">
                Contactar
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card con Formulario -->
      <div class="tw-mb-8">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Card con Formulario</h3>
        <div class="tw-max-w-md tw-mx-auto">
          <div class="tw-bg-white tw-rounded-lg tw-shadow-soft tw-p-6 tw-border tw-border-beige-200">
            <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4 tw-text-center">Contacto</h4>
            <div class="tw-space-y-4">
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-700 tw-mb-1">Nombre</label>
                <input
                  type="text"
                  class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-beige-300 tw-rounded-md tw-text-sm focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-700 tw-mb-1">Email</label>
                <input
                  type="email"
                  class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-beige-300 tw-rounded-md tw-text-sm focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-700 tw-mb-1">Mensaje</label>
                <textarea
                  rows="3"
                  class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-beige-300 tw-rounded-md tw-text-sm focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-border-emerald-green-500 tw-resize-none"
                  placeholder="Tu mensaje..."
                ></textarea>
              </div>
              <app-button variant="primary" size="sm" [fullWidth]="true" (buttonClick)="onFormSubmit()">
                Enviar Mensaje
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Legacy Cards (for comparison) -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700 tw-mb-6">Cards Legacy (Comparación)</h2>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">
          <div class="tw-bg-gradient-primary tw-p-6 tw-rounded-xl tw-text-white">
            <h3 class="tw-text-xl tw-font-bold tw-mb-2">Card Primaria</h3>
            <p class="tw-opacity-90">Con gradiente emerald green</p>
          </div>
          <div class="tw-bg-gradient-warm tw-p-6 tw-rounded-xl">
            <h3 class="tw-text-xl tw-font-bold tw-mb-2 tw-text-beige-800">Card Cálida</h3>
            <p class="tw-text-beige-700">Con gradiente beige y coral</p>
          </div>
          <div class="tw-bg-gradient-sky tw-p-6 tw-rounded-xl">
            <h3 class="tw-text-xl tw-font-bold tw-mb-2 tw-text-sky-blue-800">Card Sky</h3>
            <p class="tw-text-sky-blue-700">Con gradiente sky blue</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CardsSectionComponent {
  @Output() successCardAction = new EventEmitter<void>();
  @Output() errorCardAction = new EventEmitter<void>();
  @Output() infoCardAction = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<void>();

  onSuccessCardAction() {
    this.successCardAction.emit();
  }

  onErrorCardAction() {
    this.errorCardAction.emit();
  }

  onInfoCardAction() {
    this.infoCardAction.emit();
  }

  onFormSubmit() {
    this.formSubmit.emit();
  }
}
