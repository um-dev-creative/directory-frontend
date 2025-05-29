import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface NotificationConfig extends MatSnackBarConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success notification
   */
  success(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'success',
      panelClass: ['notification-success']
    });
  }

  /**
   * Show error notification
   */
  error(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'error',
      duration: 7000, // Longer duration for errors
      panelClass: ['notification-error']
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'warning',
      panelClass: ['notification-warning']
    });
  }

  /**
   * Show info notification
   */
  info(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      type: 'info',
      panelClass: ['notification-info']
    });
  }

  /**
   * Show notification with custom config
   */
  show(message: string, config?: NotificationConfig): void {
    const finalConfig = {
      ...this.defaultConfig,
      ...config
    };

    this.snackBar.open(message, 'Close', finalConfig);
  }

  /**
   * Show notification with action
   */
  showWithAction(
    message: string,
    action: string,
    config?: NotificationConfig
  ): void {
    const finalConfig = {
      ...this.defaultConfig,
      ...config
    };

    this.snackBar.open(message, action, finalConfig);
  }

  /**
   * Dismiss all notifications
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
