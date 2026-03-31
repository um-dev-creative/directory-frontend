import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextareaVariant = 'default' | 'success' | 'error' | 'info';
export type TextareaSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full">
      <!-- Label -->
      @if (label) {
        <label
          [for]="textareaId"
          [class]="labelClasses"
        >
          {{ label }}
          @if (required) {
            <span class="text-coral-500 ml-1">*</span>
          }
        </label>
      }

      <!-- Textarea Container -->
      <div class="relative">
        <!-- Textarea Field -->
        <textarea
          [id]="textareaId"
          [class]="textareaClasses"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [rows]="rows"
          [value]="value"
          [attr.aria-describedby]="helperText || errorMessage ? textareaId + '-description' : null"
          [attr.aria-invalid]="variant === 'error'"
          [style.resize]="resize ? 'vertical' : 'none'"
          [attr.maxlength]="maxLength"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        ></textarea>

        <!-- Character Count -->
        @if (showCharacterCount && maxLength) {
          <div class="absolute bottom-2 right-3 text-xs text-gray-400 bg-white px-1">
            {{ value.length }}/{{ maxLength }}
          </div>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText || errorMessage) {
        <div
          [id]="textareaId + '-description'"
          [class]="descriptionClasses"
        >
          {{ errorMessage || helperText }}
        </div>
      }
    </div>
  `,
  styles: []
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() helperText: string = '';
  @Input() errorMessage: string = '';
  @Input() variant: TextareaVariant = 'default';
  @Input() size: TextareaSize = 'md';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() rows: number = 4;
  @Input() resize: boolean = false;
  @Input() maxLength?: number;
  @Input() showCharacterCount: boolean = false;

  @Output() textareaChange = new EventEmitter<string>();
  @Output() textareaFocus = new EventEmitter<void>();
  @Output() textareaBlur = new EventEmitter<void>();

  value: string = '';
  textareaId: string = `textarea-${Math.random().toString(36).substr(2, 9)}`;

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

    return [
      ...baseClasses,
      ...variantClasses[this.variant]
    ].join(' ');
  }

  get textareaClasses(): string {
    const baseClasses = [
      'block',
      'w-full',
      'border',
      'rounded-lg',
      'transition-colors',
      'duration-200',
      // 'font-medium',
      'placeholder:text-gray-400',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1',
      'disabled:bg-gray-50',
      'disabled:text-gray-500',
      'disabled:cursor-not-allowed',
      'readonly:bg-gray-50',
      'readonly:cursor-default'
    ];

    // Size classes
    const sizeClasses = {
      // sm: ['px-3', 'py-2', 'text-sm'],
      // md: ['px-4', 'py-3', 'text-base'],
      // lg: ['px-5', 'py-4', 'text-lg']
      sm: ['text-sm', 'px-3', 'py-2'],
      md: ['text-md', 'px-4', 'py-3'],
      lg: ['text-base', 'px-5', 'py-4']
    };

    // Variant classes
    const variantClasses = {
      default: [
        'border-gray-300',
        'bg-white',
        'text-gray-900',
        'focus:ring-emerald-green-500/20',
        'focus:border-emerald-green-500',
        'hover:border-emerald-green-400'
      ],
      success: [
        'border-emerald-green-300',
        'bg-white',
        'text-gray-900',
        'focus:ring-emerald-green-500/20',
        'focus:ring-emerald-green-500',
        'focus:border-emerald-green-500'
      ],
      error: [
        'border-coral-500',
        'bg-white',
        'text-gray-900',
        'focus:ring-coral-500/20',
        'focus:ring-coral-500',
        'focus:border-coral-500'
      ],
      info: [
        'border-sky-blue-300',
        'bg-white',
        'text-gray-900',
        'focus:ring-sky-blue-500/20',
        'focus:ring-sky-blue-500',
        'focus:border-sky-blue-500'
      ]
    };

    return [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...variantClasses[this.variant]
    ].join(' ');
  }

  get descriptionClasses(): string {
    const baseClasses = ['mt-2', 'text-xs'];

    const variantClasses = {
      default: ['text-gray-600'],
      success: ['text-emerald-green-600'],
      error: ['text-coral-600'],
      info: ['text-sky-blue-600']
    };

    return [
      ...baseClasses,
      ...variantClasses[this.variant]
    ].join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
    this.textareaChange.emit(this.value);
  }

  onFocus(): void {
    this.textareaFocus.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.textareaBlur.emit();
  }
}
