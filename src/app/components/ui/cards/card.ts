import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive' | 'gradient' | 'outlined-blue';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="cardClasses"
      (click)="onClick($event)"
      (mouseenter)="onHover($event)"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable ? '0' : null"
      [attr.aria-label]="ariaLabel"
      (keydown.enter)="onKeyDown($event)"
      (keydown.space)="onKeyDown($event)"
    >
      <!-- Header Section -->
      @if (hasHeader) {
        <div [class]="headerClasses">
          <ng-content select="[slot=header]"></ng-content>
        </div>
      }

      <!-- Media Section (for images, logos, etc.) -->
      @if (hasMedia) {
        <div [class]="mediaClasses">
          <ng-content select="[slot=media]"></ng-content>
        </div>
      }

      <!-- Content Section -->
      <div [class]="contentClasses">
        <!-- Title -->
        @if (title) {
          <h3 [class]="titleClasses">
            {{ title }}
          </h3>
        }

        <!-- Subtitle -->
        @if (subtitle) {
          <p [class]="subtitleClasses">
            {{ subtitle }}
          </p>
        }

        <!-- Main Content -->
        <div [class]="bodyClasses">
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Footer Section -->
      @if (hasFooter) {
        <div [class]="footerClasses">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }

      <!-- Loading Overlay -->
      @if (loading) {
        <div [class]="loadingOverlayClasses">
          <div class="flex flex-col items-center justify-center space-y-2">
            <svg class="animate-spin h-8 w-8 text-emerald-green-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">Cargando...</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() size: CardSize = 'md';
  @Input() padding: CardPadding = 'md';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() clickable: boolean = false;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = true;
  @Input() ariaLabel: string = '';
  @Input() hasHeader: boolean = false;
  @Input() hasFooter: boolean = false;
  @Input() hasMedia: boolean = false;
  @Input() borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';

  @Output() cardClick = new EventEmitter<Event>();
  @Output() cardHover = new EventEmitter<Event>();

  get cardClasses(): string {
    const baseClasses = [
      'relative',
      'bg-white',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'overflow-hidden'
    ];

    // Size classes (affects overall dimensions)
    const sizeClasses = {
      sm: ['max-w-sm'],
      md: ['max-w-md'],
      lg: ['max-w-lg'],
      xl: ['max-w-xl'],
      full: [] // No max-width restriction, takes full available width
    };

    // Border radius classes
    const radiusClasses = {
      none: ['rounded-none'],
      sm: ['rounded-sm'],
      md: ['rounded-md'],
      lg: ['rounded-lg'],
      xl: ['rounded-xl']
    };

    // Variant classes
    const variantClasses = this.getVariantClasses();

    // Width classes
    const widthClasses = this.fullWidth ? ['w-full'] : [];

    // Interactive classes
    const interactiveClasses = [];
    if (this.clickable && !this.disabled && !this.loading) {
      interactiveClasses.push(
        'cursor-pointer',
        'focus:outline-none',
        // 'focus:ring-2',
        // 'focus:ring-emerald-green-500',
        // 'focus:ring-offset-2'
      );
    }

    // State classes
    const stateClasses = [];
    if (this.disabled) {
      stateClasses.push('opacity-50', 'cursor-not-allowed');
    }
    if (this.loading) {
      stateClasses.push('pointer-events-none');
    }

    return [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...radiusClasses[this.borderRadius],
      ...variantClasses,
      ...widthClasses,
      ...interactiveClasses,
      ...stateClasses
    ].join(' ');
  }

  private getVariantClasses(): string[] {
    const variantClasses = {
      default: [
        'border',
        'border-gray-200',
        'shadow-sm'
      ],
      elevated: [
        'border',
        'border-gray-100',
        'shadow-lg',
        'shadow-gray-200/50',
        ...(this.clickable ? [
          'hover:shadow-xl',
          'hover:shadow-gray-300/50',
          'hover:translate-y-1'
        ] : [])
      ],
      outlined: [
        'border-2',
        'border-gray-300',
        ...(this.clickable ? [
          'hover:border-emerald-green-400',
          'hover:shadow-md',
        ] : [])
      ],
      interactive: [
        'border',
        'border-gray-200',
        'shadow-md',
        ...(this.clickable ? [
          'hover:shadow-lg',
          'hover:shadow-emerald-green-500/20',
          'hover:border-emerald-green-300',
          'hover:translate-y-0.5',
          'active:translate-y-0',
          'active:shadow-md'
        ] : [])
      ],
      gradient: [
        'border',
        'border-transparent',
        'bg-gradient-to-br',
        'from-emerald-green-50',
        'via-white',
        'to-sky-blue-50',
        'shadow-lg',
        'shadow-emerald-green-500/10',
        ...(this.clickable ? [
          'hover:shadow-xl',
          'hover:shadow-emerald-green-500/20',
          'hover:translate-y-1'
        ] : [])
      ],
      'outlined-blue': [
        'my-2',
        'border',
        'border-sky-blue-200',
        // 'border-sky-300',
        // 'shadow-lg',
        'bg-gradient-sky',
        ...(this.clickable ? [
          'hover:border-sky-blue-400',
          'hover:bg-sky-blue-50/50',
          'hover:shadow-md'
        ] : [])
      ]
    };

    return variantClasses[this.variant];
  }

  get headerClasses(): string {
    const baseClasses = [
      'flex',
      'items-center',
      'justify-between',
      'border-b',
      'border-gray-100'
    ];

    const paddingClasses = this.getPaddingClasses();

    return [...baseClasses, ...paddingClasses].join(' ');
  }

  get mediaClasses(): string {
    return [
      'w-full',
      'overflow-hidden',
      'bg-gray-50'
    ].join(' ');
  }

  get contentClasses(): string {
    const baseClasses = [
      'flex',
      'flex-col',
      'flex-1'
    ];

    const paddingClasses = this.getPaddingClasses();

    return [...baseClasses, ...paddingClasses].join(' ');
  }

  get titleClasses(): string {
    const baseClasses = [
      'text-lg',
      'font-bold',
      'text-gray-900',
      'mb-1',
      'leading-tight'
    ];

    return baseClasses.join(' ');
  }

  get subtitleClasses(): string {
    const baseClasses = [
      'text-md',
      'font-semibold',
      'text-gray-600',
      'mb-2',
      'leading-relaxed'
    ];

    return baseClasses.join(' ');
  }

  get bodyClasses(): string {
    const baseClasses = [
      'text-gray-700',
      'text-sm',
      'leading-relaxed'
    ];

    return baseClasses.join(' ');
  }

  get footerClasses(): string {
    const baseClasses = [
      'flex',
      'items-center',
      'justify-between',
      'border-t',
      'border-gray-100',
      'bg-gray-50/50'
    ];

    const paddingClasses = this.getPaddingClasses();

    return [...baseClasses, ...paddingClasses].join(' ');
  }

  get loadingOverlayClasses(): string {
    return [
      'absolute',
      'inset-0',
      'bg-white/80',
      'backdrop-blur-sm',
      'flex',
      'items-center',
      'justify-center',
      'z-10'
    ].join(' ');
  }

  private getPaddingClasses(): string[] {
    const paddingClasses = {
      none: [],
      sm: ['p-3'],
      md: ['p-4'],
      lg: ['p-6']
    };

    return paddingClasses[this.padding];
  }

  onClick(event: Event): void {
    if (!this.disabled && !this.loading && this.clickable) {
      this.cardClick.emit(event);
    }
  }

  onHover(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.cardHover.emit(event);
    }
  }

  onKeyDown(event: Event): void {
    if (!this.disabled && !this.loading && this.clickable) {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
        keyboardEvent.preventDefault();
        this.cardClick.emit(event);
      }
    }
  }
}
