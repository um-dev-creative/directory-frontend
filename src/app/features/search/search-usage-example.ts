import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from './search';

@Component({
  selector: 'app-search-usage-example',
  standalone: true,
  imports: [CommonModule, Search],
  template: `
    <div class="tw-max-w-4xl tw-mx-auto">
      <h1 class="tw-text-3xl tw-font-bold tw-text-emerald-700 tw-mb-8">
        Ejemplos de Uso - Componente de Búsqueda
      </h1>

      <!-- Ejemplo básico -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6 tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-700 tw-mb-4">Búsqueda Básica</h3>
        <div class="tw-max-w-md">
          <app-search
            placeholder="Buscar productos..."
            (searchChange)="onSearchChange($event)"
            (searchSubmit)="onSearchSubmit($event)"
            (searchClear)="onSearchClear()"
          ></app-search>
        </div>
        @if (lastSearchTerm) {
          <p class="tw-mt-3 tw-text-sm tw-text-emerald-600">
            Último término: <strong>{{ lastSearchTerm }}</strong>
          </p>
        }
      </div>

      <!-- Ejemplo con estado de carga -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6 tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-700 tw-mb-4">Con Estado de Carga</h3>
        <div class="tw-max-w-md tw-mb-4">
          <app-search
            placeholder="Buscando en tiempo real..."
            [loading]="isLoading"
            (searchChange)="onRealTimeSearch($event)"
          ></app-search>
        </div>
        <button
          (click)="toggleLoading()"
          class="tw-px-4 tw-py-2 tw-bg-sky-500 tw-text-white tw-rounded-lg hover:tw-bg-sky-600 tw-transition-colors"
        >
          {{ isLoading ? 'Detener' : 'Simular' }} Carga
        </button>
      </div>

      <!-- Ejemplo deshabilitado -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6 tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-700 tw-mb-4">Estado Deshabilitado</h3>
        <div class="tw-max-w-md tw-mb-4">
          <app-search
            placeholder="Búsqueda no disponible"
            [disabled]="true"
          ></app-search>
        </div>
        <p class="tw-text-sm tw-text-beige-600">
          Útil cuando el usuario no tiene permisos o cuando el servicio no está disponible.
        </p>
      </div>

      <!-- Ejemplo con validación -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6 tw-mb-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-700 tw-mb-4">Con Validación (mín. 3 caracteres)</h3>
        <div class="tw-max-w-md tw-mb-4">
          <app-search
            placeholder="Escriba al menos 3 caracteres..."
            [minLength]="3"
            [maxLength]="50"
            (searchSubmit)="onValidatedSearch($event)"
          ></app-search>
        </div>
        @if (validationMessage) {
          <p class="tw-text-sm tw-text-coral-600">
            {{ validationMessage }}
          </p>
        }
      </div>

      <!-- Ejemplo en diferentes tamaños -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-700 tw-mb-4">Diferentes Anchos</h3>

        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-700 tw-mb-2">Ancho Completo</label>
            <app-search placeholder="Búsqueda a ancho completo"></app-search>
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-700 tw-mb-2">Ancho Mediano</label>
            <div class="tw-max-w-md">
              <app-search placeholder="Búsqueda mediana"></app-search>
            </div>
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-emerald-700 tw-mb-2">Ancho Pequeño</label>
            <div class="tw-max-w-xs">
              <app-search placeholder="Búsqueda pequeña"></app-search>
            </div>
          </div>
        </div>
      </div>

      <!-- Registro de eventos -->
      @if (events.length > 0) {
        <div class="tw-bg-beige-50 tw-rounded-xl tw-shadow-soft tw-p-6 tw-mt-6">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-700 tw-mb-4">Registro de Eventos</h3>
          <div class="tw-max-h-40 tw-overflow-y-auto tw-space-y-2">
            @for (event of events; track $index) {
              <div class="tw-text-sm tw-bg-white tw-p-2 tw-rounded tw-border-l-4"
                    [class.tw-border-emerald-400]="event.type === 'submit'"
                    [class.tw-border-sky-400]="event.type === 'change'"
                    [class.tw-border-coral-400]="event.type === 'clear'">
                <span class="tw-font-medium">{{ event.type }}:</span>
                <span class="tw-text-emerald-700">{{ event.value || 'vacío' }}</span>
                <span class="tw-text-beige-600 tw-ml-2">({{ event.timestamp }})</span>
              </div>
            }
          </div>
          <button
            (click)="clearEvents()"
            class="tw-mt-3 tw-px-3 tw-py-1 tw-text-xs tw-bg-coral-500 tw-text-white tw-rounded hover:tw-bg-coral-600"
          >
            Limpiar Registro
          </button>
        </div>
      }
    </div>
  `,
  styles: []
})
export class SearchUsageExampleComponent {
  lastSearchTerm: string = '';
  isLoading: boolean = false;
  validationMessage: string = '';
  events: Array<{type: string, value: string, timestamp: string}> = [];

  onSearchChange(term: string) {
    this.addEvent('change', term);
    this.lastSearchTerm = term;
  }

  onSearchSubmit(term: string) {
    this.addEvent('submit', term);
    console.log('Búsqueda enviada:', term);
  }

  onSearchClear() {
    this.addEvent('clear', '');
    this.lastSearchTerm = '';
  }

  onRealTimeSearch(term: string) {
    this.addEvent('realtime', term);
    // Simular búsqueda en tiempo real
    if (term.length > 2) {
      console.log('Búsqueda en tiempo real:', term);
    }
  }

  onValidatedSearch(term: string) {
    if (term.length >= 3) {
      this.addEvent('validated', term);
      this.validationMessage = `Búsqueda válida: "${term}"`;
    } else {
      this.validationMessage = 'Se requieren al menos 3 caracteres';
    }
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  addEvent(type: string, value: string) {
    this.events.unshift({
      type,
      value,
      timestamp: new Date().toLocaleTimeString()
    });

    // Mantener solo los últimos 10 eventos
    if (this.events.length > 10) {
      this.events = this.events.slice(0, 10);
    }
  }

  clearEvents() {
    this.events = [];
  }
}
