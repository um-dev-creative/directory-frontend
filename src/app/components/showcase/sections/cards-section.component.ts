import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { Button, BadgeComponent, CardComponent, InputComponent } from '@app/components/ui';

@Component({
  selector: 'app-cards-section',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, BadgeComponent, CardComponent, InputComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Cards</h2>
      <p class="text-beige-700 mb-6">
        Diferentes estilos de tarjetas para mostrar contenido
      </p>

      <!-- Cards Básicas -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Cards Básicas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card Simple -->
          <div class="bg-white rounded-lg shadow-soft p-6 border border-beige-200">
            <h4 class="text-lg font-semibold text-emerald-green-700 mb-2">Card Simple</h4>
            <p class="text-beige-600 mb-4">
              Esta es una tarjeta básica con contenido simple y un diseño limpio.
            </p>
            <app-button variant="primary" size="sm">
              Ver más
            </app-button>
          </div>

          <!-- Card con Imagen -->
          <div class="bg-white rounded-lg shadow-soft overflow-hidden border border-beige-200">
            <div class="bg-gradient-to-br from-emerald-green-400 to-emerald-green-600 h-32"></div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-emerald-green-700 mb-2">Card con Header</h4>
              <p class="text-beige-600 mb-4">
                Tarjeta con un header visual colorido usando los colores de marca.
              </p>
              <app-button variant="secondary" size="sm">
                Explorar
              </app-button>
            </div>
          </div>

          <!-- Card con Badge -->
          <div class="bg-white rounded-lg shadow-soft p-6 border border-beige-200 relative">
            <div class="absolute top-4 right-4">
              <span class="bg-success-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Nuevo
              </span>
            </div>
            <h4 class="text-lg font-semibold text-emerald-green-700 mb-2 pr-16">Card con Badge</h4>
            <p class="text-beige-600 mb-4">
              Tarjeta que incluye un badge para destacar información importante.
            </p>
            <app-button variant="success" size="sm">
              Descubrir
            </app-button>
          </div>
        </div>
      </div>

      <!-- Cards con Estados -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Cards con Estados</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card de Éxito -->
          <div class="bg-success-50 rounded-lg shadow-soft p-6 border-2 border-success-200">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-success-700">Operación Exitosa</h4>
            </div>
            <p class="text-success-600 mb-4">
              La operación se completó correctamente sin errores.
            </p>
            <app-button variant="success" size="sm" (buttonClick)="onSuccessCardAction()">
              Continuar
            </app-button>
          </div>

          <!-- Card de Error -->
          <div class="bg-alert-50 rounded-lg shadow-soft p-6 border-2 border-alert-200">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-alert-500 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-alert-700">Error Detectado</h4>
            </div>
            <p class="text-alert-600 mb-4">
              Se encontró un problema que requiere atención.
            </p>
            <app-button variant="alert" size="sm" (buttonClick)="onErrorCardAction()">
              Resolver
            </app-button>
          </div>

          <!-- Card de Información -->
          <div class="bg-sky-blue-50 rounded-lg shadow-soft p-6 border-2 border-sky-blue-200">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-sky-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-sky-blue-700">Información</h4>
            </div>
            <p class="text-sky-blue-600 mb-4">
              Aquí tienes información importante para considerar.
            </p>
            <app-button variant="info" size="sm" (buttonClick)="onInfoCardAction()">
              Entendido
            </app-button>
          </div>
        </div>
      </div>

      <!-- Cards de Productos -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Cards de Productos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-soft overflow-hidden border border-beige-200 hover:shadow-lg transition-shadow">
            <div class="bg-gradient-to-br from-emerald-green-100 to-emerald-green-200 h-40 flex items-center justify-center">
              <div class="w-16 h-16 bg-emerald-green-500 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-emerald-green-700 mb-2">Plan Básico</h4>
              <p class="text-beige-600 mb-4">Perfecto para comenzar con las funcionalidades esenciales.</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-emerald-green-700">$19</span>
                <span class="text-sm text-beige-500">/mes</span>
              </div>
              <app-button variant="primary" size="sm" [fullWidth]="true">
                Seleccionar
              </app-button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-soft overflow-hidden border-2 border-emerald-green-300 relative">
            <div class="absolute top-4 right-4">
              <span class="bg-emerald-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Popular
              </span>
            </div>
            <div class="bg-gradient-to-br from-emerald-green-200 to-emerald-green-300 h-40 flex items-center justify-center">
              <div class="w-16 h-16 bg-emerald-green-600 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-emerald-green-700 mb-2">Plan Pro</h4>
              <p class="text-beige-600 mb-4">Ideal para equipos que necesitan funciones avanzadas.</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-emerald-green-700">$49</span>
                <span class="text-sm text-beige-500">/mes</span>
              </div>
              <app-button variant="primary" size="sm" [fullWidth]="true">
                Seleccionar
              </app-button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-soft overflow-hidden border border-beige-200">
            <div class="bg-gradient-to-br from-beige-100 to-beige-200 h-40 flex items-center justify-center">
              <div class="w-16 h-16 bg-beige-500 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm10 0H4V8h12V6zM8 5a1 1 0 112 0v1H8V5z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-emerald-green-700 mb-2">Plan Enterprise</h4>
              <p class="text-beige-600 mb-4">Solución completa para organizaciones grandes.</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-emerald-green-700">$99</span>
                <span class="text-sm text-beige-500">/mes</span>
              </div>
              <app-button variant="secondary" size="sm" [fullWidth]="true">
                Contactar
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card con Formulario -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Card con Formulario</h3>
        <div class="max-w-md mx-auto">
          <div class="bg-white rounded-lg shadow-soft p-6 border border-beige-200">
            <h4 class="text-lg font-semibold text-emerald-green-700 mb-4 text-center">Contacto</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-beige-700 mb-1">Nombre</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-beige-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-beige-700 mb-1">Email</label>
                <input
                  type="email"
                  class="w-full px-3 py-2 border border-beige-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-beige-700 mb-1">Mensaje</label>
                <textarea
                  rows="3"
                  class="w-full px-3 py-2 border border-beige-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500 resize-none"
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
      <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
        <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Cards Legacy (Comparación)</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-primary p-6 rounded-xl text-white">
            <h3 class="text-xl font-bold mb-2">Card Primaria</h3>
            <p class="opacity-90">Con gradiente emerald green</p>
          </div>
          <div class="bg-gradient-warm p-6 rounded-xl">
            <h3 class="text-xl font-bold mb-2 text-beige-800">Card Cálida</h3>
            <p class="text-beige-700">Con gradiente beige y coral</p>
          </div>
          <div class="bg-gradient-sky p-6 rounded-xl">
            <h3 class="text-xl font-bold mb-2 text-sky-blue-800">Card Sky</h3>
            <p class="text-sky-blue-700">Con gradiente sky blue</p>
          </div>
        </div>
      </div>

        <!-- Card Components -->
        <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
          <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Card Components</h2>
          <p class="text-beige-700 mb-6">
            Componentes Card versátiles con múltiples variantes, tamaños y características interactivas
          </p>

          <!-- Basic Card Variants -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Variantes Básicas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <app-card variant="default">
                <h4 class="text-lg font-semibold text-beige-800 mb-2">Default Card</h4>
                <p class="text-beige-600">Card estándar con sombra sutil y fondo blanco.</p>
              </app-card>

              <app-card variant="elevated">
                <h4 class="text-lg font-semibold text-beige-800 mb-2">Elevated Card</h4>
                <p class="text-beige-600">Card con sombra más pronunciada para mayor énfasis.</p>
              </app-card>

              <app-card variant="outlined">
                <h4 class="text-lg font-semibold text-beige-800 mb-2">Outlined Card</h4>
                <p class="text-beige-600">Card con borde definido y sin sombra.</p>
              </app-card>

              <app-card variant="interactive" [clickable]="true">
                <h4 class="text-lg font-semibold text-beige-800 mb-2">Interactive Card</h4>
                <p class="text-beige-600">Card clickeable con efectos hover y focus.</p>
              </app-card>

              <app-card variant="gradient">
                <h4 class="text-lg font-semibold text-white mb-2">Gradient Card</h4>
                <p class="text-emerald-green-100">Card con gradiente de marca elegante.</p>
              </app-card>
            </div>
          </div>

          <!-- Card Sizes -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <app-card size="sm">
                <h4 class="text-sm font-semibold text-beige-800 mb-1">Small</h4>
                <p class="text-xs text-beige-600">Tamaño compacto</p>
              </app-card>

              <app-card size="md">
                <h4 class="text-base font-semibold text-beige-800 mb-2">Medium</h4>
                <p class="text-sm text-beige-600">Tamaño estándar</p>
              </app-card>

              <app-card size="lg">
                <h4 class="text-lg font-semibold text-beige-800 mb-3">Large</h4>
                <p class="text-base text-beige-600">Tamaño grande para contenido extenso</p>
              </app-card>

              <app-card size="xl">
                <h4 class="text-xl font-semibold text-beige-800 mb-4">Extra Large</h4>
                <p class="text-lg text-beige-600">Máximo tamaño disponible</p>
              </app-card>
            </div>
          </div>

          <!-- Cards with Headers and Footers -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Header y Footer</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-card>
                <div slot="header" class="flex items-center justify-between">
                  <h4 class="text-lg font-semibold text-beige-800">Perfil de Usuario</h4>
                  <app-badge variant="success" size="sm">Activo</app-badge>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-emerald-green-200 rounded-full flex items-center justify-center">
                      <span class="text-emerald-green-700 font-semibold">JD</span>
                    </div>
                    <div>
                      <p class="font-medium text-beige-800">Juan Pérez</p>
                      <p class="text-sm text-beige-600">juan.perez&#64;email.com</p>
                    </div>
                  </div>
                </div>
                <div slot="footer" class="flex justify-end space-x-3">
                  <app-button variant="ghost" size="sm">Ver Perfil</app-button>
                  <app-button variant="primary" size="sm">Editar</app-button>
                </div>
              </app-card>

              <app-card variant="outlined">
                <div slot="header">
                  <h4 class="text-lg font-semibold text-beige-800">Estadísticas</h4>
                </div>
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p class="text-2xl font-bold text-emerald-green-600">1,234</p>
                    <p class="text-sm text-beige-600">Usuarios</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-sky-blue-600">856</p>
                    <p class="text-sm text-beige-600">Ventas</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-coral-600">92%</p>
                    <p class="text-sm text-beige-600">Satisfacción</p>
                  </div>
                </div>
                <div slot="footer" class="text-center">
                  <app-button variant="outline" size="sm" [fullWidth]="true">Ver Detalles</app-button>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Cards with Media -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Contenido Multimedia</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <app-card>
                <div slot="media" class="h-48 bg-gradient-primary flex items-center justify-center">
                  <span class="text-white font-semibold text-lg">Imagen Placeholder</span>
                </div>
                <h4 class="text-lg font-semibold text-beige-800 mb-2">Producto Destacado</h4>
                <p class="text-beige-600 mb-4">Descripción del producto con características principales.</p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-emerald-green-600">$99.99</span>
                  <app-button variant="primary" size="sm">Comprar</app-button>
                </div>
              </app-card>

              <app-card variant="interactive" [clickable]="true">
                <div slot="media" class="h-32 bg-gradient-warm flex items-center justify-center">
                  <span class="text-beige-800 font-semibold">Artículo</span>
                </div>
                <h4 class="text-lg font-semibold text-beige-800 mb-2">Blog Post</h4>
                <p class="text-beige-600 text-sm">Resumen del artículo de blog con información relevante...</p>
                <div slot="footer" class="flex items-center justify-between text-sm text-beige-500">
                  <span>5 min de lectura</span>
                  <span>Hace 2 días</span>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Interactive Cards Demo -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Cards Interactivas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <app-card
                variant="interactive"
                [clickable]="true"
                (cardClick)="showSuccessNotification()">
                <div class="text-center">
                  <div class="w-12 h-12 bg-emerald-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-emerald-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 class="font-semibold text-beige-800">Éxito</h4>
                  <p class="text-sm text-beige-600">Click para notificación</p>
                </div>
              </app-card>

              <app-card
                variant="interactive"
                [clickable]="true"
                (cardClick)="showInfoNotification()">
                <div class="text-center">
                  <div class="w-12 h-12 bg-sky-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-sky-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 class="font-semibold text-beige-800">Información</h4>
                  <p class="text-sm text-beige-600">Click para info</p>
                </div>
              </app-card>

              <app-card
                variant="interactive"
                [clickable]="true"
                (cardClick)="showWarningNotification()">
                <div class="text-center">
                  <div class="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-coral-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 class="font-semibold text-beige-800">Advertencia</h4>
                  <p class="text-sm text-beige-600">Click para alerta</p>
                </div>
              </app-card>

              <app-card [loading]="(isBasicLoading$ | async) || false" (cardClick)="showBasicLoading()">
                <div class="text-center">
                  <div class="w-12 h-12 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    @if (isBasicLoading$ | async) {
                      <div class="animate-spin rounded-full h-6 w-6 border-2 border-beige-300 border-t-beige-600"></div>
                    } @else {
                      <svg class="w-6 h-6 text-beige-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                      </svg>
                    }
                  </div>
                  <h4 class="font-semibold text-beige-800">Carga</h4>
                  <p class="text-sm text-beige-600">
                    @if (isBasicLoading$ | async) {
                      Cargando...
                    } @else {
                      Click para cargar
                    }
                  </p>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Contact Form in Card -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Formulario de Contacto en Card</h3>
            <div class="max-w-2xl">
              <app-card size="lg">
                <div slot="header">
                  <h4 class="text-xl font-semibold text-beige-800">Contáctanos</h4>
                  <p class="text-beige-600 mt-1">Envíanos un mensaje y te responderemos pronto</p>
                </div>

                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <app-input
                      label="Nombre"
                      placeholder="Tu nombre completo"
                      [(ngModel)]="inputValues.cardFormName">
                    </app-input>
                    <app-input
                      label="Email"
                      type="email"
                      placeholder="tu&#64;email.com"
                      [(ngModel)]="inputValues.cardFormEmail">
                    </app-input>
                  </div>

                  <app-input
                    label="Asunto"
                    placeholder="¿En qué podemos ayudarte?"
                    [(ngModel)]="inputValues.cardFormSubject">
                  </app-input>

                  <div>
                    <label class="block text-sm font-medium text-beige-700 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      class="w-full px-3 py-2 border border-beige-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-green-500 focus:border-emerald-green-500"
                      rows="4"
                      placeholder="Escribe tu mensaje aquí..."
                      [(ngModel)]="inputValues.cardFormMessage">
                    </textarea>
                  </div>
                </div>

                <div slot="footer" class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <app-badge variant="info" size="sm">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                      </svg>
                      Datos protegidos
                    </app-badge>
                  </div>
                  <div class="flex space-x-3">
                    <app-button variant="ghost" (buttonClick)="clearCardForm()">
                      Limpiar
                    </app-button>
                    <app-button variant="primary" (buttonClick)="submitCardForm()">
                      Enviar Mensaje
                    </app-button>
                  </div>
                </div>
              </app-card>
            </div>
          </div>

          <!-- Real-world Business Directory Example -->
          <div class="border-t border-beige-200 pt-6">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Ejemplo: Directorio de Negocios</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <app-card variant="interactive" [clickable]="true" (cardClick)="showInfoNotification()">
                <div slot="header" class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-beige-800">Restaurante El Sabor</h4>
                    <div class="flex items-center mt-1">
                      <div class="flex text-yellow-400">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="text-sm text-beige-600 ml-1">4.0 (120 reseñas)</span>
                    </div>
                  </div>
                  <app-badge variant="success" size="sm" [dot]="true">Abierto</app-badge>
                </div>

                <div class="space-y-3">
                  <p class="text-beige-600 text-sm">Cocina tradicional mexicana con ingredientes frescos y recetas familiares.</p>

                  <div class="flex flex-wrap gap-2">
                    <app-badge variant="secondary" size="xs">Mexicana</app-badge>
                    <app-badge variant="secondary" size="xs">Familiar</app-badge>
                    <app-badge variant="secondary" size="xs">Terraza</app-badge>
                  </div>

                  <div class="flex items-center text-sm text-beige-600">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    Centro Histórico, 0.8 km
                  </div>
                </div>

                <div slot="footer" class="flex justify-between items-center">
                  <span class="text-sm text-beige-500">Cierra a las 23:00</span>
                  <div class="flex space-x-2">
                    <app-button variant="ghost" size="sm">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </app-button>
                    <app-button variant="primary" size="sm">Ver Más</app-button>
                  </div>
                </div>
              </app-card>

              <app-card variant="interactive" [clickable]="true" (cardClick)="showSuccessNotification()">
                <div slot="header" class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-beige-800">Café Central</h4>
                    <div class="flex items-center mt-1">
                      <div class="flex text-yellow-400">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="text-sm text-beige-600 ml-1">5.0 (85 reseñas)</span>
                    </div>
                  </div>
                  <app-badge variant="success" size="sm" [dot]="true">Abierto</app-badge>
                </div>

                <div class="space-y-3">
                  <p class="text-beige-600 text-sm">Café de especialidad, pasteles artesanales y ambiente acogedor para trabajar.</p>

                  <div class="flex flex-wrap gap-2">
                    <app-badge variant="secondary" size="xs">Café</app-badge>
                    <app-badge variant="secondary" size="xs">WiFi</app-badge>
                    <app-badge variant="secondary" size="xs">Postres</app-badge>
                  </div>

                  <div class="flex items-center text-sm text-beige-600">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    Zona Rosa, 1.2 km
                  </div>
                </div>

                <div slot="footer" class="flex justify-between items-center">
                  <span class="text-sm text-beige-500">Cierra a las 22:00</span>
                  <div class="flex space-x-2">
                    <app-button variant="ghost" size="sm">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </app-button>
                    <app-button variant="primary" size="sm">Ver Más</app-button>
                  </div>
                </div>
              </app-card>

              <app-card variant="interactive" [clickable]="true" (cardClick)="showWarningNotification()">
                <div slot="header" class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-beige-800">Gym PowerFit</h4>
                    <div class="flex items-center mt-1">
                      <div class="flex text-yellow-400">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="text-sm text-beige-600 ml-1">3.5 (45 reseñas)</span>
                    </div>
                  </div>
                  <app-badge variant="warning" size="sm" [dot]="true">Cerrado</app-badge>
                </div>

                <div class="space-y-3">
                  <p class="text-beige-600 text-sm">Gimnasio completo con equipos modernos, clases grupales y entrenadores personales.</p>

                  <div class="flex flex-wrap gap-2">
                    <app-badge variant="secondary" size="xs">Fitness</app-badge>
                    <app-badge variant="secondary" size="xs">Pesas</app-badge>
                    <app-badge variant="secondary" size="xs">Clases</app-badge>
                  </div>

                  <div class="flex items-center text-sm text-beige-600">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    Polanco, 2.1 km
                  </div>
                </div>

                <div slot="footer" class="flex justify-between items-center">
                  <span class="text-sm text-beige-500">Abre a las 06:00</span>
                  <div class="flex space-x-2">
                    <app-button variant="ghost" size="sm">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </app-button>
                    <app-button variant="primary" size="sm">Ver Más</app-button>
                  </div>
                </div>
              </app-card>
            </div>
          </div>
        </div>
    </div>
  `
})
export class CardsSectionComponent {
  @Input() isBasicLoading$: Observable<boolean> | undefined;

  @Output() successCardAction = new EventEmitter<void>();
  @Output() errorCardAction = new EventEmitter<void>();
  @Output() infoCardAction = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<void>();
  @Output() successNotification = new EventEmitter<void>();
  @Output() infoNotification = new EventEmitter<void>();
  @Output() warningNotification = new EventEmitter<void>();
  @Output() basicLoading = new EventEmitter<void>();
  @Output() cardFormSubmit = new EventEmitter<any>();

  // Form data binding
  inputValues = {
    cardFormName: '',
    cardFormEmail: '',
    cardFormSubject: '',
    cardFormMessage: ''
  };

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

  // New methods for interactive card functionality
  showSuccessNotification() {
    this.successNotification.emit();
  }

  showInfoNotification() {
    this.infoNotification.emit();
  }

  showWarningNotification() {
    this.warningNotification.emit();
  }

  showBasicLoading() {
    this.basicLoading.emit();
  }

  clearCardForm() {
    this.inputValues = {
      cardFormName: '',
      cardFormEmail: '',
      cardFormSubject: '',
      cardFormMessage: ''
    };
  }

  submitCardForm() {
    if (this.inputValues.cardFormName && this.inputValues.cardFormEmail && this.inputValues.cardFormMessage) {
      this.cardFormSubmit.emit(this.inputValues);
      this.showSuccessNotification();
      this.clearCardForm();
    } else {
      this.showWarningNotification();
    }
  }
}
