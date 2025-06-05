import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'solid-outline' | 'ghost' | 'alert' | 'success' | 'info' | 'alert-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [type]="type"
      (click)="handleClick($event)"
    >
      <!-- Loading Spinner -->
      <svg
        *ngIf="loading"
        class="tw-animate-spin tw--ml-1 tw-mr-2 tw-h-4 tw-w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="tw-opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="tw-opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <!-- Button Content -->
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;

  @Output() buttonClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = [
      'tw-font-bold',
      'tw-inline-flex',
      'tw-items-center',
      'tw-justify-center',
      'tw-rounded-full',
      'tw-transition-all',
      'tw-duration-300',
      'tw-ease-in-out',
      'tw-whitespace-nowrap',
      'tw-border',
      // Border transparency is variant-specific
      'focus:tw-outline-none',
      // 'focus:tw-ring-2',
      // 'focus:tw-ring-offset-2',
      'disabled:tw-opacity-50',
      'disabled:tw-cursor-not-allowed',
      'disabled:tw-transform-none'
    ];

    // Size classes
    const sizeClasses = {
      sm: ['tw-text-xs', 'tw-px-3', 'tw-py-1.5', 'tw-h-8', 'tw-min-w-[80px]'],
      md: ['tw-text-sm', 'tw-px-4', 'tw-py-2', 'tw-h-10', 'tw-min-w-[100px]'],
      lg: ['tw-text-base', 'tw-px-6', 'tw-py-3', 'tw-h-12', 'tw-min-w-[120px]']
    };

    // Variant classes using brand colors
    const variantClasses = {
      primary: [
        'tw-bg-emerald-green-500',
        'tw-text-white',
        'tw-border-transparent',
        'tw-shadow-lg',
        'tw-shadow-emerald-green-500/40',
        'hover:tw-bg-emerald-green-600',
        'hover:tw-scale-105',
        'hover:tw-shadow-emerald-green-600/50',
        // 'focus:tw-ring-emerald-green-500',
        'active:tw-bg-emerald-green-700',
        'active:tw-scale-95'
      ],
      secondary: [
        'tw-bg-sky-blue-500',
        'tw-text-white',
        'tw-border-transparent',
        'tw-shadow-lg',
        'tw-shadow-sky-blue-500/40',
        'hover:tw-bg-sky-blue-600',
        'hover:tw-scale-105',
        'hover:tw-shadow-sky-blue-600/50',
        // 'focus:tw-ring-sky-blue-500',
        'active:tw-bg-sky-blue-700',
        'active:tw-scale-95'
      ],
      outline: [
        'tw-bg-transparent',
        'tw-text-emerald-green-600',
        'tw-border-emerald-green-500',
        'tw-border-2',
        'hover:tw-bg-emerald-green-50',
        'hover:tw-text-emerald-green-700',
        'hover:tw-scale-105',
        // 'focus:tw-ring-emerald-green-500',
        'active:tw-bg-emerald-green-100',
        'active:tw-scale-95'
      ],
      'solid-outline': [
        'tw-bg-transparent',
        'tw-text-emerald-green-600',
        'tw-border-emerald-green-500',
        'tw-border-2',
        'hover:tw-bg-emerald-green-500',
        'hover:tw-text-white',
        'hover:tw-scale-105',
        // 'focus:tw-ring-emerald-green-500',
        'active:tw-bg-emerald-green-600',
        'active:tw-scale-95'
      ],
      ghost: [
        'tw-bg-transparent',
        'tw-text-emerald-green-600',
        'tw-border-transparent',
        'hover:tw-bg-emerald-green-50',
        'hover:tw-text-emerald-green-700',
        'hover:tw-scale-105',
        'focus:tw-ring-emerald-green-500',
        'active:tw-bg-emerald-green-100',
        'active:tw-scale-95'
      ],
      alert: [
        'tw-bg-coral-500',
        'tw-text-white',
        'tw-border-transparent',
        'tw-shadow-lg',
        'tw-shadow-coral-500/40',
        'hover:tw-bg-coral-600',
        'hover:tw-scale-105',
        'hover:tw-shadow-coral-600/50',
        // 'focus:tw-ring-coral-500',
        'active:tw-bg-coral-700',
        'active:tw-scale-95'
      ],
      'alert-outline': [
        'tw-bg-transparent',
        'tw-text-coral-600',
        'tw-border-coral-500',
        'tw-border-2',
        'hover:tw-bg-coral-50',
        'hover:tw-text-coral-700',
        'hover:tw-scale-105',
        // 'focus:tw-ring-coral-500',
        'active:tw-bg-coral-100',
        'active:tw-scale-95'
      ],
      success: [
        'tw-bg-emerald-green-600',
        'tw-text-white',
        'tw-border-transparent',
        'tw-shadow-lg',
        'tw-shadow-emerald-green-600/40',
        'hover:tw-bg-emerald-green-700',
        'hover:tw-scale-105',
        'hover:tw-shadow-emerald-green-700/50',
        // 'focus:tw-ring-emerald-green-600',
        'active:tw-bg-emerald-green-800',
        'active:tw-scale-95'
      ],
      info: [
        'tw-bg-sky-blue-600',
        'tw-text-white',
        'tw-border-transparent',
        'tw-shadow-lg',
        'tw-shadow-sky-blue-600/40',
        'hover:tw-bg-sky-blue-700',
        'hover:tw-scale-105',
        'hover:tw-shadow-sky-blue-700/50',
        // 'focus:tw-ring-sky-blue-600',
        'active:tw-bg-sky-blue-800',
        'active:tw-scale-95'
      ]
    };

    // Full width class
    const widthClasses = this.fullWidth ? ['tw-w-full'] : [];

    // Combine all classes
    const allClasses = [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...variantClasses[this.variant],
      ...widthClasses
    ];

    return allClasses.join(' ');
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
