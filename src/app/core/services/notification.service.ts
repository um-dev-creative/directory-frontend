import { Injectable, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { Notification } from '../../shared/components/notification/notification';

export interface NotificationConfig {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  type?: 'success' | 'error' | 'warning' | 'info';
  action?: string;
  closable?: boolean;
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
    const baseClasses = 'tw-fixed tw-z-50 tw-flex tw-flex-col tw-gap-2 tw-p-4';

    switch (position) {
      case 'top-right':
        return `${baseClasses} tw-top-0 tw-right-0`;
      case 'top-left':
        return `${baseClasses} tw-top-0 tw-left-0`;
      case 'bottom-right':
        return `${baseClasses} tw-bottom-0 tw-right-0`;
      case 'bottom-left':
        return `${baseClasses} tw-bottom-0 tw-left-0`;
      case 'top-center':
        return `${baseClasses} tw-top-0 tw-left-1/2 tw-transform -tw-translate-x-1/2`;
      case 'bottom-center':
        return `${baseClasses} tw-bottom-0 tw-left-1/2 tw-transform -tw-translate-x-1/2`;
      default:
        return `${baseClasses} tw-top-0 tw-right-0`;
    }
  }
}
