import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive' | 'gradient';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';
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
      <div *ngIf="hasHeader" [class]="headerClasses">
        <ng-content select="[slot=header]"></ng-content>
      </div>

      <!-- Media Section (for images, logos, etc.) -->
      <div *ngIf="hasMedia" [class]="mediaClasses">
        <ng-content select="[slot=media]"></ng-content>
      </div>

      <!-- Content Section -->
      <div [class]="contentClasses">
        <!-- Title -->
        <h3 *ngIf="title" [class]="titleClasses">
          {{ title }}
        </h3>

        <!-- Subtitle -->
        <p *ngIf="subtitle" [class]="subtitleClasses">
          {{ subtitle }}
        </p>

        <!-- Main Content -->
        <div [class]="bodyClasses">
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Footer Section -->
      <div *ngIf="hasFooter" [class]="footerClasses">
        <ng-content select="[slot=footer]"></ng-content>
      </div>

      <!-- Loading Overlay -->
      <div *ngIf="loading" [class]="loadingOverlayClasses">
        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-2">
          <svg class="tw-animate-spin tw-h-8 tw-w-8 tw-text-emerald-green-500" fill="none" viewBox="0 0 24 24">
            <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="tw-text-sm tw-text-gray-600">Cargando...</span>
        </div>
      </div>
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
      'tw-relative',
      'tw-bg-white',
      'tw-transition-all',
      'tw-duration-200',
      'tw-ease-in-out',
      'tw-overflow-hidden'
    ];

    // Size classes (affects overall dimensions)
    const sizeClasses = {
      sm: ['tw-max-w-sm'],
      md: ['tw-max-w-md'],
      lg: ['tw-max-w-lg'],
      xl: ['tw-max-w-xl']
    };

    // Border radius classes
    const radiusClasses = {
      none: ['tw-rounded-none'],
      sm: ['tw-rounded-sm'],
      md: ['tw-rounded-md'],
      lg: ['tw-rounded-lg'],
      xl: ['tw-rounded-xl']
    };

    // Variant classes
    const variantClasses = this.getVariantClasses();

    // Width classes
    const widthClasses = this.fullWidth ? ['tw-w-full'] : [];

    // Interactive classes
    const interactiveClasses = [];
    if (this.clickable && !this.disabled && !this.loading) {
      interactiveClasses.push(
        'tw-cursor-pointer',
        'focus:tw-outline-none',
        'focus:tw-ring-2',
        'focus:tw-ring-emerald-green-500',
        'focus:tw-ring-offset-2'
      );
    }

    // State classes
    const stateClasses = [];
    if (this.disabled) {
      stateClasses.push('tw-opacity-50', 'tw-cursor-not-allowed');
    }
    if (this.loading) {
      stateClasses.push('tw-pointer-events-none');
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
        'tw-border',
        'tw-border-gray-200',
        'tw-shadow-sm'
      ],
      elevated: [
        'tw-border',
        'tw-border-gray-100',
        'tw-shadow-lg',
        'tw-shadow-gray-200/50',
        ...(this.clickable ? [
          'hover:tw-shadow-xl',
          'hover:tw-shadow-gray-300/50',
          'hover:tw--translate-y-1'
        ] : [])
      ],
      outlined: [
        'tw-border-2',
        'tw-border-gray-300',
        ...(this.clickable ? [
          'hover:tw-border-emerald-green-400',
          'hover:tw-shadow-md'
        ] : [])
      ],
      interactive: [
        'tw-border',
        'tw-border-gray-200',
        'tw-shadow-md',
        ...(this.clickable ? [
          'hover:tw-shadow-lg',
          'hover:tw-shadow-emerald-green-500/20',
          'hover:tw-border-emerald-green-300',
          'hover:tw--translate-y-0.5',
          'active:tw-translate-y-0',
          'active:tw-shadow-md'
        ] : [])
      ],
      gradient: [
        'tw-border',
        'tw-border-transparent',
        'tw-bg-gradient-to-br',
        'tw-from-emerald-green-50',
        'tw-via-white',
        'tw-to-sky-blue-50',
        'tw-shadow-lg',
        'tw-shadow-emerald-green-500/10',
        ...(this.clickable ? [
          'hover:tw-shadow-xl',
          'hover:tw-shadow-emerald-green-500/20',
          'hover:tw--translate-y-1'
        ] : [])
      ]
    };

    return variantClasses[this.variant];
  }

  get headerClasses(): string {
    const baseClasses = [
      'tw-flex',
      'tw-items-center',
      'tw-justify-between',
      'tw-border-b',
      'tw-border-gray-100'
    ];

    const paddingClasses = this.getPaddingClasses();

    return [...baseClasses, ...paddingClasses].join(' ');
  }

  get mediaClasses(): string {
    return [
      'tw-w-full',
      'tw-overflow-hidden',
      'tw-bg-gray-50'
    ].join(' ');
  }

  get contentClasses(): string {
    const baseClasses = [
      'tw-flex',
      'tw-flex-col',
      'tw-flex-1'
    ];

    const paddingClasses = this.getPaddingClasses();

    return [...baseClasses, ...paddingClasses].join(' ');
  }

  get titleClasses(): string {
    const baseClasses = [
      'tw-text-lg',
      'tw-font-semibold',
      'tw-text-gray-900',
      'tw-mb-1',
      'tw-leading-tight'
    ];

    return baseClasses.join(' ');
  }

  get subtitleClasses(): string {
    const baseClasses = [
      'tw-text-sm',
      'tw-text-gray-600',
      'tw-mb-3',
      'tw-leading-relaxed'
    ];

    return baseClasses.join(' ');
  }

  get bodyClasses(): string {
    const baseClasses = [
      'tw-text-gray-700',
      'tw-text-sm',
      'tw-leading-relaxed'
    ];

    return baseClasses.join(' ');
  }

  get footerClasses(): string {
    const baseClasses = [
      'tw-flex',
      'tw-items-center',
      'tw-justify-between',
      'tw-border-t',
      'tw-border-gray-100',
      'tw-bg-gray-50/50'
    ];

    const paddingClasses = this.getPaddingClasses();

    return [...baseClasses, ...paddingClasses].join(' ');
  }

  get loadingOverlayClasses(): string {
    return [
      'tw-absolute',
      'tw-inset-0',
      'tw-bg-white/80',
      'tw-backdrop-blur-sm',
      'tw-flex',
      'tw-items-center',
      'tw-justify-center',
      'tw-z-10'
    ].join(' ');
  }

  private getPaddingClasses(): string[] {
    const paddingClasses = {
      none: [],
      sm: ['tw-p-3'],
      md: ['tw-p-4'],
      lg: ['tw-p-6']
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
