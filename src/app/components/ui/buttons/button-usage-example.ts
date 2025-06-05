import { Component } from '@angular/core';
import { Button } from '@app/components/ui';
import { CommonModule } from '@angular/common';

/**
 * Ejemplo de cómo usar el componente Button en otros componentes
 */
@Component({
  selector: 'app-example-button-usage',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <div class="tw-p-6 tw-space-y-6">
      <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-700">
        Ejemplo de Uso del Componente Button
      </h2>

      <!-- Botones básicos -->
      <div class="tw-space-y-4">
        <h3 class="tw-text-lg tw-font-semibold">Formulario de contacto</h3>
        <div class="tw-flex tw-gap-4">
          <app-button
            variant="primary"
            [loading]="isSubmitting"
            (buttonClick)="submitForm()"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
          </app-button>

          <app-button
            variant="outline"
            (buttonClick)="resetForm()"
            [disabled]="isSubmitting"
          >
            Limpiar
          </app-button>
        </div>
      </div>

      <!-- Acciones de usuario -->
      <div class="tw-space-y-4">
        <h3 class="tw-text-lg tw-font-semibold">Acciones de usuario</h3>
        <div class="tw-flex tw-flex-wrap tw-gap-3">
          <app-button variant="secondary" size="sm">
            Editar Perfil
          </app-button>

          <app-button variant="info" size="sm">
            Ver Historial
          </app-button>

          <app-button variant="alert" size="sm" (buttonClick)="confirmDelete()">
            Eliminar Cuenta
          </app-button>
        </div>
      </div>

      <!-- Estados dinámicos -->
      <div class="tw-space-y-4">
        <h3 class="tw-text-lg tw-font-semibold">Estados dinámicos</h3>
        <div class="tw-flex tw-gap-4">
          <app-button
            [variant]="downloadStatus === 'completed' ? 'success' : 'primary'"
            [loading]="downloadStatus === 'loading'"
            (buttonClick)="downloadFile()"
          >
            {{ downloadButtonText }}
          </app-button>

          <app-button
            variant="ghost"
            [disabled]="downloadStatus === 'loading'"
            (buttonClick)="cancelDownload()"
          >
            Cancelar
          </app-button>
        </div>
      </div>

      <!-- Botón de ancho completo -->
      <div class="tw-space-y-4">
        <h3 class="tw-text-lg tw-font-semibold">Llamada a la acción</h3>
        <app-button
          variant="primary"
          size="lg"
          [fullWidth]="true"
          (buttonClick)="joinNow()"
        >
          ¡Únete ahora y obtén 30% de descuento!
        </app-button>
      </div>
    </div>
  `
})
export class ButtonExampleButtonUsage {
  isSubmitting = false;
  downloadStatus: 'idle' | 'loading' | 'completed' = 'idle';

  get downloadButtonText(): string {
    switch (this.downloadStatus) {
      case 'loading':
        return 'Descargando...';
      case 'completed':
        return '✓ Descargado';
      default:
        return 'Descargar Archivo';
    }
  }

  submitForm(): void {
    this.isSubmitting = true;

    // Simular envío de formulario
    setTimeout(() => {
      this.isSubmitting = false;
      console.log('Formulario enviado exitosamente');
    }, 2000);
  }

  resetForm(): void {
    console.log('Formulario limpiado');
  }

  confirmDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta?')) {
      console.log('Eliminando cuenta...');
    }
  }

  downloadFile(): void {
    if (this.downloadStatus === 'loading') return;

    this.downloadStatus = 'loading';

    // Simular descarga
    setTimeout(() => {
      this.downloadStatus = 'completed';
      console.log('Archivo descargado');

      // Resetear después de 3 segundos
      setTimeout(() => {
        this.downloadStatus = 'idle';
      }, 3000);
    }, 3000);
  }

  cancelDownload(): void {
    this.downloadStatus = 'idle';
    console.log('Descarga cancelada');
  }

  joinNow(): void {
    console.log('Redirigiendo a registro...');
  }
}
