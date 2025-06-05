import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill' | 'square';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <!-- Leading Icon -->
      <span *ngIf="leadingIcon" class="tw-mr-1">
        <ng-content select="[slot=leading-icon]"></ng-content>
      </span>

      <!-- Dot Indicator -->
      <span
        *ngIf="dot"
        [class]="dotClasses">
      </span>

      <!-- Badge Content -->
      <span [class]="contentClasses">
        <ng-content></ng-content>
      </span>

      <!-- Trailing Icon / Close Button -->
      <span *ngIf="trailingIcon" class="tw-ml-1">
        <ng-content select="[slot=trailing-icon]"></ng-content>
      </span>

      <!-- Removable Button -->
      <button
        *ngIf="removable && !disabled"
        type="button"
        [class]="removeButtonClasses"
        (click)="onRemove()"
        [attr.aria-label]="'Remove ' + (label || 'badge')"
      >
        <svg class="tw-w-3 tw-h-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
          <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
        </svg>
      </button>
    </span>
  `,
  styles: []
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'sm';
  @Input() shape: BadgeShape = 'rounded';
  @Input() disabled: boolean = false;
  @Input() removable: boolean = false;
  @Input() dot: boolean = false;
  @Input() pulse: boolean = false;
  @Input() leadingIcon: boolean = false;
  @Input() trailingIcon: boolean = false;
  @Input() label: string = '';
  @Input() outline: boolean = false;

  @Output() remove = new EventEmitter<void>();
  @Output() badgeClick = new EventEmitter<Event>();

  get badgeClasses(): string {
    const baseClasses = [
      'tw-inline-flex',
      'tw-items-center',
      'tw-font-medium',
      'tw-transition-all',
      'tw-duration-200',
      'tw-ease-in-out',
      'tw-whitespace-nowrap',
      'tw-max-w-full'
    ];

    // Size classes
    const sizeClasses = {
      xs: ['tw-text-xs', 'tw-px-2', 'tw-py-0.5', 'tw-gap-1'],
      sm: ['tw-text-xs', 'tw-px-2.5', 'tw-py-1', 'tw-gap-1'],
      md: ['tw-text-sm', 'tw-px-3', 'tw-py-1.5', 'tw-gap-1.5'],
      lg: ['tw-text-base', 'tw-px-4', 'tw-py-2', 'tw-gap-2']
    };

    // Shape classes
    const shapeClasses = {
      rounded: ['tw-rounded-md'],
      pill: ['tw-rounded-full'],
      square: ['tw-rounded-none']
    };

    // Variant classes
    const variantClasses = this.outline ? this.getOutlineVariantClasses() : this.getSolidVariantClasses();

    // State classes
    const stateClasses = [];
    if (this.disabled) {
      stateClasses.push('tw-opacity-50', 'tw-cursor-not-allowed');
    } else if (this.removable) {
      stateClasses.push('tw-cursor-default');
    }

    return [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...shapeClasses[this.shape],
      ...variantClasses,
      ...stateClasses
    ].join(' ');
  }

  private getSolidVariantClasses(): string[] {
    const variantClasses = {
      default: [
        'tw-bg-gray-100',
        'tw-text-gray-800',
        'tw-border',
        'tw-border-gray-200'
      ],
      primary: [
        'tw-bg-emerald-green-500',
        'tw-text-white',
        'tw-shadow-sm'
      ],
      secondary: [
        'tw-bg-sky-blue-500',
        'tw-text-white',
        'tw-shadow-sm'
      ],
      success: [
        'tw-bg-emerald-green-600',
        'tw-text-white',
        'tw-shadow-sm'
      ],
      error: [
        'tw-bg-coral-500',
        'tw-text-white',
        'tw-shadow-sm'
      ],
      warning: [
        'tw-bg-amber-500',
        'tw-text-white',
        'tw-shadow-sm'
      ],
      info: [
        'tw-bg-sky-blue-400',
        'tw-text-white',
        'tw-shadow-sm'
      ]
    };

    return variantClasses[this.variant];
  }

  private getOutlineVariantClasses(): string[] {
    const variantClasses = {
      default: [
        'tw-bg-transparent',
        'tw-text-gray-700',
        'tw-border',
        'tw-border-gray-300',
        'hover:tw-bg-gray-50'
      ],
      primary: [
        'tw-bg-transparent',
        'tw-text-emerald-green-700',
        'tw-border',
        'tw-border-emerald-green-500',
        'hover:tw-bg-emerald-green-50'
      ],
      secondary: [
        'tw-bg-transparent',
        'tw-text-sky-blue-700',
        'tw-border',
        'tw-border-sky-blue-500',
        'hover:tw-bg-sky-blue-50'
      ],
      success: [
        'tw-bg-transparent',
        'tw-text-emerald-green-800',
        'tw-border',
        'tw-border-emerald-green-600',
        'hover:tw-bg-emerald-green-50'
      ],
      error: [
        'tw-bg-transparent',
        'tw-text-coral-700',
        'tw-border',
        'tw-border-coral-500',
        'hover:tw-bg-coral-50'
      ],
      warning: [
        'tw-bg-transparent',
        'tw-text-amber-700',
        'tw-border',
        'tw-border-amber-500',
        'hover:tw-bg-amber-50'
      ],
      info: [
        'tw-bg-transparent',
        'tw-text-sky-blue-700',
        'tw-border',
        'tw-border-sky-blue-400',
        'hover:tw-bg-sky-blue-50'
      ]
    };

    return variantClasses[this.variant];
  }

  get dotClasses(): string {
    const baseClasses = [
      'tw-w-2',
      'tw-h-2',
      'tw-rounded-full',
      'tw-mr-2'
    ];

    // Pulse animation
    const pulseClasses = this.pulse ? ['tw-animate-pulse'] : [];

    // Dot variant colors
    const dotVariantClasses = {
      default: ['tw-bg-gray-500'],
      primary: ['tw-bg-emerald-green-500'],
      secondary: ['tw-bg-sky-blue-500'],
      success: ['tw-bg-emerald-green-600'],
      error: ['tw-bg-coral-500'],
      warning: ['tw-bg-amber-500'],
      info: ['tw-bg-sky-blue-400']
    };

    return [
      ...baseClasses,
      ...pulseClasses,
      ...dotVariantClasses[this.variant]
    ].join(' ');
  }

  get contentClasses(): string {
    return 'tw-truncate tw-flex-1';
  }

  get removeButtonClasses(): string {
    const baseClasses = [
      'tw-ml-1.5',
      'tw-inline-flex',
      'tw-items-center',
      'tw-justify-center',
      'tw-w-4',
      'tw-h-4',
      'tw-rounded-full',
      'tw-transition-colors',
      'tw-duration-150',
      'focus:tw-outline-none',
      'focus:tw-ring-2',
      'focus:tw-ring-offset-1'
    ];

    // Remove button variant colors
    const removeVariantClasses = this.outline ? this.getOutlineRemoveClasses() : this.getSolidRemoveClasses();

    return [...baseClasses, ...removeVariantClasses].join(' ');
  }

  private getSolidRemoveClasses(): string[] {
    const removeClasses = {
      default: [
        'tw-text-gray-500',
        'hover:tw-bg-gray-200',
        'hover:tw-text-gray-700',
        'focus:tw-ring-gray-400'
      ],
      primary: [
        'tw-text-emerald-green-200',
        'hover:tw-bg-emerald-green-600',
        'hover:tw-text-white',
        'focus:tw-ring-emerald-green-300'
      ],
      secondary: [
        'tw-text-sky-blue-200',
        'hover:tw-bg-sky-blue-600',
        'hover:tw-text-white',
        'focus:tw-ring-sky-blue-300'
      ],
      success: [
        'tw-text-emerald-green-200',
        'hover:tw-bg-emerald-green-700',
        'hover:tw-text-white',
        'focus:tw-ring-emerald-green-300'
      ],
      error: [
        'tw-text-coral-200',
        'hover:tw-bg-coral-600',
        'hover:tw-text-white',
        'focus:tw-ring-coral-300'
      ],
      warning: [
        'tw-text-amber-200',
        'hover:tw-bg-amber-600',
        'hover:tw-text-white',
        'focus:tw-ring-amber-300'
      ],
      info: [
        'tw-text-sky-blue-200',
        'hover:tw-bg-sky-blue-500',
        'hover:tw-text-white',
        'focus:tw-ring-sky-blue-300'
      ]
    };

    return removeClasses[this.variant];
  }

  private getOutlineRemoveClasses(): string[] {
    const removeClasses = {
      default: [
        'tw-text-gray-500',
        'hover:tw-bg-gray-100',
        'hover:tw-text-gray-700',
        'focus:tw-ring-gray-400'
      ],
      primary: [
        'tw-text-emerald-green-500',
        'hover:tw-bg-emerald-green-100',
        'hover:tw-text-emerald-green-700',
        'focus:tw-ring-emerald-green-300'
      ],
      secondary: [
        'tw-text-sky-blue-500',
        'hover:tw-bg-sky-blue-100',
        'hover:tw-text-sky-blue-700',
        'focus:tw-ring-sky-blue-300'
      ],
      success: [
        'tw-text-emerald-green-600',
        'hover:tw-bg-emerald-green-100',
        'hover:tw-text-emerald-green-800',
        'focus:tw-ring-emerald-green-300'
      ],
      error: [
        'tw-text-coral-500',
        'hover:tw-bg-coral-100',
        'hover:tw-text-coral-700',
        'focus:tw-ring-coral-300'
      ],
      warning: [
        'tw-text-amber-500',
        'hover:tw-bg-amber-100',
        'hover:tw-text-amber-700',
        'focus:tw-ring-amber-300'
      ],
      info: [
        'tw-text-sky-blue-400',
        'hover:tw-bg-sky-blue-100',
        'hover:tw-text-sky-blue-600',
        'focus:tw-ring-sky-blue-300'
      ]
    };

    return removeClasses[this.variant];
  }

  onRemove(): void {
    if (!this.disabled) {
      this.remove.emit();
    }
  }

  onClick(event: Event): void {
    if (!this.disabled) {
      this.badgeClick.emit(event);
    }
  }
}
