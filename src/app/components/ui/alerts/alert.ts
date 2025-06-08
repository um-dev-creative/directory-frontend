import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!dismissed) {
      <div
        [class]="alertClasses"
        role="alert"
        [attr.aria-live]="variant === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Icon -->
        <div class="tw-flex-shrink-0">
          <svg [class]="iconClasses" fill="currentColor" viewBox="0 0 20 20">
            @switch (variant) {
              @case ('info') {
                <!-- Info Icon -->
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              }
              @case ('success') {
                <!-- Success Icon -->
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.2 10.3a.75.75 0 00-1.1 1.02l1.604 1.732a.75.75 0 001.206-.15l3.857-5.39z"
                  clip-rule="evenodd"
                />
              }
              @case ('warning') {
                <!-- Warning Icon -->
                <path
                  fill-rule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              }
              @case ('error') {
                <!-- Error Icon -->
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clip-rule="evenodd"
                />
              }
            }
          </svg>
        </div>

        <!-- Content -->
        <div class="tw-ml-3 tw-flex-1">
          <!-- Title -->
          @if (title) {
            <h3 [class]="titleClasses">
              {{ title }}
            </h3>
          }

          <!-- Description -->
          <div [class]="descriptionClasses">
            @if (description) {
              <p>{{ description }}</p>
            }
            <ng-content></ng-content>
          </div>

          <!-- Actions -->
          @if (actions || actionText) {
            <div class="tw-mt-4">
              <div class="tw-flex tw-space-x-3">
                <!-- Custom Actions -->
                @if (actions) {
                  <ng-content select="[slot=actions]"></ng-content>
                }

                <!-- Simple Action Button -->
                @if (actionText && !actions) {
                  <button
                    type="button"
                    [class]="actionButtonClasses"
                    (click)="onAction()"
                  >
                    {{ actionText }}
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <!-- Dismiss Button -->
        @if (dismissible) {
          <div class="tw-ml-auto tw-pl-3">
            <div class="tw--mx-1.5 tw--my-1.5">
              <button
                type="button"
                [class]="dismissButtonClasses"
                (click)="onDismiss()"
                aria-label="Dismiss alert"
              >
                <span class="tw-sr-only">Dismiss</span>
                <svg class="tw-w-5 tw-h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: []
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() size: AlertSize = 'md';
  @Input() title?: string;
  @Input() description?: string;
  @Input() dismissible: boolean = false;
  @Input() actions: boolean = false;
  @Input() actionText?: string;
  @Input() bordered: boolean = false;

  @Output() dismiss = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  dismissed = false;

  get alertClasses(): string {
    const baseClasses = 'tw-rounded-lg tw-flex tw-transition-all tw-duration-200 tw-my-2';
    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();
    const borderClasses = this.bordered ? 'tw-border-l-4' : '';

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${borderClasses}`.trim();
  }

  get iconClasses(): string {
    return this.size === 'sm' ? 'tw-w-4 tw-h-4' : 'tw-w-5 tw-h-5';
  }

  get titleClasses(): string {
    const baseClasses = 'tw-font-medium';
    const sizeClasses = this.size === 'sm' ? 'tw-text-sm' : 'tw-text-base';
    const colorClasses = this.getTitleColorClasses();

    return `${baseClasses} ${sizeClasses} ${colorClasses}`.trim();
  }

  get descriptionClasses(): string {
    const baseClasses = 'tw-mt-1';
    const sizeClasses = this.size === 'sm' ? 'tw-text-xs' : 'tw-text-sm';
    const colorClasses = this.getDescriptionColorClasses();

    return `${baseClasses} ${sizeClasses} ${colorClasses}`.trim();
  }

  get actionButtonClasses(): string {
    const baseClasses = 'tw-text-sm tw-font-medium tw-rounded-md tw-px-3 tw-py-2 tw-transition-colors tw-duration-200';
    return `${baseClasses} ${this.getActionButtonColorClasses()}`.trim();
  }

  get dismissButtonClasses(): string {
    const baseClasses = 'tw-inline-flex tw-rounded-md tw-p-1.5 tw-transition-colors tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2';
    return `${baseClasses} ${this.getDismissButtonColorClasses()}`.trim();
  }

  private getSizeClasses(): string {
    const sizeMap = {
      sm: 'tw-p-3',
      md: 'tw-p-4',
      lg: 'tw-p-6'
    };
    return sizeMap[this.size];
  }

  private getVariantClasses(): string {
    const variantMap = {
      info: 'tw-bg-blue-50',
      success: 'tw-bg-emerald-green-50',
      warning: 'tw-bg-yellow-50',
      error: 'tw-bg-red-50'
    };

    const borderMap = {
      info: 'tw-border-blue-400',
      success: 'tw-border-emerald-green-400',
      warning: 'tw-border-yellow-400',
      error: 'tw-border-red-400'
    };

    const base = variantMap[this.variant];
    const border = this.bordered ? borderMap[this.variant] : '';

    return `${base} ${border}`.trim();
  }

  private getTitleColorClasses(): string {
    const colorMap = {
      info: 'tw-text-blue-800',
      success: 'tw-text-emerald-green-800',
      warning: 'tw-text-yellow-800',
      error: 'tw-text-red-800'
    };
    return colorMap[this.variant];
  }

  private getDescriptionColorClasses(): string {
    const colorMap = {
      info: 'tw-text-blue-700',
      success: 'tw-text-emerald-green-700',
      warning: 'tw-text-yellow-700',
      error: 'tw-text-red-700'
    };
    return colorMap[this.variant];
  }

  private getActionButtonColorClasses(): string {
    const colorMap = {
      info: 'tw-bg-blue-100 tw-text-blue-800 hover:tw-bg-blue-200',
      success: 'tw-bg-emerald-green-100 tw-text-emerald-green-800 hover:tw-bg-emerald-green-200',
      warning: 'tw-bg-yellow-100 tw-text-yellow-800 hover:tw-bg-yellow-200',
      error: 'tw-bg-red-100 tw-text-red-800 hover:tw-bg-red-200'
    };
    return colorMap[this.variant];
  }

  private getDismissButtonColorClasses(): string {
    const colorMap = {
      info: 'tw-text-blue-500 hover:tw-bg-blue-100 focus:tw-ring-blue-600 focus:tw-ring-offset-blue-50',
      success: 'tw-text-emerald-green-500 hover:tw-bg-emerald-green-100 focus:tw-ring-emerald-green-600 focus:tw-ring-offset-emerald-green-50',
      warning: 'tw-text-yellow-500 hover:tw-bg-yellow-100 focus:tw-ring-yellow-600 focus:tw-ring-offset-yellow-50',
      error: 'tw-text-red-500 hover:tw-bg-red-100 focus:tw-ring-red-600 focus:tw-ring-offset-red-50'
    };
    return colorMap[this.variant];
  }

  onDismiss(): void {
    this.dismissed = true;
    this.dismiss.emit();
  }

  onAction(): void {
    this.action.emit();
  }
}
