import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from './search';
import { LoggerService } from '@app/core/services/logger.service';

@Component({
  selector: 'app-search-usage-example',
  standalone: true,
  imports: [CommonModule, Search],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-emerald-700 mb-8">
        Ejemplos de Uso - Componente de Búsqueda
      </h1>

      <!-- Ejemplo básico -->
      <div class="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h3 class="text-lg font-semibold text-emerald-700 mb-4">Búsqueda Básica</h3>
        <div class="max-w-md">
          <app-search
            placeholder="Buscar productos..."
            (searchChange)="onSearchChange($event)"
            (searchSubmit)="onSearchSubmit($event)"
            (searchClear)="onSearchClear()"
          ></app-search>
        </div>
        @if (lastSearchTerm) {
          <p class="mt-3 text-sm text-emerald-600">
            Último término: <strong>{{ lastSearchTerm }}</strong>
          </p>
        }
      </div>

      <!-- Ejemplo con estado de carga -->
      <div class="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h3 class="text-lg font-semibold text-emerald-700 mb-4">Con Estado de Carga</h3>
        <div class="max-w-md mb-4">
          <app-search
            placeholder="Buscando en tiempo real..."
            [loading]="isLoading"
            (searchChange)="onRealTimeSearch($event)"
          ></app-search>
        </div>
        <button
          (click)="toggleLoading()"
          class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          {{ isLoading ? 'Detener' : 'Simular' }} Carga
        </button>
      </div>

      <!-- Ejemplo deshabilitado -->
      <div class="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h3 class="text-lg font-semibold text-emerald-700 mb-4">Estado Deshabilitado</h3>
        <div class="max-w-md mb-4">
          <app-search
            placeholder="Búsqueda no disponible"
            [disabled]="true"
          ></app-search>
        </div>
        <p class="text-sm text-beige-600">
          Útil cuando el usuario no tiene permisos o cuando el servicio no está disponible.
        </p>
      </div>

      <!-- Ejemplo con validación -->
      <div class="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h3 class="text-lg font-semibold text-emerald-700 mb-4">Con Validación (mín. 3 caracteres)</h3>
        <div class="max-w-md mb-4">
          <app-search
            placeholder="Escriba al menos 3 caracteres..."
            [minLength]="3"
            [maxLength]="50"
            (searchSubmit)="onValidatedSearch($event)"
          ></app-search>
        </div>
        @if (validationMessage) {
          <p class="text-sm text-coral-600">
            {{ validationMessage }}
          </p>
        }
      </div>

      <!-- Ejemplo en diferentes tamaños -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-lg font-semibold text-emerald-700 mb-4">Diferentes Anchos</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-emerald-700 mb-2">Ancho Completo</label>
            <app-search placeholder="Búsqueda a ancho completo"></app-search>
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-700 mb-2">Ancho Mediano</label>
            <div class="max-w-md">
              <app-search placeholder="Búsqueda mediana"></app-search>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-emerald-700 mb-2">Ancho Pequeño</label>
            <div class="max-w-xs">
              <app-search placeholder="Búsqueda pequeña"></app-search>
            </div>
          </div>
        </div>
      </div>

      <!-- Registro de eventos -->
      @if (events.length > 0) {
        <div class="bg-beige-50 rounded-xl shadow-soft p-6 mt-6">
          <h3 class="text-lg font-semibold text-emerald-700 mb-4">Registro de Eventos</h3>
          <div class="max-h-40 overflow-y-auto space-y-2">
            @for (event of events; track $index) {
              <div class="text-sm bg-white p-2 rounded border-l-4"
                    [class.border-emerald-400]="event.type === 'submit'"
                    [class.border-sky-400]="event.type === 'change'"
                    [class.border-coral-400]="event.type === 'clear'">
                <span class="font-medium">{{ event.type }}:</span>
                <span class="text-emerald-700">{{ event.value || 'vacío' }}</span>
                <span class="text-beige-600 ml-2">({{ event.timestamp }})</span>
              </div>
            }
          </div>
          <button
            (click)="clearEvents()"
            class="mt-3 px-3 py-1 text-xs bg-coral-500 text-white rounded hover:bg-coral-600"
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
  private readonly logger = inject(LoggerService);
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
    this.logger.info('Search submitted', term);
  }

  onSearchClear() {
    this.addEvent('clear', '');
    this.lastSearchTerm = '';
  }

  onRealTimeSearch(term: string) {
    this.addEvent('realtime', term);
    // Simular búsqueda en tiempo real
    if (term.length > 2) {
      this.logger.debug('Real-time search', term);
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
