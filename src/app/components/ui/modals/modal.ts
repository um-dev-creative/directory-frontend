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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
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
              <div class="flex-1">
                <ng-content select="[slot=header]"></ng-content>
              </div>
              @if (!disableClose) {
                <button
                  class="ml-4 p-1 text-beige-500 hover:text-coral-500 focus:outline-none focus:ring-2 focus:ring-emerald-green-500 focus:ring-offset-2 rounded-md transition-colors"
                  (click)="close()"
                  aria-label="Cerrar modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
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
      'bg-white',
      'shadow-2xl',
      'transition-all',
      'duration-300',
      'ease-out',
      'outline-none',
      'flex',
      'flex-col',
      'relative',
      'overflow-hidden'
    ];

    // Size classes
    const sizeClasses = {
      xs: ['w-80', 'max-h-[80vh]'],
      sm: ['w-96', 'max-h-[80vh]'],
      md: ['w-[32rem]', 'max-h-[85vh]'],
      lg: ['w-[40rem]', 'max-h-[90vh]'],
      xl: ['w-[56rem]', 'max-h-[90vh]'],
      full: ['w-screen', 'h-screen']
    };

    // Variant-specific classes
    const variantClasses = {
      centered: ['rounded-xl', 'mx-4'],
      wide: ['rounded-xl', 'mx-4', 'w-[90vw]', 'md:w-[70vw]', 'lg:w-[60vw]'],
      fullscreen: ['w-screen', 'h-screen', 'rounded-none', 'mx-0'],
      drawer: [
        'absolute',
        'right-0',
        'top-0',
        'h-full',
        'w-full',
        'sm:w-[28rem]',
        'rounded-l-xl',
        'rounded-r-none',
        'shadow-xl'
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
      'flex',
      'items-center',
      'justify-between',
      'px-6',
      'pt-6',
      'pb-4',
      'border-b',
      'border-beige-200',
      'bg-beige-50/30'
    ].join(' ');
  }

  get contentClasses(): string {
    return [
      'flex-1',
      'px-6',
      'py-4',
      'overflow-y-auto',
      'overflow-x-hidden'
    ].join(' ');
  }

  get footerClasses(): string {
    return [
      'flex',
      'items-center',
      'justify-end',
      'gap-3',
      'px-6',
      'pb-6',
      'pt-4',
      'border-t',
      'border-beige-200',
      'bg-beige-50/30'
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

  onBackdropClick(_event: MouseEvent) {
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
