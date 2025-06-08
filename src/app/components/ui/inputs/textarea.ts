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
    <div class="tw-relative tw-w-full">
      <!-- Label -->
      @if (label) {
        <label
          [for]="textareaId"
          [class]="labelClasses"
        >
          {{ label }}
          @if (required) {
            <span class="tw-text-coral-500 tw-ml-1">*</span>
          }
        </label>
      }

      <!-- Textarea Container -->
      <div class="tw-relative">
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
          <div class="tw-absolute tw-bottom-2 tw-right-3 tw-text-xs tw-text-gray-400 tw-bg-white tw-px-1">
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
      'tw-my-2',
      'tw-transition-colors'
    ];

    const variantClasses = {
      default: ['tw-text-emerald-green-700'],
      success: ['tw-text-success-600'],
      error: ['tw-text-coral-600'],
      info: ['tw-text-sky-blue-700']
    };

    return [
      ...baseClasses,
      ...variantClasses[this.variant]
    ].join(' ');
  }

  get textareaClasses(): string {
    const baseClasses = [
      'tw-block',
      'tw-w-full',
      'tw-border',
      'tw-rounded-lg',
      'tw-transition-colors',
      'tw-duration-200',
      // 'tw-font-medium',
      'placeholder:tw-text-gray-400',
      'focus:tw-outline-none',
      'focus:tw-ring-2',
      'focus:tw-ring-offset-1',
      'disabled:tw-bg-gray-50',
      'disabled:tw-text-gray-500',
      'disabled:tw-cursor-not-allowed',
      'readonly:tw-bg-gray-50',
      'readonly:tw-cursor-default'
    ];

    // Size classes
    const sizeClasses = {
      // sm: ['tw-px-3', 'tw-py-2', 'tw-text-sm'],
      // md: ['tw-px-4', 'tw-py-3', 'tw-text-base'],
      // lg: ['tw-px-5', 'tw-py-4', 'tw-text-lg']
      sm: ['tw-text-sm', 'tw-px-3', 'tw-py-2'],
      md: ['tw-text-md', 'tw-px-4', 'tw-py-3'],
      lg: ['tw-text-base', 'tw-px-5', 'tw-py-4']
    };

    // Variant classes
    const variantClasses = {
      default: [
        'tw-border-gray-300',
        'tw-bg-white',
        'tw-text-gray-900',
        'focus:tw-ring-emerald-green-500/20',
        'focus:tw-border-emerald-green-500',
        'hover:tw-border-emerald-green-400'
      ],
      success: [
        'tw-border-emerald-green-300',
        'tw-bg-white',
        'tw-text-gray-900',
        'focus:tw-ring-emerald-green-500/20',
        'focus:tw-ring-emerald-green-500',
        'focus:tw-border-emerald-green-500'
      ],
      error: [
        'tw-border-coral-500',
        'tw-bg-white',
        'tw-text-gray-900',
        'focus:tw-ring-coral-500/20',
        'focus:tw-ring-coral-500',
        'focus:tw-border-coral-500'
      ],
      info: [
        'tw-border-sky-blue-300',
        'tw-bg-white',
        'tw-text-gray-900',
        'focus:tw-ring-sky-blue-500/20',
        'focus:tw-ring-sky-blue-500',
        'focus:tw-border-sky-blue-500'
      ]
    };

    return [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...variantClasses[this.variant]
    ].join(' ');
  }

  get descriptionClasses(): string {
    const baseClasses = ['tw-mt-2', 'tw-text-xs'];

    const variantClasses = {
      default: ['tw-text-gray-600'],
      success: ['tw-text-emerald-green-600'],
      error: ['tw-text-coral-600'],
      info: ['tw-text-sky-blue-600']
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
