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
  ModalsSectionComponent,
  SkeletonsSectionComponent,
  NotificationsSectionComponent,
  LoadingSectionComponent,
  AlertsSectionComponent,
  TooltipsSectionComponent,
  AvatarsSectionComponent
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
    ModalsSectionComponent,
    SkeletonsSectionComponent,
    NotificationsSectionComponent,
    LoadingSectionComponent,
    IconsSectionComponent,
    AlertsSectionComponent,
    TooltipsSectionComponent,
    AvatarsSectionComponent
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
            @for (section of sections; track section.id) {
              <button
                (click)="activeSection = section.id"
                [class]="getSectionButtonClass(section.id)"
                class="tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200"
              >
                {{ section.name }}
              </button>
            }
          </div>
        </div>

        <!-- Section Content -->
        <div class="tw-transition-all tw-duration-300">
          <!-- Colors Section -->
          @if (activeSection === 'colors') {
            <app-colors-section></app-colors-section>
          }

          <!-- Buttons Section -->
          @if (activeSection === 'buttons') {
            <app-buttons-section
              [isBasicLoading$]="isBasicLoading$"
              (showSuccessNotification)="showSuccessNotification()"
              (showBasicLoading)="showBasicLoading()"
              (showInfoNotification)="showInfoNotification()"
            ></app-buttons-section>
          }

          <!-- Badges Section -->
          @if (activeSection === 'badges') {
            <app-badges-section></app-badges-section>
          }

          <!-- Avatars Section -->
          @if (activeSection === 'avatars') {
            <app-avatars-section></app-avatars-section>
          }

          <!-- Inputs Section -->
          @if (activeSection === 'inputs') {
            <app-inputs-section></app-inputs-section>
          }

          <!-- Cards Section -->
          @if (activeSection === 'cards') {
            <app-cards-section
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
          }

          <!-- Modals Section -->
          @if (activeSection === 'modals') {
            <app-modals-section></app-modals-section>
          }

          <!-- Skeletons Section -->
          @if (activeSection === 'skeletons') {
            <app-skeletons-section></app-skeletons-section>
          }

          <!-- Icons Section -->
          @if (activeSection === 'icons') {
            <app-icons-section
              (iconClick)="onIconClick($event)"
            ></app-icons-section>
          }

          <!-- Alerts Section -->
          @if (activeSection === 'alerts') {
            <app-alerts-section
              (showInfoAlert)="onAlertInfo()"
              (showSuccessAlert)="onAlertSuccess()"
              (showWarningAlert)="onAlertWarning()"
              (showErrorAlert)="onAlertError()"
            ></app-alerts-section>
          }

          <!-- Tooltips Section -->
          @if (activeSection === 'tooltips') {
            <app-tooltips-section
              (showTooltipDemo)="onTooltipDemo()"
              (showTooltipInfo)="onTooltipInfo()"
              (showTooltipWarning)="onTooltipWarning()"
            ></app-tooltips-section>
          }

          <!-- Loading Section -->
          @if (activeSection === 'loading') {
            <app-loading-section
              (showBasicLoading)="onLoadingBasic()"
              (showActionLoading)="onLoadingAction()"
              (showGlobalLoading)="onLoadingGlobal()"
            ></app-loading-section>
          }

          <!-- Notifications Section -->
          @if (activeSection === 'notifications') {
            <app-notifications-section
              (showSuccess)="onNotificationSuccess()"
              (showError)="onNotificationError()"
              (showErrorWithReport)="onNotificationErrorWithReport()"
              (showErrorWithExternalLink)="onNotificationErrorWithExternalLink()"
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
          }
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
    { id: 'avatars', name: 'Avatares', description: 'Componentes de avatar reutilizables' },
    { id: 'inputs', name: 'Inputs', description: 'Componentes de entrada de datos' },
    { id: 'cards', name: 'Cards', description: 'Componentes de tarjetas' },
    { id: 'modals', name: 'Modals', description: 'Diálogos y ventanas modales' },
    { id: 'skeletons', name: 'Skeletons', description: 'Componentes de carga con placeholders' },
    { id: 'icons', name: 'Iconos', description: 'Biblioteca de iconos Heroicons' },
    { id: 'alerts', name: 'Alertas', description: 'Mensajes de retroalimentación contextual' },
    { id: 'tooltips', name: 'Tooltips', description: 'Información contextual en hover/click' },
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

  onNotificationErrorWithReport() {
    this.notificationService.errorWithReport(
      'Ha ocurrido un error inesperado al procesar los datos.',
      'Error en showcase - sección de notificaciones',
      () => {
        // Simular reporte de error
        this.notificationService.info('¡Reporte de error enviado exitosamente! Nuestro equipo revisará el problema.', {
          duration: 5000
        });
        console.log('Error reportado:', {
          timestamp: new Date().toISOString(),
          context: 'Error en showcase - sección de notificaciones',
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      }
    );
  }

  onNotificationErrorWithExternalLink() {
    this.notificationService.errorWithExternalLink(
      'Error de conexión con el servidor. No se pudieron cargar los datos.',
      'https://docs.example.com/troubleshooting/connection-errors',
      'Ver guía de solución de problemas'
    );
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
    this.notificationService.dismiss();
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
    this.notificationService.showWithAction(
      'Archivo guardado correctamente',
      'Ver archivo',
      {
        type: 'success',
        duration: 7000
      }
    );
  }

  onLegacyPersistentNotification() {
    this.notificationService.info('Notificación legacy persistente', {
      duration: 0
    });
  }

  onLegacyCustomPositionNotification() {
    this.notificationService.show('Notificación en posición personalizada', {
      type: 'warning',
      position: 'bottom-left',
      duration: 5000
    });
  }

  // Alert event handlers
  onAlertInfo() {
    this.notificationService.info('Alerta de información activada desde el showcase', {
      duration: 3000
    });
  }

  onAlertSuccess() {
    this.notificationService.success('¡Alerta de éxito activada desde el showcase!', {
      duration: 3000
    });
  }

  onAlertWarning() {
    this.notificationService.warning('Alerta de advertencia activada desde el showcase', {
      duration: 4000
    });
  }

  onAlertError() {
    this.notificationService.error('Alerta de error activada desde el showcase', {
      duration: 4000
    });
  }

  // Tooltip event handlers
  onTooltipDemo() {
    this.notificationService.info('Demo de tooltip ejecutado', {
      duration: 3000
    });
  }

  onTooltipInfo() {
    this.notificationService.info('Tooltip informativo mostrado desde el showcase', {
      duration: 3000
    });
  }

  onTooltipWarning() {
    this.notificationService.warning('Tooltip de advertencia activado', {
      duration: 3000
    });
  }

  // Icons event handlers
  onIconClick(iconName: string) {
    this.notificationService.info(`Icono seleccionado: ${iconName}`, {
      duration: 2000
    });
  }
}
