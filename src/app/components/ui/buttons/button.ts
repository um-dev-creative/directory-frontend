import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'solid-outline' | 'ghost' | 'ghost-alert'| 'alert' | 'success' | 'info' | 'alert-outline' | 'contrast-light' | 'contrast-outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

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
      @if (loading) {
        <svg
          class="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      }

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
      'font-bold',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'whitespace-nowrap',
      'border',
      // Border transparency is variant-specific
      'focus:outline-none',
      // 'focus:ring-2',
      // 'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:transform-none',
      'cursor-pointer'
    ];

    // Size classes
    const sizeClasses = {
      sm: ['text-xs', 'px-3', 'py-1.5', 'h-8', 'min-w-[80px]'],
      md: ['text-sm', 'px-4', 'py-2', 'h-10', 'min-w-[100px]'],
      lg: ['text-base', 'px-6', 'py-3', 'h-12', 'min-w-[120px]'],
      xl: ['text-base', 'px-8', 'py-4', 'h-12', 'min-w-[180px]'],
      xxl: ['text-base', 'px-8', 'py-4', 'h-12', 'min-w-[280px]']
    };

    // Variant classes using brand colors
    const variantClasses = {
      primary: [
        'bg-emerald-green-500',
        'text-white',
        'border-transparent',
        'shadow-lg',
        'shadow-emerald-green-500/40',
        'hover:bg-emerald-green-600',
        'hover:scale-105',
        'hover:shadow-emerald-green-600/50',
        // 'focus:ring-emerald-green-500',
        'active:bg-emerald-green-700',
        'active:scale-95'
      ],
      secondary: [
        'bg-sky-blue-500',
        'text-white',
        'border-transparent',
        'shadow-lg',
        'shadow-sky-blue-500/40',
        'hover:bg-sky-blue-600',
        'hover:scale-105',
        'hover:shadow-sky-blue-600/50',
        // 'focus:ring-sky-blue-500',
        'active:bg-sky-blue-700',
        'active:scale-95'
      ],
      outline: [
        'bg-transparent',
        'text-emerald-green-600',
        'border-emerald-green-500',
        'border-2',
        'hover:bg-emerald-green-50',
        'hover:text-emerald-green-700',
        'hover:scale-105',
        // 'focus:ring-emerald-green-500',
        'active:bg-emerald-green-100',
        'active:scale-95'
      ],
      'solid-outline': [
        'bg-transparent',
        'text-emerald-green-600',
        'border-emerald-green-500',
        'border-2',
        'hover:bg-emerald-green-500',
        'hover:text-white',
        'hover:scale-105',
        // 'focus:ring-emerald-green-500',
        'active:bg-emerald-green-600',
        'active:scale-95'
      ],
      ghost: [
        'bg-transparent',
        'text-emerald-green-600',
        'border-transparent',
        'hover:bg-emerald-green-50',
        'hover:text-emerald-green-700',
        'hover:scale-105',
        'focus:ring-emerald-green-500',
        'active:bg-emerald-green-100',
        'active:scale-95'
      ],
      alert: [
        'bg-coral-500',
        'text-white',
        'border-transparent',
        'shadow-lg',
        'shadow-coral-500/40',
        'hover:bg-coral-600',
        'hover:scale-105',
        'hover:shadow-coral-600/50',
        // 'focus:ring-coral-500',
        'active:bg-coral-700',
        'active:scale-95'
      ],
      'ghost-alert': [
        'bg-transparent',
        'text-coral-600',
        'border-transparent',
        'hover:bg-coral-50',
        'hover:text-coral-700',
        'hover:scale-105',
        'focus:ring-coral-500',
        'active:bg-coral-100',
        'active:scale-95'],
      'alert-outline': [
        'bg-transparent',
        'text-coral-600',
        'border-coral-500',
        'border-2',
        'hover:bg-coral-50',
        'hover:text-coral-700',
        'hover:scale-105',
        // 'focus:ring-coral-500',
        'active:bg-coral-100',
        'active:scale-95'
      ],
      success: [
        'bg-emerald-green-600',
        'text-white',
        'border-transparent',
        'shadow-lg',
        'shadow-emerald-green-600/40',
        'hover:bg-emerald-green-700',
        'hover:scale-105',
        'hover:shadow-emerald-green-700/50',
        // 'focus:ring-emerald-green-600',
        'active:bg-emerald-green-800',
        'active:scale-95'
      ],
      info: [
        'bg-sky-blue-600',
        'text-white',
        'border-transparent',
        'shadow-lg',
        'shadow-sky-blue-600/40',
        'hover:bg-sky-blue-700',
        'hover:scale-105',
        'hover:shadow-sky-blue-700/50',
        // 'focus:ring-sky-blue-600',
        'active:bg-sky-blue-800',
        'active:scale-95'
      ],
      'contrast-light': [
        'bg-white',
        'text-emerald-green-600',
        'border-transparent',
        'shadow-lg',
        'font-bold',
        'hover:bg-gray-100',
        'hover:scale-105',
        'transition-all',
        'active:bg-gray-200',
        'active:scale-95'
      ],
      'contrast-outline': [
        'bg-transparent',
        'text-white',
        'border-white',
        'border-2',
        'font-bold',
        'hover:bg-white',
        'hover:text-emerald-green-600',
        'transition-all',
        'active:bg-gray-100',
        'active:scale-95'
      ]
    };

    // Full width class
    const widthClasses = this.fullWidth ? ['w-full'] : [];

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
