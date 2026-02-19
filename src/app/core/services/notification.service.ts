import { Injectable, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { Notification } from '../../shared/components/notification/notification';

export interface NotificationConfig {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  type?: 'success' | 'error' | 'warning' | 'info';
  action?: string;
  closable?: boolean;
  reportError?: () => void;
  errorContext?: string;
  externalLink?: {
    url: string;
    text: string;
    openInNewTab?: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultConfig: NotificationConfig = {
    duration: 5000,
    position: 'top-right',
    closable: true
  };

  private notifications: ComponentRef<Notification>[] = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  success(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'success'
    });
  }

  error(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'error',
      duration: 7000
    });
  }

  errorWithReport(message: string, errorContext?: string, onReport?: () => void): void {
    this.show(message, {
      type: 'error',
      duration: 10000, // Más tiempo para que el usuario pueda ver y usar el link
      reportError: onReport,
      errorContext: errorContext
    });
  }

  errorWithExternalLink(message: string, linkUrl: string, linkText: string, openInNewTab: boolean = true): void {
    this.show(message, {
      type: 'error',
      duration: 12000, // Más tiempo para que el usuario pueda leer y usar el enlace
      externalLink: {
        url: linkUrl,
        text: linkText,
        openInNewTab: openInNewTab
      }
    });
  }

  warning(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'warning'
    });
  }

  info(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'info'
    });
  }

  show(message: string, config?: NotificationConfig): void {
    const finalConfig = {
      ...this.defaultConfig,
      ...config
    };

    const componentRef = createComponent(Notification, {
      environmentInjector: this.injector
    });

    componentRef.instance.message = message;
    componentRef.instance.config = finalConfig;
    componentRef.instance.onClose = () => this.removeNotification(componentRef);

    this.notifications.push(componentRef);
    this.appRef.attachView(componentRef.hostView);

    const container = this.getOrCreateContainer(finalConfig.position!);
    container.appendChild(componentRef.location.nativeElement);

    if (finalConfig.duration && finalConfig.duration > 0) {
      setTimeout(() => {
        this.removeNotification(componentRef);
      }, finalConfig.duration);
    }
  }

  showWithAction(
    message: string,
    action: string,
    config?: NotificationConfig
  ): void {
    this.show(message, {
      ...config,
      action
    });
  }

  dismiss(): void {
    this.notifications.forEach(notification => {
      this.removeNotification(notification);
    });
  }

  private removeNotification(componentRef: ComponentRef<Notification>): void {
    const index = this.notifications.indexOf(componentRef);
    if (index > -1) {
      // Trigger la animación de salida antes de destruir
      componentRef.instance.startLeaveAnimation();

      // Esperar a que termine la animación antes de destruir el componente
      setTimeout(() => {
        this.notifications.splice(index, 1);
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }, 300); // 300ms coincide con la duración de la animación
    }
  }

  private getOrCreateContainer(position: string): HTMLElement {
    const containerId = `notification-container-${position}`;
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = this.getContainerClasses(position);
      document.body.appendChild(container);
    }

    return container;
  }

  private getContainerClasses(position: string): string {
    const baseClasses = 'fixed z-50 flex flex-col gap-2 p-4';

    switch (position) {
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      case 'top-center':
        return `${baseClasses} top-0 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${baseClasses} bottom-0 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-0 right-0`;
    }
  }
}
