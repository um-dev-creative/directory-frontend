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
        <div class="shrink-0">
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
        <div class="ml-3 flex-1">
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
            <div class="mt-4">
              <div class="flex space-x-3">
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
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button
                type="button"
                [class]="dismissButtonClasses"
                (click)="onDismiss()"
                aria-label="Dismiss alert"
              >
                <span class="sr-only">Dismiss</span>
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
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
    const baseClasses = 'rounded-lg flex transition-all duration-200 my-2';
    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();
    const borderClasses = this.bordered ? 'border-l-4' : '';

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${borderClasses}`.trim();
  }

  get iconClasses(): string {
    return this.size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  }

  get titleClasses(): string {
    const baseClasses = 'font-medium';
    const sizeClasses = this.size === 'sm' ? 'text-sm' : 'text-base';
    const colorClasses = this.getTitleColorClasses();

    return `${baseClasses} ${sizeClasses} ${colorClasses}`.trim();
  }

  get descriptionClasses(): string {
    const baseClasses = this.title ? 'mt-1' : 'mt-0';
    const sizeClasses = this.size === 'sm' ? 'text-xs' : 'text-sm';
    const colorClasses = this.getDescriptionColorClasses();

    return `${baseClasses} ${sizeClasses} ${colorClasses}`.trim();
  }

  get actionButtonClasses(): string {
    const baseClasses = 'text-sm font-medium rounded-md px-3 py-2 transition-colors duration-200';
    return `${baseClasses} ${this.getActionButtonColorClasses()}`.trim();
  }

  get dismissButtonClasses(): string {
    const baseClasses = 'inline-flex rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    return `${baseClasses} ${this.getDismissButtonColorClasses()}`.trim();
  }

  private getSizeClasses(): string {
    const sizeMap = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };
    return sizeMap[this.size];
  }

  private getVariantClasses(): string {
    const variantMap = {
      info: 'bg-blue-50',
      success: 'bg-emerald-green-50',
      warning: 'bg-yellow-50',
      error: 'bg-red-50'
    };

    const borderMap = {
      info: 'border-blue-400',
      success: 'border-emerald-green-400',
      warning: 'border-yellow-400',
      error: 'border-red-400'
    };

    const base = variantMap[this.variant];
    const border = this.bordered ? borderMap[this.variant] : '';

    return `${base} ${border}`.trim();
  }

  private getTitleColorClasses(): string {
    const colorMap = {
      info: 'text-blue-800',
      success: 'text-emerald-green-800',
      warning: 'text-yellow-800',
      error: 'text-red-800'
    };
    return colorMap[this.variant];
  }

  private getDescriptionColorClasses(): string {
    const colorMap = {
      info: 'text-blue-700',
      success: 'text-emerald-green-700',
      warning: 'text-yellow-700',
      error: 'text-red-700'
    };
    return colorMap[this.variant];
  }

  private getActionButtonColorClasses(): string {
    const colorMap = {
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      success: 'bg-emerald-green-100 text-emerald-green-800 hover:bg-emerald-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      error: 'bg-red-100 text-red-800 hover:bg-red-200'
    };
    return colorMap[this.variant];
  }

  private getDismissButtonColorClasses(): string {
    const colorMap = {
      info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50',
      success: 'text-emerald-green-500 hover:bg-emerald-green-100 focus:ring-emerald-green-600 focus:ring-offset-emerald-green-50',
      warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
      error: 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
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
