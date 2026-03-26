import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icon';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, IconComponent],
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
        <app-icon
          [name]="iconName"
          variant="solid"
          [class]="iconClasses"
          [attr.aria-label]="alt"
        />
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
  @Input() loading: boolean = false;
  @Input() iconName: string = 'user'; // Default fallback icon

  imageError = false;

  get displayInitials(): string {
    if (!this.initials) return '';
    return this.initials.substring(0, 2).toUpperCase();
  }

  get avatarClasses(): string {
    const baseClasses = 'relative inline-flex items-center justify-center bg-emerald-green-100 text-emerald-green-700 font-medium overflow-hidden';

    const sizeClasses = {
      'xs': 'w-6 h-6 text-xs',
      'sm': 'w-8 h-8 text-sm',
      'md': 'w-12 h-12 text-base',
      'lg': 'w-16 h-16 text-lg',
      'xl': 'w-20 h-20 text-xl',
      '2xl': 'w-32 h-32 text-2xl'
    };

    const variantClasses = {
      'circular': 'rounded-full',
      'rounded': 'rounded-lg',
      'square': 'rounded-none'
    };

    const loadingClasses = this.loading ? 'animate-pulse' : '';

    return [
      baseClasses,
      sizeClasses[this.size],
      variantClasses[this.variant],
      loadingClasses
    ].filter(Boolean).join(' ');
  }

  get imageClasses(): string {
    return 'w-full h-full object-cover';
  }

  get initialsClasses(): string {
    return 'select-none';
  }

  get iconClasses(): string {
    const sizeClasses = {
      'xs': 'w-3 h-3',
      'sm': 'w-4 h-4',
      'md': 'w-6 h-6',
      'lg': 'w-8 h-8',
      'xl': 'w-10 h-10',
      '2xl': 'w-16 h-16'
    };

    return `text-emerald-green-400 ${sizeClasses[this.size]}`;
  }

  onImageError(): void {
    this.imageError = true;
  }

  onImageLoad(): void {
    this.imageError = false;
  }
}
