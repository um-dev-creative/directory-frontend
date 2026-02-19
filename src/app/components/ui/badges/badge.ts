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
      @if (leadingIcon) {
        <span class="mr-1">
          <ng-content select="[slot=leading-icon]"></ng-content>
        </span>
      }

      <!-- Dot Indicator -->
      @if (dot) {
        <span [class]="dotClasses"></span>
      }

      <!-- Badge Content -->
      <span [class]="contentClasses">
        <ng-content></ng-content>
      </span>

      <!-- Trailing Icon / Close Button -->
      @if (trailingIcon) {
        <span class="ml-1">
          <ng-content select="[slot=trailing-icon]"></ng-content>
        </span>
      }

      <!-- Removable Button -->
      @if (removable && !disabled) {
        <button
          type="button"
          [class]="removeButtonClasses"
          (click)="onRemove()"
          [attr.aria-label]="'Remove ' + (label || 'badge')"
        >
          <svg class="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6L1 7"></path>
          </svg>
        </button>
      }
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
      'inline-flex',
      'items-center',
      'font-medium',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'whitespace-nowrap',
      'max-w-full'
    ];

    // Size classes
    const sizeClasses = {
      xs: ['text-xs', 'px-2', 'py-0.5', 'gap-1'],
      sm: ['text-xs', 'px-2.5', 'py-1', 'gap-1'],
      md: ['text-sm', 'px-3', 'py-1.5', 'gap-1.5'],
      lg: ['text-base', 'px-4', 'py-2', 'gap-2']
    };

    // Shape classes
    const shapeClasses = {
      rounded: ['rounded-md'],
      pill: ['rounded-full'],
      square: ['rounded-none']
    };

    // Variant classes
    const variantClasses = this.outline ? this.getOutlineVariantClasses() : this.getSolidVariantClasses();

    // State classes
    const stateClasses = [];
    if (this.disabled) {
      stateClasses.push('opacity-50', 'cursor-not-allowed');
    } else if (this.removable) {
      stateClasses.push('cursor-default');
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
        'bg-gray-100',
        'text-gray-800',
        'border',
        'border-gray-200'
      ],
      primary: [
        'bg-emerald-green-500',
        'text-white',
        'shadow-sm'
      ],
      secondary: [
        'bg-sky-blue-500',
        'text-white',
        'shadow-sm'
      ],
      success: [
        'bg-emerald-green-600',
        'text-white',
        'shadow-sm'
      ],
      error: [
        'bg-coral-500',
        'text-white',
        'shadow-sm'
      ],
      warning: [
        'bg-amber-500',
        'text-white',
        'shadow-sm'
      ],
      info: [
        'bg-sky-blue-400',
        'text-white',
        'shadow-sm'
      ]
    };

    return variantClasses[this.variant];
  }

  private getOutlineVariantClasses(): string[] {
    const variantClasses = {
      default: [
        'bg-transparent',
        'text-gray-700',
        'border',
        'border-gray-300',
        'hover:bg-gray-50'
      ],
      primary: [
        'bg-transparent',
        'text-emerald-green-700',
        'border',
        'border-emerald-green-500',
        'hover:bg-emerald-green-50'
      ],
      secondary: [
        'bg-transparent',
        'text-sky-blue-700',
        'border',
        'border-sky-blue-500',
        'hover:bg-sky-blue-50'
      ],
      success: [
        'bg-transparent',
        'text-emerald-green-800',
        'border',
        'border-emerald-green-600',
        'hover:bg-emerald-green-50'
      ],
      error: [
        'bg-transparent',
        'text-coral-700',
        'border',
        'border-coral-500',
        'hover:bg-coral-50'
      ],
      warning: [
        'bg-transparent',
        'text-amber-700',
        'border',
        'border-amber-500',
        'hover:bg-amber-50'
      ],
      info: [
        'bg-transparent',
        'text-sky-blue-700',
        'border',
        'border-sky-blue-400',
        'hover:bg-sky-blue-50'
      ]
    };

    return variantClasses[this.variant];
  }

  get dotClasses(): string {
    const baseClasses = [
      'w-2',
      'h-2',
      'rounded-full',
      'mr-2'
    ];

    // Pulse animation
    const pulseClasses = this.pulse ? ['animate-pulse'] : [];

    // Dot variant colors
    const dotVariantClasses = {
      default: ['bg-gray-500'],
      primary: ['bg-emerald-green-500'],
      secondary: ['bg-sky-blue-500'],
      success: ['bg-emerald-green-600'],
      error: ['bg-coral-500'],
      warning: ['bg-amber-500'],
      info: ['bg-sky-blue-400']
    };

    return [
      ...baseClasses,
      ...pulseClasses,
      ...dotVariantClasses[this.variant]
    ].join(' ');
  }

  get contentClasses(): string {
    return 'truncate flex-1';
  }

  get removeButtonClasses(): string {
    const baseClasses = [
      'ml-1.5',
      'inline-flex',
      'items-center',
      'justify-center',
      'w-4',
      'h-4',
      'rounded-full',
      'transition-colors',
      'duration-150',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1'
    ];

    // Remove button variant colors
    const removeVariantClasses = this.outline ? this.getOutlineRemoveClasses() : this.getSolidRemoveClasses();

    return [...baseClasses, ...removeVariantClasses].join(' ');
  }

  private getSolidRemoveClasses(): string[] {
    const removeClasses = {
      default: [
        'text-gray-500',
        'hover:bg-gray-200',
        'hover:text-gray-700',
        'focus:ring-gray-400'
      ],
      primary: [
        'text-emerald-green-200',
        'hover:bg-emerald-green-600',
        'hover:text-white',
        'focus:ring-emerald-green-300'
      ],
      secondary: [
        'text-sky-blue-200',
        'hover:bg-sky-blue-600',
        'hover:text-white',
        'focus:ring-sky-blue-300'
      ],
      success: [
        'text-emerald-green-200',
        'hover:bg-emerald-green-700',
        'hover:text-white',
        'focus:ring-emerald-green-300'
      ],
      error: [
        'text-coral-200',
        'hover:bg-coral-600',
        'hover:text-white',
        'focus:ring-coral-300'
      ],
      warning: [
        'text-amber-200',
        'hover:bg-amber-600',
        'hover:text-white',
        'focus:ring-amber-300'
      ],
      info: [
        'text-sky-blue-200',
        'hover:bg-sky-blue-500',
        'hover:text-white',
        'focus:ring-sky-blue-300'
      ]
    };

    return removeClasses[this.variant];
  }

  private getOutlineRemoveClasses(): string[] {
    const removeClasses = {
      default: [
        'text-gray-500',
        'hover:bg-gray-100',
        'hover:text-gray-700',
        'focus:ring-gray-400'
      ],
      primary: [
        'text-emerald-green-500',
        'hover:bg-emerald-green-100',
        'hover:text-emerald-green-700',
        'focus:ring-emerald-green-300'
      ],
      secondary: [
        'text-sky-blue-500',
        'hover:bg-sky-blue-100',
        'hover:text-sky-blue-700',
        'focus:ring-sky-blue-300'
      ],
      success: [
        'text-emerald-green-600',
        'hover:bg-emerald-green-100',
        'hover:text-emerald-green-800',
        'focus:ring-emerald-green-300'
      ],
      error: [
        'text-coral-500',
        'hover:bg-coral-100',
        'hover:text-coral-700',
        'focus:ring-coral-300'
      ],
      warning: [
        'text-amber-500',
        'hover:bg-amber-100',
        'hover:text-amber-700',
        'focus:ring-amber-300'
      ],
      info: [
        'text-sky-blue-400',
        'hover:bg-sky-blue-100',
        'hover:text-sky-blue-600',
        'focus:ring-sky-blue-300'
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
