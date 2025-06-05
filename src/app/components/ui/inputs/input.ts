import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputVariant = 'default' | 'success' | 'error' | 'info';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="tw-relative tw-w-full">
      <!-- Label -->
      <label
        *ngIf="label"
        [for]="inputId"
        [class]="labelClasses"
      >
        {{ label }}
        <span *ngIf="required" class="tw-text-coral-500 tw-ml-1">*</span>
      </label>

      <!-- Input Container -->
      <div class="tw-relative">
        <!-- Leading Icon -->
        <div
          *ngIf="leadingIcon"
          class="tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-pointer-events-none"
        >
          <ng-content select="[slot=leading-icon]"></ng-content>
        </div>

        <!-- Input Field -->
        <input
          [id]="inputId"
          [type]="type"
          [class]="inputClasses"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [attr.aria-describedby]="helperText || errorMessage ? inputId + '-description' : null"
          [attr.aria-invalid]="variant === 'error'"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />

        <!-- Trailing Icon -->
        <div
          *ngIf="trailingIcon"
          class="tw-absolute tw-right-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-pointer-events-none"
        >
          <ng-content select="[slot=trailing-icon]"></ng-content>
        </div>

        <!-- Clear Button -->
        <button
          *ngIf="clearable && value && !disabled && !readonly"
          type="button"
          class="tw-absolute tw-right-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors"
          (click)="clearValue()"
          [attr.aria-label]="'Clear ' + (label || 'input')"
        >
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Helper Text / Error Message -->
      <div
        *ngIf="helperText || errorMessage"
        [id]="inputId + '-description'"
        [class]="descriptionClasses"
      >
        {{ errorMessage || helperText }}
      </div>
    </div>
  `,
  styles: []
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() helperText: string = '';
  @Input() errorMessage: string = '';
  @Input() type: InputType = 'text';
  @Input() variant: InputVariant = 'default';
  @Input() size: InputSize = 'md';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() clearable: boolean = false;
  @Input() leadingIcon: boolean = false;
  @Input() trailingIcon: boolean = false;
  @Input() fullWidth: boolean = true;

  @Output() inputChange = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();

  value: string = '';
  inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get labelClasses(): string {
    const baseClasses = [
      'tw-block',
      'tw-text-sm',
      'tw-font-medium',
      'tw-mb-2',
      'tw-transition-colors'
    ];

    const variantClasses = {
      default: ['tw-text-gray-700'],
      success: ['tw-text-emerald-green-700'],
      error: ['tw-text-coral-600'],
      info: ['tw-text-sky-blue-700']
    };

    return [...baseClasses, ...variantClasses[this.variant]].join(' ');
  }

  get inputClasses(): string {
    const baseClasses = [
      'tw-w-full',
      'tw-border',
      'tw-rounded-lg',
      'tw-transition-all',
      'tw-duration-200',
      'tw-ease-in-out',
      'focus:tw-outline-none',
      'focus:tw-ring-2',
      'focus:tw-ring-offset-1',
      'disabled:tw-opacity-50',
      'disabled:tw-cursor-not-allowed',
      'disabled:tw-bg-gray-50',
      'readonly:tw-bg-gray-50',
      'readonly:tw-cursor-default'
    ];

    // Size classes
    const sizeClasses = {
      sm: ['tw-text-sm', 'tw-px-3', 'tw-py-2', 'tw-h-9'],
      md: ['tw-text-sm', 'tw-px-4', 'tw-py-3', 'tw-h-11'],
      lg: ['tw-text-base', 'tw-px-5', 'tw-py-4', 'tw-h-13']
    };

    // Variant classes
    const variantClasses = {
      default: [
        'tw-border-gray-300',
        'tw-bg-white',
        'tw-text-gray-900',
        'placeholder:tw-text-gray-500',
        'hover:tw-border-emerald-green-400',
        'focus:tw-border-emerald-green-500',
        'focus:tw-ring-emerald-green-500/20'
      ],
      success: [
        'tw-border-emerald-green-500',
        'tw-bg-white',
        'tw-text-gray-900',
        'placeholder:tw-text-gray-500',
        'focus:tw-border-emerald-green-600',
        'focus:tw-ring-emerald-green-500/20'
      ],
      error: [
        'tw-border-coral-500',
        'tw-bg-white',
        'tw-text-gray-900',
        'placeholder:tw-text-gray-500',
        'focus:tw-border-coral-600',
        'focus:tw-ring-coral-500/20'
      ],
      info: [
        'tw-border-sky-blue-400',
        'tw-bg-white',
        'tw-text-gray-900',
        'placeholder:tw-text-gray-500',
        'focus:tw-border-sky-blue-500',
        'focus:tw-ring-sky-blue-500/20'
      ]
    };

    // Icon padding adjustments
    const iconClasses = [];
    if (this.leadingIcon) {
      iconClasses.push('tw-pl-10');
    }
    if (this.trailingIcon || this.clearable) {
      iconClasses.push('tw-pr-10');
    }

    // Full width class
    const widthClasses = this.fullWidth ? ['tw-w-full'] : ['tw-w-auto'];

    return [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...variantClasses[this.variant],
      ...iconClasses,
      ...widthClasses
    ].join(' ');
  }

  get descriptionClasses(): string {
    const baseClasses = [
      'tw-mt-2',
      'tw-text-xs',
      'tw-transition-colors'
    ];

    const variantClasses = {
      default: ['tw-text-gray-600'],
      success: ['tw-text-emerald-green-600'],
      error: ['tw-text-coral-600'],
      info: ['tw-text-sky-blue-600']
    };

    return [...baseClasses, ...variantClasses[this.variant]].join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onFocus(): void {
    this.inputFocus.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
  }

  clearValue(): void {
    this.value = '';
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }
}
