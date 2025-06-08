import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export type SelectVariant = 'default' | 'success' | 'error' | 'info';
export type SelectSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="tw-relative tw-w-full">
      <!-- Label -->
      @if (label) {
        <label
          [for]="selectId"
          [class]="labelClasses"
        >
          {{ label }}
          @if (required) {
            <span class="tw-text-coral-500 tw-ml-1">*</span>
          }
        </label>
      }

      <!-- Select Container -->
      <div class="tw-relative">
        <!-- Select Button -->
        <button
          #selectButton
          type="button"
          [id]="selectId"
          [class]="selectClasses"
          [disabled]="disabled"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-expanded]="isOpen"
          [attr.aria-labelledby]="label ? selectId + '-label' : null"
          [attr.aria-describedby]="helperText || errorMessage ? selectId + '-description' : null"
          [attr.aria-invalid]="variant === 'error'"
          (click)="toggle()"
        >
          <span [class]="valueClasses">
            <span class="tw-block tw-truncate">
              {{ selectedOption?.label || placeholder }}
            </span>
          </span>

          <!-- Chevron Icon -->
          <svg
            class="tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-size-5 tw-text-gray-400 tw-transition-transform tw-duration-200"
            [class.tw-rotate-180]="isOpen"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Dropdown List -->
        @if (isOpen) {
          <ul
            #optionsList
            [class]="dropdownClasses"
            role="listbox"
            [attr.aria-labelledby]="selectId"
            tabindex="-1"
          >
            @for (option of options; track option.value) {
              <li
                [class]="getOptionClasses(option)"
                [attr.aria-selected]="isSelected(option)"
                [attr.aria-disabled]="option.disabled"
                role="option"
                (click)="selectOption(option)"
              >
                <div class="tw-flex tw-items-center">
                  <span class="tw-block tw-truncate tw-font-normal">
                    {{ option.label }}
                  </span>

                  <!-- Check icon for selected option -->
                  @if (isSelected(option)) {
                    <svg
                      class="tw-ml-auto tw-size-4 tw-text-emerald-green-600"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  }
                </div>
              </li>
            }
          </ul>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText || errorMessage) {
        <div
          [id]="selectId + '-description'"
          [class]="descriptionClasses"
        >
          {{ errorMessage || helperText }}
        </div>
      }
    </div>
  `,
  styles: []
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild('selectButton') selectButton!: ElementRef;
  @ViewChild('optionsList') optionsList!: ElementRef;

  @Input() label: string = '';
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() helperText: string = '';
  @Input() errorMessage: string = '';
  @Input() variant: SelectVariant = 'default';
  @Input() size: SelectSize = 'md';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() options: SelectOption[] = [];

  @Output() selectChange = new EventEmitter<any>();
  @Output() selectFocus = new EventEmitter<void>();
  @Output() selectBlur = new EventEmitter<void>();

  value: any = null;
  isOpen: boolean = false;
  selectId: string = `select-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get selectedOption(): SelectOption | undefined {
    return this.options.find(option => option.value === this.value);
  }

  toggle(): void {
    if (this.disabled) return;

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled) return;

    this.isOpen = true;
    this.selectFocus.emit();

    // Focus management
    setTimeout(() => {
      if (this.optionsList?.nativeElement) {
        this.optionsList.nativeElement.focus();
      }
    });
  }

  close(): void {
    this.isOpen = false;
    this.onTouched();
    this.selectBlur.emit();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.value = option.value;
    this.onChange(this.value);
    this.selectChange.emit(this.value);
    this.close();
  }

  isSelected(option: SelectOption): boolean {
    return option.value === this.value;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.open();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (this.isOpen) {
          this.navigateOptions(1);
        } else {
          this.open();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.navigateOptions(-1);
        } else {
          this.open();
        }
        break;
    }
  }

  private navigateOptions(direction: number): void {
    const currentIndex = this.options.findIndex(option => option.value === this.value);
    let nextIndex = currentIndex + direction;

    // Skip disabled options
    while (nextIndex >= 0 && nextIndex < this.options.length && this.options[nextIndex].disabled) {
      nextIndex += direction;
    }

    if (nextIndex >= 0 && nextIndex < this.options.length) {
      this.selectOption(this.options[nextIndex]);
    }
  }

  // Computed classes
  get labelClasses(): string {
    const base = 'tw-block tw-text-sm tw-font-medium tw-my-2';

    const variantClasses = {
      default: 'tw-text-emerald-green-700',
      success: 'tw-text-success-600',
      error: 'tw-text-alert-600',
      info: 'tw-text-info-600'
    };

    return `${base} ${variantClasses[this.variant]}`;
  }

  get selectClasses(): string {
    const base = 'tw-relative tw-w-full tw-rounded-lg tw-bg-white tw-text-left tw-transition-all tw-duration-200 focus:tw-outline-none';

    const sizeClasses = {
      sm: 'tw-h-9 tw-px-3 tw-text-sm',
      md: 'tw-h-11 tw-px-4 tw-text-base',
      lg: 'tw-h-12 tw-px-4 tw-text-lg'
      // sm: 'tw-h-9 tw-px-3 tw-text-sm',
      // md: 'tw-h-11 tw-px-4 tw-text-md',
      // lg: 'tw-h-13 tw-px-5 tw-text-base'
    };

    const variantClasses = {
      default: 'tw-border tw-border-gray-300 hover:tw-border-emerald-green-400 focus:tw-border-emerald-green-500 focus:tw-ring-2 focus:tw-ring-offset-1 focus:tw-ring-emerald-green-500/20',
      success: 'tw-border-2 tw-border-success-500 tw-bg-success-50 focus:tw-border-success-600 focus:tw-ring-2 focus:tw-ring-offset-1  focus:tw-ring-success-500/20',
      // error: 'tw-border-2 tw-border-alert-500 tw-bg-alert-50 focus:tw-border-alert-600 focus:tw-ring-2 focus:tw-ring-alert-500/20',
      error: 'tw-border-2 tw-border-coral-600 tw-bg-coral-50 focus:tw-border-coral-600 focus:tw-ring-2 focus:tw-ring-offset-1  focus:tw-ring-coral-500/20',
      info: 'tw-border-2 tw-border-info-500 tw-bg-info-50 focus:tw-border-info-600 focus:tw-ring-2 focus:tw-ring-offset-1 focus:tw-ring-info-500/20'
    };

    const disabledClasses = this.disabled
      ? 'tw-opacity-50 tw-cursor-not-allowed tw-bg-gray-100'
      : 'tw-cursor-pointer';

    return `${base} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${disabledClasses}`;
  }

  get valueClasses(): string {
    const base = 'tw-flex tw-items-center tw-pr-8 tw-truncate';

    const colorClasses = this.selectedOption
      ? 'tw-text-emerald-green-900'
      : 'tw-text-gray-400';

    return `${base} ${colorClasses}`;
  }

  get dropdownClasses(): string {
    return 'tw-absolute tw-z-50 tw-mt-1 tw-max-h-56 tw-w-full tw-overflow-auto tw-rounded-lg tw-bg-white tw-py-1 tw-shadow-xl tw-ring-1 tw-ring-gray-200 focus:tw-outline-none';
  }

  getOptionClasses(option: SelectOption): string {
    const base = 'tw-relative tw-cursor-pointer tw-select-none tw-py-2 tw-px-3 tw-text-emerald-green-900 tw-transition-colors';

    const stateClasses = option.disabled
      ? 'tw-opacity-50 tw-cursor-not-allowed'
      : 'hover:tw-bg-emerald-green-50 hover:tw-text-emerald-green-700';

    const selectedClasses = this.isSelected(option)
      ? 'tw-bg-emerald-green-100 tw-text-emerald-green-800 tw-font-medium'
      : '';

    return `${base} ${stateClasses} ${selectedClasses}`;
  }

  get descriptionClasses(): string {
    const base = 'tw-text-sm tw-my-1';

    const variantClasses = {
      default: 'tw-text-gray-600',
      success: 'tw-text-success-600',
      error: 'tw-text-coral-600',
      info: 'tw-text-info-600'
    };

    return `${base} ${variantClasses[this.variant]}`;
  }
}
