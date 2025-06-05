import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationConfig } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="notification-toast tw-pointer-events-auto"
      [ngClass]="getNotificationClasses()"
      [@slideAnimation]="animationState"
    >
      <div class="tw-flex tw-items-start tw-justify-between">
        <div class="tw-flex tw-items-start">
          <div class="tw-flex-shrink-0 tw-mr-3 tw-mt-0.5">
            @switch (config?.type) {
              @case ('success') {
                <svg class="tw-w-5 tw-h-5 tw-text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              }
              @case ('error') {
                <svg class="tw-w-5 tw-h-5 tw-text-error" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              }
              @case ('warning') {
                <svg class="tw-w-5 tw-h-5 tw-text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              }
              @case ('info') {
                <svg class="tw-w-5 tw-h-5 tw-text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              }
            }
          </div>
          <div class="tw-flex-1">
            <div class="tw-text-sm tw-font-medium tw-text-surface-900 dark:tw-text-surface-50">
              {{ message }}
            </div>

            <!-- Enlace externo debajo del mensaje -->
            @if (config?.externalLink) {
              <div class="tw-mt-2">
                <a
                  [href]="config?.externalLink?.url"
                  [target]="config?.externalLink?.openInNewTab ? '_blank' : '_self'"
                  [rel]="config?.externalLink?.openInNewTab ? 'noopener noreferrer' : ''"
                  class="tw-text-xs tw-font-medium tw-underline hover:tw-no-underline focus:tw-outline-none tw-flex tw-items-center tw-gap-1"
                  [ngClass]="getExternalLinkClasses()"
                >
                  <svg class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd"/>
                  </svg>
                  {{ config?.externalLink?.text }}
                </a>
              </div>
            }
          </div>
        </div>
        <div class="tw-ml-4 tw-flex tw-items-center tw-gap-2 tw-flex-shrink-0">
          @if (config?.type === 'error' && config?.reportError) {
            <button
              (click)="handleReportError()"
              class="tw-text-xs tw-font-medium tw-underline hover:tw-no-underline focus:tw-outline-none tw-text-coral-600 hover:tw-text-coral-700 tw-flex tw-items-center tw-gap-1"
              title="Reportar este error"
            >
              <svg class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              Reportar error
            </button>
          }
          @if (config?.action) {
            <button
              (click)="handleAction()"
              class="tw-text-sm tw-font-medium tw-underline hover:tw-no-underline focus:tw-outline-none"
              [ngClass]="getActionClasses()"
            >
              {{ config?.action }}
            </button>
          }
          @if (config?.closable) {
            <button
              (click)="close()"
              class="tw-ml-2 tw-text-surface-400 hover:tw-text-surface-600 focus:tw-outline-none"
            >
              <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideAnimation', [
      state('enter', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      state('leave', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      transition('void => enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('enter => leave', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class Notification implements OnInit {
  @Input() message: string = '';
  @Input() config?: NotificationConfig;
  @Input() onClose?: () => void;

  animationState: 'enter' | 'leave' = 'enter';

  ngOnInit() {
    this.animationState = 'enter';
  }

  startLeaveAnimation() {
    this.animationState = 'leave';
  }

  getNotificationClasses(): string {
    const baseClasses = 'tw-max-w-sm tw-w-full tw-shadow-lg tw-rounded-lg tw-p-4 tw-mb-4 tw-border tw-pointer-events-auto tw-bg-opacity-100';

    switch (this.config?.type) {
      case 'success':
        return `${baseClasses} tw-bg-emerald-green-50 tw-border-emerald-green-200`;
      case 'error':
        return `${baseClasses} tw-bg-coral-50 tw-border-coral-200`;
      case 'warning':
        return `${baseClasses} tw-bg-beige-50 tw-border-beige-200`;
      case 'info':
        return `${baseClasses} tw-bg-sky-blue-50 tw-border-sky-blue-200`;
      default:
        return `${baseClasses} tw-bg-white tw-border-gray-200`;
    }
  }

  getActionClasses(): string {
    switch (this.config?.type) {
      case 'success':
        return 'tw-text-emerald-green-600 hover:tw-text-emerald-green-700';
      case 'error':
        return 'tw-text-coral-600 hover:tw-text-coral-700';
      case 'warning':
        return 'tw-text-beige-600 hover:tw-text-beige-700';
      case 'info':
        return 'tw-text-sky-blue-600 hover:tw-text-sky-blue-700';
      default:
        return 'tw-text-gray-600 hover:tw-text-gray-700';
    }
  }

  getExternalLinkClasses(): string {
    switch (this.config?.type) {
      case 'success':
        return 'tw-text-emerald-green-600 hover:tw-text-emerald-green-700';
      case 'error':
        return 'tw-text-coral-600 hover:tw-text-coral-700';
      case 'warning':
        return 'tw-text-beige-600 hover:tw-text-beige-700';
      case 'info':
        return 'tw-text-sky-blue-600 hover:tw-text-sky-blue-700';
      default:
        return 'tw-text-gray-600 hover:tw-text-gray-700';
    }
  }

  handleAction(): void {
    this.close();
  }

  handleReportError(): void {
    if (this.config?.reportError) {
      this.config.reportError();
    }
    // No cerramos automáticamente la notificación para que el usuario pueda ver el resultado
  }

  close(): void {
    if (this.onClose) {
      this.onClose();
    }
  }
}
