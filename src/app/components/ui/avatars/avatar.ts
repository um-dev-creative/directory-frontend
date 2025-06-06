import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="avatarClasses">
      @if (src && !imageError) {
        <img
          [src]="src"
          [alt]="alt"
          [class]="imageClasses"
          (error)="onImageError()"
          (load)="onImageLoad()"
        />
      } @else if (initials) {
        <span [class]="initialsClasses">{{ displayInitials }}</span>
      } @else {
        <!-- Fallback icon -->
        <svg [class]="iconClasses" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      }

      @if (showBadge) {
        <div [class]="badgeClasses">
          <ng-content select="[slot=badge]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: []
})
export class Avatar {
  @Input() src: string = '';
  @Input() alt: string = 'Avatar';
  @Input() initials: string = '';
  @Input() size: AvatarSize = 'md';
  @Input() variant: AvatarVariant = 'circular';
  @Input() showBadge: boolean = false;
  @Input() loading: boolean = false;

  imageError = false;

  get displayInitials(): string {
    if (!this.initials) return '';
    return this.initials.substring(0, 2).toUpperCase();
  }

  get avatarClasses(): string {
    const baseClasses = 'tw-relative tw-inline-flex tw-items-center tw-justify-center tw-bg-emerald-green-100 tw-text-emerald-green-700 tw-font-medium tw-overflow-hidden';

    const sizeClasses = {
      'xs': 'tw-w-6 tw-h-6 tw-text-xs',
      'sm': 'tw-w-8 tw-h-8 tw-text-sm',
      'md': 'tw-w-12 tw-h-12 tw-text-base',
      'lg': 'tw-w-16 tw-h-16 tw-text-lg',
      'xl': 'tw-w-20 tw-h-20 tw-text-xl',
      '2xl': 'tw-w-32 tw-h-32 tw-text-2xl'
    };

    const variantClasses = {
      'circular': 'tw-rounded-full',
      'rounded': 'tw-rounded-lg',
      'square': 'tw-rounded-none'
    };

    const loadingClasses = this.loading ? 'tw-animate-pulse' : '';

    return [
      baseClasses,
      sizeClasses[this.size],
      variantClasses[this.variant],
      loadingClasses
    ].filter(Boolean).join(' ');
  }

  get imageClasses(): string {
    return 'tw-w-full tw-h-full tw-object-cover';
  }

  get initialsClasses(): string {
    return 'tw-select-none';
  }

  get iconClasses(): string {
    const sizeClasses = {
      'xs': 'tw-w-3 tw-h-3',
      'sm': 'tw-w-4 tw-h-4',
      'md': 'tw-w-6 tw-h-6',
      'lg': 'tw-w-8 tw-h-8',
      'xl': 'tw-w-10 tw-h-10',
      '2xl': 'tw-w-16 tw-h-16'
    };

    return `tw-text-emerald-green-400 ${sizeClasses[this.size]}`;
  }

  get badgeClasses(): string {
    const baseClasses = 'tw-absolute tw-bottom-0 tw-right-0 tw-transform tw-translate-x-1/4 tw-translate-y-1/4';

    const sizeClasses = {
      'xs': 'tw-w-2 tw-h-2',
      'sm': 'tw-w-2.5 tw-h-2.5',
      'md': 'tw-w-3 tw-h-3',
      'lg': 'tw-w-4 tw-h-4',
      'xl': 'tw-w-5 tw-h-5',
      '2xl': 'tw-w-6 tw-h-6'
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  onImageError(): void {
    this.imageError = true;
  }

  onImageLoad(): void {
    this.imageError = false;
  }
}
