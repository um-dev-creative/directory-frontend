import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputVariant = 'default' | 'success' | 'error' | 'info';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'time';

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
    <div class="relative w-full">
      <!-- Label -->
      @if (label) {
        <label
          [for]="inputId"
          [class]="labelClasses"
        >
          {{ label }}
          @if (required) {
            <span class="text-coral-500 ml-1">*</span>
          }
        </label>
      }

      <!-- Input Container -->
      <div class="relative">
        <!-- Leading Icon -->
        @if (leadingIcon) {
          <div
            class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            <ng-content select="[slot=leading-icon]"></ng-content>
          </div>
        }

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
          [attr.maxlength]="maxLength"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />

        <!-- Character Count Inside Input -->
        @if (showCharacterCount && maxLength) {
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {{ characterCountDisplay }}
          </div>
        }

        <!-- Trailing Icon -->
        @if (trailingIcon) {
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            <ng-content select="[slot=trailing-icon]"></ng-content>
          </div>
        }

        <!-- Clear Button -->
        @if (clearable && value && !disabled && !readonly) {
          <button
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            (click)="clearValue()"
            [attr.aria-label]="'Clear ' + (label || 'input')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText || errorMessage) {
        <div
          [id]="inputId + '-description'"
          [class]="descriptionClasses"
        >
          {{ errorMessage || helperText }}
        </div>
      }
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
  @Input() maxLength?: number;
  @Input() showCharacterCount: boolean = false;

  @Output() inputChange = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();

  value: string = '';
  inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor implementation
  private onChange = (_value: string) => {};
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
      'block',
      'text-sm',
      'font-medium',
      'my-2',
      'transition-colors'
    ];

    const variantClasses = {
      default: ['text-emerald-green-700'],
      success: ['text-success-600'],
      error: ['text-coral-600'],
      info: ['text-sky-blue-700']
    };

    return [...baseClasses, ...variantClasses[this.variant]].join(' ');
  }

  get inputClasses(): string {
    const baseClasses = [
      'w-full',
      'border',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'placeholder:text-gray-400',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:bg-gray-50',
      'readonly:bg-gray-50',
      'readonly:cursor-default'
    ];

    // Size classes
    const sizeClasses = {
      sm: ['text-sm', 'px-3', 'py-2', 'h-9'],
      md: ['text-md', 'px-4', 'py-3', 'h-11'],
      lg: ['text-base', 'px-5', 'py-4', 'h-13']
    };

    // Variant classes
    const variantClasses = {
      default: [
        'border-gray-300',
        'bg-white',
        'text-gray-900',
        'hover:border-emerald-green-400',
        'focus:border-emerald-green-500',
        'focus:ring-emerald-green-500/20'
      ],
      success: [
        'border-emerald-green-500',
        'bg-white',
        'text-gray-900',
        'focus:border-emerald-green-600',
        'focus:ring-emerald-green-500/20'
      ],
      error: [
        'border-coral-500',
        'bg-white',
        'text-gray-900',
        'focus:border-coral-600',
        'focus:ring-coral-500/20'
      ],
      info: [
        'border-sky-blue-400',
        'bg-white',
        'text-gray-900',
        'focus:border-sky-blue-500',
        'focus:ring-sky-blue-500/20'
      ]
    };

    // Icon padding adjustments
    const iconClasses = [];
    if (this.leadingIcon) {
      iconClasses.push('pl-10');
    }
    if (this.trailingIcon || this.clearable || (this.showCharacterCount && this.maxLength)) {
      iconClasses.push('pr-10');
    }

    // Full width class
    const widthClasses = this.fullWidth ? ['w-full'] : ['w-auto'];

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
      'mt-2',
      'text-xs',
      'transition-colors'
    ];

    const variantClasses = {
      default: ['text-gray-600'],
      success: ['text-emerald-green-600'],
      error: ['text-coral-600'],
      info: ['text-sky-blue-600']
    };

    return [...baseClasses, ...variantClasses[this.variant]].join(' ');
  }

  get characterCountDisplay(): string {
    const currentLength = this.value?.length || 0;
    return `${currentLength}/${this.maxLength}`;
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
