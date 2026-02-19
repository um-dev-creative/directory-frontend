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
      class="relative inline-block"
      #triggerElement
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (click)="onClick()"
      (focusin)="onFocusIn($event)"
      (focusout)="onFocusOut($event)"
    >
      <!-- Trigger Content -->
      <ng-content></ng-content>

      <!-- Tooltip -->
      @if (isVisible) {
        <div
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
      }
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
    const baseClasses = 'absolute z-50 transition-all duration-200 transform';
    const positionClasses = this.getPositionClasses();
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const visibilityClasses = this.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none';

    return `${baseClasses} ${positionClasses} ${variantClasses} ${sizeClasses} ${visibilityClasses}`.trim();
  }

  get contentClasses(): string {
    const baseClasses = 'rounded-lg font-medium text-center break-words';
    const sizeClasses = this.getContentSizeClasses();

    return `${baseClasses} ${sizeClasses}`.trim();
  }

  get arrowClasses(): string {
    if (!this.arrow) return 'hidden';

    const baseClasses = 'absolute w-2 h-2 transform rotate-45';
    const positionClasses = this.getArrowPositionClasses();
    const variantClasses = this.getArrowVariantClasses();

    return `${baseClasses} ${positionClasses} ${variantClasses}`.trim();
  }

  private getPositionClasses(): string {
    const positionMap = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };
    return positionMap[this.position];
  }

  private getVariantClasses(): string {
    const variantMap = {
      default: 'bg-gray-900 text-white',
      dark: 'bg-black text-white',
      light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
      success: 'bg-emerald-green-600 text-white',
      warning: 'bg-yellow-500 text-white',
      error: 'bg-red-600 text-white'
    };
    return variantMap[this.variant];
  }

  private getSizeClasses(): string {
    return `max-w-[${this.maxWidth}]`;
  }

  private getContentSizeClasses(): string {
    const sizeMap = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };
    return sizeMap[this.size];
  }

  private getArrowPositionClasses(): string {
    const positionMap = {
      top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
      left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
      right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
    };
    return positionMap[this.position];
  }

  private getArrowVariantClasses(): string {
    const variantMap = {
      default: 'bg-gray-900',
      dark: 'bg-black',
      light: 'bg-white border border-gray-200',
      success: 'bg-emerald-green-600',
      warning: 'bg-yellow-500',
      error: 'bg-red-600'
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

  onFocusIn(event: FocusEvent): void {
    if (this.trigger === 'focus' && !this.disabled) {
      this.showTooltip();
    }
  }

  onFocusOut(event: FocusEvent): void {
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
