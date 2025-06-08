import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'centered' | 'wide' | 'fullscreen' | 'drawer';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Backdrop -->
    @if (open) {
      <div
        class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/40 tw-backdrop-blur-sm tw-transition-opacity tw-duration-300"
        (click)="onBackdropClick($event)"
        [attr.aria-modal]="true"
        [attr.role]="'dialog'"
        [attr.aria-label]="ariaLabel"
      >
        <!-- Modal Dialog -->
        <div
          #modalDialog
          [class]="modalClasses"
          tabindex="-1"
          (keydown)="onKeyDown($event)"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          @if (hasHeader) {
            <div [class]="headerClasses">
              <div class="tw-flex-1">
                <ng-content select="[slot=header]"></ng-content>
              </div>
              @if (!disableClose) {
                <button
                  class="tw-ml-4 tw-p-1 tw-text-beige-500 hover:tw-text-coral-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-emerald-green-500 focus:tw-ring-offset-2 tw-rounded-md tw-transition-colors"
                  (click)="close()"
                  aria-label="Cerrar modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div [class]="contentClasses" [style.max-height]="maxContentHeight">
            <ng-content select="[slot=content],:not([slot])"></ng-content>
          </div>

          <!-- Footer -->
          @if (hasFooter) {
            <div [class]="footerClasses">
              <ng-content select="[slot=footer]"></ng-content>
            </div>
          }

          <!-- Loading Overlay -->
          @if (loading) {
            <div class="tw-absolute tw-inset-0 tw-bg-white/80 tw-backdrop-blur-sm tw-flex tw-items-center tw-justify-center tw-z-10">
              <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-2">
                <svg class="tw-animate-spin tw-h-8 tw-w-8 tw-text-emerald-green-500" fill="none" viewBox="0 0 24 24">
                  <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="tw-text-sm tw-text-gray-600">Cargando...</span>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: []
})
export class ModalComponent implements AfterViewInit, OnChanges {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() size: ModalSize = 'md';
  @Input() variant: ModalVariant = 'centered';

  @Input() hasHeader = false;
  @Input() hasFooter = false;
  @Input() loading = false;

  @Input() disableClose = false;
  @Input() closeOnEsc = true;
  @Input() closeOnBackdrop = true;

  @Input() ariaLabel = 'Modal';

  @Output() modalOpen = new EventEmitter<void>();
  @Output() modalClose = new EventEmitter<void>();

  @ViewChild('modalDialog') modalDialog!: ElementRef;

  get modalClasses(): string {
    const baseClasses = [
      'tw-bg-white',
      'tw-shadow-2xl',
      'tw-transition-all',
      'tw-duration-300',
      'tw-ease-out',
      'tw-outline-none',
      'tw-flex',
      'tw-flex-col',
      'tw-relative',
      'tw-overflow-hidden'
    ];

    // Size classes
    const sizeClasses = {
      xs: ['tw-w-80', 'tw-max-h-[80vh]'],
      sm: ['tw-w-96', 'tw-max-h-[80vh]'],
      md: ['tw-w-[32rem]', 'tw-max-h-[85vh]'],
      lg: ['tw-w-[40rem]', 'tw-max-h-[90vh]'],
      xl: ['tw-w-[56rem]', 'tw-max-h-[90vh]'],
      full: ['tw-w-screen', 'tw-h-screen']
    };

    // Variant-specific classes
    const variantClasses = {
      centered: ['tw-rounded-xl', 'tw-mx-4'],
      wide: ['tw-rounded-xl', 'tw-mx-4', 'tw-w-[90vw]', 'md:tw-w-[70vw]', 'lg:tw-w-[60vw]'],
      fullscreen: ['tw-w-screen', 'tw-h-screen', 'tw-rounded-none', 'tw-mx-0'],
      drawer: [
        'tw-absolute',
        'tw-right-0',
        'tw-top-0',
        'tw-h-full',
        'tw-w-full',
        'sm:tw-w-[28rem]',
        'tw-rounded-l-xl',
        'tw-rounded-r-none',
        'tw-shadow-xl'
      ]
    };

    return [
      ...baseClasses,
      ...(this.variant !== 'wide' ? sizeClasses[this.size] : []),
      ...variantClasses[this.variant]
    ].filter(Boolean).join(' ');
  }

  get headerClasses(): string {
    return [
      'tw-flex',
      'tw-items-center',
      'tw-justify-between',
      'tw-px-6',
      'tw-pt-6',
      'tw-pb-4',
      'tw-border-b',
      'tw-border-beige-200',
      'tw-bg-beige-50/30'
    ].join(' ');
  }

  get contentClasses(): string {
    return [
      'tw-flex-1',
      'tw-px-6',
      'tw-py-4',
      'tw-overflow-y-auto',
      'tw-overflow-x-hidden'
    ].join(' ');
  }

  get footerClasses(): string {
    return [
      'tw-flex',
      'tw-items-center',
      'tw-justify-end',
      'tw-gap-3',
      'tw-px-6',
      'tw-pb-6',
      'tw-pt-4',
      'tw-border-t',
      'tw-border-beige-200',
      'tw-bg-beige-50/30'
    ].join(' ');
  }

  get maxContentHeight(): string {
    if (this.variant === 'fullscreen' || this.size === 'full') {
      return 'calc(100vh - 200px)';
    }
    return '60vh';
  }

  ngAfterViewInit() {
    if (this.open) {
      this.focusModal();
    }
  }

  ngOnChanges() {
    if (this.open) {
      setTimeout(() => this.focusModal(), 100);
      this.modalOpen.emit();
    } else {
      this.modalClose.emit();
    }
  }

  private focusModal() {
    if (this.modalDialog?.nativeElement) {
      this.modalDialog.nativeElement.focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent) {
    if (this.open && this.closeOnEsc && !this.disableClose && event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // Focus trap: mantener el foco dentro del modal
    if (event.key === 'Tab') {
      const focusableElements = this.modalDialog.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdrop && !this.disableClose) {
      this.close();
    }
  }

  close() {
    if (!this.disableClose && !this.loading) {
      this.open = false;
      this.openChange.emit(false);
    }
  }

  openModal() {
    this.open = true;
    this.openChange.emit(true);
  }
}
