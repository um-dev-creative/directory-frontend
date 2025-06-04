import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService, LoadingService } from '@app/core/services';
import { map } from 'rxjs/operators';

// Import section components
import {
  ColorsSectionComponent,
  ButtonsSectionComponent,
  BadgesSectionComponent,
  InputsSectionComponent,
  CardsSectionComponent,
  NotificationsSectionComponent,
  LoadingSectionComponent
} from './sections';
import { IconsSectionComponent } from './sections/icons-section.component';

export interface ShowcaseSection {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-brand-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ColorsSectionComponent,
    ButtonsSectionComponent,
    BadgesSectionComponent,
    InputsSectionComponent,
    CardsSectionComponent,
    NotificationsSectionComponent,
    LoadingSectionComponent,
    IconsSectionComponent
  ],
  template: `
    <div class="tw-p-8 tw-bg-gradient-hero tw-min-h-screen">
      <div class="tw-max-w-6xl tw-mx-auto">
        <!-- Header -->
        <div class="tw-text-center tw-mb-12">
          <h1 class="tw-text-4xl tw-font-bold tw-text-emerald-green-700 tw-mb-4">
            Showcase de Componentes
          </h1>
          <p class="tw-text-lg tw-text-beige-800">
            Ejemplo de implementación de la nueva paleta de colores y componentes
          </p>
        </div>

        <!-- Navigation Menu -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6 tw-mb-8">
          <h2 class="tw-text-xl tw-font-bold tw-text-emerald-green-700 tw-mb-4">Navegación</h2>
          <div class="tw-flex tw-flex-wrap tw-gap-3">
            <button
              *ngFor="let section of sections"
              (click)="activeSection = section.id"
              [class]="getSectionButtonClass(section.id)"
              class="tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200"
            >
              {{ section.name }}
            </button>
          </div>
        </div>

        <!-- Section Content -->
        <div class="tw-transition-all tw-duration-300">
          <!-- Colors Section -->
          <app-colors-section *ngIf="activeSection === 'colors'"></app-colors-section>

          <!-- Buttons Section -->
          <app-buttons-section
            *ngIf="activeSection === 'buttons'"
            [isBasicLoading$]="isBasicLoading$"
            (showSuccessNotification)="showSuccessNotification()"
            (showBasicLoading)="showBasicLoading()"
            (showInfoNotification)="showInfoNotification()"
          ></app-buttons-section>

          <!-- Badges Section -->
          <app-badges-section *ngIf="activeSection === 'badges'"></app-badges-section>

          <!-- Inputs Section -->
          <app-inputs-section *ngIf="activeSection === 'inputs'"></app-inputs-section>

          <!-- Cards Section -->
          <app-cards-section
            *ngIf="activeSection === 'cards'"
            [isBasicLoading$]="isBasicLoading$"
            (successCardAction)="onSuccessCardAction()"
            (errorCardAction)="onErrorCardAction()"
            (infoCardAction)="onInfoCardAction()"
            (formSubmit)="onFormSubmit()"
            (successNotification)="onCardSuccessNotification()"
            (infoNotification)="onCardInfoNotification()"
            (warningNotification)="onCardWarningNotification()"
            (basicLoading)="onCardBasicLoading()"
            (cardFormSubmit)="onCardFormSubmit($event)"
          ></app-cards-section>

          <!-- Icons Section -->
          <app-icons-section
            *ngIf="activeSection === 'icons'"
            (iconClick)="onIconClick($event)"
          ></app-icons-section>

          <!-- Loading Section -->
          <app-loading-section
            *ngIf="activeSection === 'loading'"
            (showBasicLoading)="onLoadingBasic()"
            (showActionLoading)="onLoadingAction()"
            (showGlobalLoading)="onLoadingGlobal()"
          ></app-loading-section>

          <!-- Notifications Section -->
          <app-notifications-section
            *ngIf="activeSection === 'notifications'"
            (showSuccess)="onNotificationSuccess()"
            (showError)="onNotificationError()"
            (showInfo)="onNotificationInfo()"
            (showWarning)="onNotificationWarning()"
            (showWithAction)="onNotificationWithAction()"
            (showPersistent)="onNotificationPersistent()"
            (showCustomPosition)="onNotificationCustomPosition()"
            (dismissAll)="onNotificationDismissAll()"
            (successNotification)="onLegacySuccessNotification()"
            (errorNotification)="onLegacyErrorNotification()"
            (warningNotification)="onLegacyWarningNotification()"
            (infoNotification)="onLegacyInfoNotification()"
            (notificationWithAction)="onLegacyNotificationWithAction()"
            (persistentNotification)="onLegacyPersistentNotification()"
            (customPositionNotification)="onLegacyCustomPositionNotification()"
          ></app-notifications-section>
        </div>
      </div>
    </div>
  `
})
export class BrandShowcaseComponent {
  // Navigation state
  activeSection: string = 'colors';

  sections: ShowcaseSection[] = [
    { id: 'colors', name: 'Colores', description: 'Paleta de colores de marca' },
    { id: 'buttons', name: 'Botones', description: 'Componentes de botón reutilizables' },
    { id: 'badges', name: 'Badges', description: 'Diferentes estilos de badges' },
    { id: 'inputs', name: 'Inputs', description: 'Componentes de entrada de datos' },
    { id: 'cards', name: 'Cards', description: 'Componentes de tarjetas' },
    { id: 'icons', name: 'Iconos', description: 'Biblioteca de iconos Heroicons' },
    { id: 'loading', name: 'Loading', description: 'Estados de carga y spinners' },
    { id: 'notifications', name: 'Notificaciones', description: 'Sistema de notificaciones' }
  ];

  // Loading observables
  globalLoading$: Observable<boolean>;
  isBasicLoading$: Observable<boolean>;
  isActionLoading$: Observable<boolean>;

  constructor(
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {
    this.globalLoading$ = this.loadingService.globalLoading$;

    // Para loading específicos, usamos map para extraer el valor de cada key
    this.isBasicLoading$ = this.loadingService.loading$.pipe(
      map(loadingState => !!loadingState['basic'])
    );

    this.isActionLoading$ = this.loadingService.loading$.pipe(
      map(loadingState => !!loadingState['action'])
    );
  }

  // Navigation methods
  getSectionButtonClass(sectionId: string): string {
    const baseClasses = 'tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200';
    const activeClasses = 'tw-bg-emerald-green-500 tw-text-white tw-shadow-md';
    const inactiveClasses = 'tw-bg-beige-100 tw-text-beige-700 hover:tw-bg-beige-200';

    return this.activeSection === sectionId
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  }

  // Event handlers for buttons section
  showSuccessNotification() {
    this.notificationService.success('¡Operación exitosa!', {
      duration: 3000
    });
  }

  showBasicLoading() {
    this.loadingService.showSpecific('basic');

    setTimeout(() => {
      this.loadingService.hideSpecific('basic');
      this.notificationService.info('Proceso completado', {
        duration: 2000
      });
    }, 2000);
  }

  showInfoNotification() {
    this.notificationService.info('Esta es una notificación informativa', {
      duration: 3000
    });
  }

  // Event handlers for cards section
  onSuccessCardAction() {
    this.notificationService.success('¡Acción de tarjeta de éxito ejecutada!', {
      duration: 3000
    });
  }

  onErrorCardAction() {
    this.notificationService.error('Se ejecutó la acción de error desde la tarjeta', {
      duration: 4000
    });
  }

  onInfoCardAction() {
    this.notificationService.info('Información procesada desde la tarjeta', {
      duration: 3000
    });
  }

  onFormSubmit() {
    this.notificationService.success('¡Formulario enviado exitosamente!', {
      duration: 3000
    });
  }

  // New event handlers for card interactive features
  onCardSuccessNotification() {
    this.notificationService.success('¡Notificación de éxito desde card interactiva!', {
      duration: 3000
    });
  }

  onCardInfoNotification() {
    this.notificationService.info('Información desde card interactiva', {
      duration: 3000
    });
  }

  onCardWarningNotification() {
    this.notificationService.warning('Advertencia desde card interactiva', {
      duration: 3000
    });
  }

  onCardBasicLoading() {
    this.loadingService.showSpecific('basic');
    setTimeout(() => {
      this.loadingService.hideSpecific('basic');
      this.notificationService.info('Carga desde card completada', {
        duration: 2000
      });
    }, 2000);
  }

  onCardFormSubmit(formData: any) {
    console.log('Datos del formulario de card:', formData);
    this.notificationService.success(`¡Formulario enviado! Hola ${formData.cardFormName}`, {
      duration: 4000
    });
  }

  // Event handlers for notifications section
  onNotificationSuccess() {
    this.notificationService.success('¡Esta es una notificación de éxito!', {
      duration: 4000
    });
  }

  onNotificationError() {
    this.notificationService.error('Error de ejemplo para demostración', {
      duration: 6000
    });
  }

  onNotificationInfo() {
    this.notificationService.info('Información importante para el usuario', {
      duration: 4000
    });
  }

  onNotificationWarning() {
    this.notificationService.warning('Advertencia: Revisa la información ingresada', {
      duration: 5000
    });
  }

  onNotificationWithAction() {
    // For now, just show a regular notification
    // In a real implementation, this would use showWithAction method if available
    this.notificationService.success('Notificación con acción - Ver archivo', {
      duration: 7000
    });
  }

  onNotificationPersistent() {
    // For persistent notifications, use duration: 0 if supported
    this.notificationService.info('Esta notificación permanece hasta que la cierres manualmente', {
      duration: 0
    });
  }

  onNotificationCustomPosition() {
    this.notificationService.warning('Notificación en posición personalizada', {
      duration: 5000
    });
  }

  onNotificationDismissAll() {
    // This would call a dismiss all method if available in the service
    this.notificationService.info('Función para cerrar todas las notificaciones', {
      duration: 3000
    });
  }

  // Event handlers for loading section
  onLoadingBasic() {
    this.loadingService.showSpecific('basic');
    setTimeout(() => {
      this.loadingService.hideSpecific('basic');
    }, 3000);
  }

  onLoadingAction() {
    this.loadingService.showSpecific('action');
    setTimeout(() => {
      this.loadingService.hideSpecific('action');
    }, 2000);
  }

  onLoadingGlobal() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 4000);
  }

  // Legacy notification event handlers
  onLegacySuccessNotification() {
    this.notificationService.success('¡Notificación legacy de éxito!', {
      duration: 3000
    });
  }

  onLegacyErrorNotification() {
    this.notificationService.error('Error legacy de demostración', {
      duration: 4000
    });
  }

  onLegacyWarningNotification() {
    this.notificationService.warning('Advertencia legacy: Revisa los datos', {
      duration: 4000
    });
  }

  onLegacyInfoNotification() {
    this.notificationService.info('Información legacy importante', {
      duration: 3000
    });
  }

  onLegacyNotificationWithAction() {
    this.notificationService.success('Notificación legacy con acción', {
      duration: 5000
    });
  }

  onLegacyPersistentNotification() {
    this.notificationService.info('Notificación legacy persistente', {
      duration: 0
    });
  }

  onLegacyCustomPositionNotification() {
    this.notificationService.warning('Notificación legacy en posición personalizada', {
      duration: 4000
    });
  }

  // Icons event handlers
  onIconClick(iconName: string) {
    this.notificationService.info(`Icono seleccionado: ${iconName}`, {
      duration: 2000
    });
  }
}
