import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'hover' | 'click' | 'focus';
export type TooltipSize = 'sm' | 'md' | 'lg';
export type TooltipVariant = 'default' | 'dark' | 'light' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="tw-relative tw-inline-block"
      #triggerElement
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (click)="onClick()"
      (focus)="onFocus()"
      (blur)="onBlur()"
      [attr.tabindex]="trigger === 'focus' ? '0' : null"
    >
      <!-- Trigger Content -->
      <ng-content></ng-content>

      <!-- Tooltip -->
      <div
        *ngIf="isVisible"
        [class]="tooltipClasses"
        role="tooltip"
        [attr.id]="tooltipId"
        #tooltipElement
      >
        <!-- Tooltip Content -->
        <div [class]="contentClasses">
          {{ content }}
          <ng-content select="[slot=tooltip-content]"></ng-content>
        </div>

        <!-- Arrow -->
        <div [class]="arrowClasses"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class TooltipComponent implements AfterViewInit, OnDestroy {
  @Input() content: string = '';
  @Input() position: TooltipPosition = 'top';
  @Input() trigger: TooltipTrigger = 'hover';
  @Input() size: TooltipSize = 'md';
  @Input() variant: TooltipVariant = 'default';
  @Input() disabled: boolean = false;
  @Input() delay: number = 100;
  @Input() hideDelay: number = 100;
  @Input() maxWidth: string = '200px';
  @Input() offset: number = 8;
  @Input() arrow: boolean = true;

  @Output() show = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  @ViewChild('triggerElement', { static: true }) triggerElement!: ElementRef;
  @ViewChild('tooltipElement') tooltipElement!: ElementRef;

  isVisible: boolean = false;
  tooltipId: string = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  private showTimeout?: number;
  private hideTimeout?: number;
  private clickOutsideListener?: (event: Event) => void;

  ngAfterViewInit() {
    if (this.trigger === 'click') {
      this.setupClickOutsideListener();
    }
  }

  ngOnDestroy() {
    this.clearTimeouts();
    this.removeClickOutsideListener();
  }

  get tooltipClasses(): string {
    const baseClasses = 'tw-absolute tw-z-50 tw-transition-all tw-duration-200 tw-transform';
    const positionClasses = this.getPositionClasses();
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const visibilityClasses = this.isVisible ? 'tw-opacity-100 tw-scale-100' : 'tw-opacity-0 tw-scale-95 tw-pointer-events-none';

    return `${baseClasses} ${positionClasses} ${variantClasses} ${sizeClasses} ${visibilityClasses}`.trim();
  }

  get contentClasses(): string {
    const baseClasses = 'tw-rounded-lg tw-font-medium tw-text-center tw-break-words';
    const sizeClasses = this.getContentSizeClasses();

    return `${baseClasses} ${sizeClasses}`.trim();
  }

  get arrowClasses(): string {
    if (!this.arrow) return 'tw-hidden';

    const baseClasses = 'tw-absolute tw-w-2 tw-h-2 tw-transform tw-rotate-45';
    const positionClasses = this.getArrowPositionClasses();
    const variantClasses = this.getArrowVariantClasses();

    return `${baseClasses} ${positionClasses} ${variantClasses}`.trim();
  }

  private getPositionClasses(): string {
    const positionMap = {
      top: 'tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw-mb-2',
      bottom: 'tw-top-full tw-left-1/2 tw--translate-x-1/2 tw-mt-2',
      left: 'tw-right-full tw-top-1/2 tw--translate-y-1/2 tw-mr-2',
      right: 'tw-left-full tw-top-1/2 tw--translate-y-1/2 tw-ml-2'
    };
    return positionMap[this.position];
  }

  private getVariantClasses(): string {
    const variantMap = {
      default: 'tw-bg-gray-900 tw-text-white',
      dark: 'tw-bg-black tw-text-white',
      light: 'tw-bg-white tw-text-gray-900 tw-border tw-border-gray-200 tw-shadow-lg',
      success: 'tw-bg-emerald-green-600 tw-text-white',
      warning: 'tw-bg-yellow-500 tw-text-white',
      error: 'tw-bg-red-600 tw-text-white'
    };
    return variantMap[this.variant];
  }

  private getSizeClasses(): string {
    return `tw-max-w-[${this.maxWidth}]`;
  }

  private getContentSizeClasses(): string {
    const sizeMap = {
      sm: 'tw-px-2 tw-py-1 tw-text-xs',
      md: 'tw-px-3 tw-py-2 tw-text-sm',
      lg: 'tw-px-4 tw-py-3 tw-text-base'
    };
    return sizeMap[this.size];
  }

  private getArrowPositionClasses(): string {
    const positionMap = {
      top: 'tw-top-full tw-left-1/2 tw--translate-x-1/2 tw--mt-1',
      bottom: 'tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw--mb-1',
      left: 'tw-left-full tw-top-1/2 tw--translate-y-1/2 tw--ml-1',
      right: 'tw-right-full tw-top-1/2 tw--translate-y-1/2 tw--mr-1'
    };
    return positionMap[this.position];
  }

  private getArrowVariantClasses(): string {
    const variantMap = {
      default: 'tw-bg-gray-900',
      dark: 'tw-bg-black',
      light: 'tw-bg-white tw-border tw-border-gray-200',
      success: 'tw-bg-emerald-green-600',
      warning: 'tw-bg-yellow-500',
      error: 'tw-bg-red-600'
    };
    return variantMap[this.variant];
  }

  private setupClickOutsideListener(): void {
    this.clickOutsideListener = (event: Event) => {
      if (this.isVisible && !this.triggerElement.nativeElement.contains(event.target as Node)) {
        this.hideTooltip();
      }
    };
    document.addEventListener('click', this.clickOutsideListener);
  }

  private removeClickOutsideListener(): void {
    if (this.clickOutsideListener) {
      document.removeEventListener('click', this.clickOutsideListener);
      this.clickOutsideListener = undefined;
    }
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      window.clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.hideTimeout) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  onMouseEnter(): void {
    if (this.trigger === 'hover' && !this.disabled) {
      this.clearTimeouts();
      this.showTimeout = window.setTimeout(() => {
        this.showTooltip();
      }, this.delay);
    }
  }

  onMouseLeave(): void {
    if (this.trigger === 'hover' && !this.disabled) {
      this.clearTimeouts();
      this.hideTimeout = window.setTimeout(() => {
        this.hideTooltip();
      }, this.hideDelay);
    }
  }

  onClick(): void {
    if (this.trigger === 'click' && !this.disabled) {
      if (this.isVisible) {
        this.hideTooltip();
      } else {
        this.showTooltip();
      }
    }
  }

  onFocus(): void {
    if (this.trigger === 'focus' && !this.disabled) {
      this.showTooltip();
    }
  }

  onBlur(): void {
    if (this.trigger === 'focus' && !this.disabled) {
      this.hideTooltip();
    }
  }

  showTooltip(): void {
    if (!this.disabled && !this.isVisible) {
      this.isVisible = true;
      this.show.emit();
    }
  }

  hideTooltip(): void {
    if (this.isVisible) {
      this.isVisible = false;
      this.hide.emit();
    }
  }

  toggle(): void {
    if (this.isVisible) {
      this.hideTooltip();
    } else {
      this.showTooltip();
    }
  }
}
