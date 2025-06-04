import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-large' | 'body-small' | 'caption' | 'overline' | 'label';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TextWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'dark' | 'light' | 'white' | 'inherit';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (htmlElement === 'h1') {
      <h1 [class]="textClasses">
        <ng-content></ng-content>
      </h1>
    } @else if (htmlElement === 'h2') {
      <h2 [class]="textClasses">
        <ng-content></ng-content>
      </h2>
    } @else if (htmlElement === 'h3') {
      <h3 [class]="textClasses">
        <ng-content></ng-content>
      </h3>
    } @else if (htmlElement === 'h4') {
      <h4 [class]="textClasses">
        <ng-content></ng-content>
      </h4>
    } @else if (htmlElement === 'h5') {
      <h5 [class]="textClasses">
        <ng-content></ng-content>
      </h5>
    } @else if (htmlElement === 'h6') {
      <h6 [class]="textClasses">
        <ng-content></ng-content>
      </h6>
    } @else if (htmlElement === 'p') {
      <p [class]="textClasses">
        <ng-content></ng-content>
      </p>
    } @else if (htmlElement === 'div') {
      <div [class]="textClasses">
        <ng-content></ng-content>
      </div>
    } @else if (htmlElement === 'label') {
      <label [class]="textClasses">
        <ng-content></ng-content>
      </label>
    } @else if (htmlElement === 'small') {
      <small [class]="textClasses">
        <ng-content></ng-content>
      </small>
    } @else {
      <span [class]="textClasses">
        <ng-content></ng-content>
      </span>
    }
  `,
  styles: []
})
export class TextComponent {
  @Input() variant: TextVariant = 'body';
  @Input() size: TextSize | null = null;
  @Input() weight: TextWeight | null = null;
  @Input() align: TextAlign = 'left';
  @Input() color: TextColor = 'inherit';
  @Input() transform: TextTransform = 'none';
  @Input() element: string | null = null;
  @Input() truncate: boolean = false;
  @Input() italic: boolean = false;
  @Input() underline: boolean = false;
  @Input() lineHeight: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose' = 'normal';
  @Input() letterSpacing: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest' = 'normal';

  get htmlElement(): string {
    // If element is explicitly set, use it
    if (this.element) {
      return this.element;
    }
    
    // Otherwise, determine element based on variant
    switch (this.variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'body':
      case 'body-large':
      case 'body-small': return 'p';
      case 'label': return 'label';
      case 'caption':
      case 'overline':
      default: return 'span';
    }
  }

  get textClasses(): string {
    const baseClasses = ['tw-transition-colors', 'tw-duration-200'];

    // Variant-based styles (provides sensible defaults)
    const variantClasses = this.getVariantClasses();
    
    // Size override (if specified, overrides variant default)
    const sizeClasses = this.size ? this.getSizeClasses() : [];
    
    // Weight override (if specified, overrides variant default)
    const weightClasses = this.weight ? this.getWeightClasses() : [];
    
    // Color classes
    const colorClasses = this.getColorClasses();
    
    // Alignment classes
    const alignClasses = this.getAlignClasses();
    
    // Transform classes
    const transformClasses = this.getTransformClasses();
    
    // Line height classes
    const lineHeightClasses = this.getLineHeightClasses();
    
    // Letter spacing classes
    const letterSpacingClasses = this.getLetterSpacingClasses();
    
    // Utility classes
    const utilityClasses = [];
    if (this.truncate) utilityClasses.push('tw-truncate');
    if (this.italic) utilityClasses.push('tw-italic');
    if (this.underline) utilityClasses.push('tw-underline');

    return [
      ...baseClasses,
      ...variantClasses,
      ...sizeClasses,
      ...weightClasses,
      ...colorClasses,
      ...alignClasses,
      ...transformClasses,
      ...lineHeightClasses,
      ...letterSpacingClasses,
      ...utilityClasses
    ].join(' ');
  }

  private getVariantClasses(): string[] {
    switch (this.variant) {
      case 'h1':
        return this.size ? [] : ['tw-text-4xl', 'tw-font-bold', 'tw-leading-tight'];
      case 'h2':
        return this.size ? [] : ['tw-text-3xl', 'tw-font-bold', 'tw-leading-tight'];
      case 'h3':
        return this.size ? [] : ['tw-text-2xl', 'tw-font-semibold', 'tw-leading-snug'];
      case 'h4':
        return this.size ? [] : ['tw-text-xl', 'tw-font-semibold', 'tw-leading-snug'];
      case 'h5':
        return this.size ? [] : ['tw-text-lg', 'tw-font-medium', 'tw-leading-normal'];
      case 'h6':
        return this.size ? [] : ['tw-text-base', 'tw-font-medium', 'tw-leading-normal'];
      case 'body':
        return this.size ? [] : ['tw-text-base', 'tw-font-normal', 'tw-leading-relaxed'];
      case 'body-large':
        return this.size ? [] : ['tw-text-lg', 'tw-font-normal', 'tw-leading-relaxed'];
      case 'body-small':
        return this.size ? [] : ['tw-text-sm', 'tw-font-normal', 'tw-leading-normal'];
      case 'caption':
        return this.size ? [] : ['tw-text-xs', 'tw-font-normal', 'tw-leading-normal'];
      case 'overline':
        return this.size ? [] : ['tw-text-xs', 'tw-font-medium', 'tw-uppercase', 'tw-tracking-wider'];
      case 'label':
        return this.size ? [] : ['tw-text-sm', 'tw-font-medium', 'tw-leading-normal'];
      default:
        return this.size ? [] : ['tw-text-base', 'tw-font-normal', 'tw-leading-normal'];
    }
  }

  private getSizeClasses(): string[] {
    switch (this.size) {
      case 'xs':
        return ['tw-text-xs'];
      case 'sm':
        return ['tw-text-sm'];
      case 'md':
        return ['tw-text-base'];
      case 'lg':
        return ['tw-text-lg'];
      case 'xl':
        return ['tw-text-xl'];
      case '2xl':
        return ['tw-text-2xl'];
      case '3xl':
        return ['tw-text-3xl'];
      case '4xl':
        return ['tw-text-4xl'];
      case '5xl':
        return ['tw-text-5xl'];
      case '6xl':
        return ['tw-text-6xl'];
      default:
        return [];
    }
  }

  private getWeightClasses(): string[] {
    switch (this.weight) {
      case 'thin':
        return ['tw-font-thin'];
      case 'extralight':
        return ['tw-font-extralight'];
      case 'light':
        return ['tw-font-light'];
      case 'normal':
        return ['tw-font-normal'];
      case 'medium':
        return ['tw-font-medium'];
      case 'semibold':
        return ['tw-font-semibold'];
      case 'bold':
        return ['tw-font-bold'];
      case 'extrabold':
        return ['tw-font-extrabold'];
      case 'black':
        return ['tw-font-black'];
      default:
        return [];
    }
  }

  private getColorClasses(): string[] {
    switch (this.color) {
      case 'primary':
        return ['tw-text-emerald-green-700'];
      case 'secondary':
        return ['tw-text-sky-blue-600'];
      case 'success':
        return ['tw-text-emerald-green-600'];
      case 'error':
        return ['tw-text-coral-600'];
      case 'warning':
        return ['tw-text-orange-500'];
      case 'info':
        return ['tw-text-sky-blue-500'];
      case 'muted':
        return ['tw-text-beige-600'];
      case 'dark':
        return ['tw-text-beige-900'];
      case 'light':
        return ['tw-text-beige-400'];
      case 'white':
        return ['tw-text-white'];
      case 'inherit':
        return [];
      default:
        return [];
    }
  }

  private getAlignClasses(): string[] {
    switch (this.align) {
      case 'left':
        return ['tw-text-left'];
      case 'center':
        return ['tw-text-center'];
      case 'right':
        return ['tw-text-right'];
      case 'justify':
        return ['tw-text-justify'];
      default:
        return [];
    }
  }

  private getTransformClasses(): string[] {
    switch (this.transform) {
      case 'uppercase':
        return ['tw-uppercase'];
      case 'lowercase':
        return ['tw-lowercase'];
      case 'capitalize':
        return ['tw-capitalize'];
      case 'none':
      default:
        return [];
    }
  }

  private getLineHeightClasses(): string[] {
    switch (this.lineHeight) {
      case 'none':
        return ['tw-leading-none'];
      case 'tight':
        return ['tw-leading-tight'];
      case 'snug':
        return ['tw-leading-snug'];
      case 'normal':
        return ['tw-leading-normal'];
      case 'relaxed':
        return ['tw-leading-relaxed'];
      case 'loose':
        return ['tw-leading-loose'];
      default:
        return [];
    }
  }

  private getLetterSpacingClasses(): string[] {
    switch (this.letterSpacing) {
      case 'tighter':
        return ['tw-tracking-tighter'];
      case 'tight':
        return ['tw-tracking-tight'];
      case 'normal':
        return ['tw-tracking-normal'];
      case 'wide':
        return ['tw-tracking-wide'];
      case 'wider':
        return ['tw-tracking-wider'];
      case 'widest':
        return ['tw-tracking-widest'];
      default:
        return [];
    }
  }
}
