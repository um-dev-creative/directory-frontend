import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'default' | 'card' | 'list' | 'profile' | 'table' | 'custom';
export type SkeletonAnimation = 'pulse' | 'none';
export type SkeletonShape = 'rectangle' | 'circle' | 'rounded';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="tw-skeleton-container"
      [ngClass]="getContainerClasses()"
      [attr.aria-label]="ariaLabel"
      [attr.role]="role"
    >
      <!-- Default Skeleton -->
      @if (variant === 'default') {
        <div class="tw-space-y-3">
          @for (line of lines; track $index) {
            <div
              class="tw-skeleton-line"
              [ngClass]="getLineClasses(line, $index)"
              [style.height.px]="line.height"
              [style.width]="line.width"
            ></div>
          }
        </div>
      }

      <!-- Card Skeleton -->
      @if (variant === 'card') {
        <div class="tw-skeleton-card tw-space-y-4">
          <!-- Card Image -->
          @if (showImage) {
            <div
              class="tw-skeleton-element"
              [ngClass]="getElementClasses('rectangle')"
              [style.height.px]="imageHeight"
            ></div>
          }

          <!-- Card Content -->
          <div class="tw-space-y-3">
            <!-- Title -->
            <div
              class="tw-skeleton-element"
              [ngClass]="getElementClasses('rounded')"
              style="height: 20px; width: 80%;"
            ></div>

            <!-- Subtitle -->
            <div
              class="tw-skeleton-element"
              [ngClass]="getElementClasses('rounded')"
              style="height: 16px; width: 60%;"
            ></div>

            <!-- Content lines -->
            @for (i of [1,2]; track i) {
              <div
                class="tw-skeleton-element"
                [ngClass]="getElementClasses('rounded')"
                [style.height.px]="14"
                [style.width]="i === 2 ? '45%' : '90%'"
              ></div>
            }
          </div>
        </div>
      }

      <!-- List Skeleton -->
      @if (variant === 'list') {
        <div class="tw-skeleton-list tw-space-y-4">
          @for (item of listItems; track $index) {
            <div class="tw-flex tw-items-center tw-space-x-4">
              <!-- Avatar -->
              @if (showAvatar) {
                <div
                  class="tw-skeleton-element tw-flex-shrink-0"
                  [ngClass]="getElementClasses('circle')"
                  [style.width.px]="avatarSize"
                  [style.height.px]="avatarSize"
                ></div>
              }

              <!-- Content -->
              <div class="tw-flex-1 tw-space-y-2">
                <div
                  class="tw-skeleton-element"
                  [ngClass]="getElementClasses('rounded')"
                  style="height: 16px; width: 75%;"
                ></div>
                <div
                  class="tw-skeleton-element"
                  [ngClass]="getElementClasses('rounded')"
                  style="height: 14px; width: 50%;"
                ></div>
              </div>

              <!-- Action -->
              @if (showAction) {
                <div
                  class="tw-skeleton-element tw-flex-shrink-0"
                  [ngClass]="getElementClasses('rounded')"
                  style="width: 80px; height: 32px;"
                ></div>
              }
            </div>
          }
        </div>
      }

      <!-- Profile Skeleton -->
      @if (variant === 'profile') {
        <div class="tw-skeleton-profile tw-text-center tw-space-y-4">
          <!-- Profile Avatar -->
          <div class="tw-flex tw-justify-center">
            <div
              class="tw-skeleton-element"
              [ngClass]="getElementClasses('circle')"
              style="width: 80px; height: 80px;"
            ></div>
          </div>

          <!-- Profile Info -->
          <div class="tw-space-y-3">
            <!-- Name -->
            <div
              class="tw-skeleton-element tw-mx-auto"
              [ngClass]="getElementClasses('rounded')"
              style="height: 20px; width: 60%;"
            ></div>

            <!-- Title -->
            <div
              class="tw-skeleton-element tw-mx-auto"
              [ngClass]="getElementClasses('rounded')"
              style="height: 16px; width: 40%;"
            ></div>

            <!-- Description -->
            @for (i of [1,2,3]; track i) {
              <div
                class="tw-skeleton-element tw-mx-auto"
                [ngClass]="getElementClasses('rounded')"
                [style.height.px]="14"
                [style.width]="i === 3 ? '30%' : '80%'"
              ></div>
            }
          </div>
        </div>
      }

      <!-- Table Skeleton -->
      @if (variant === 'table') {
        <div class="tw-skeleton-table tw-space-y-3">
          <!-- Table Header -->
          <div class="tw-flex tw-space-x-4">
            @for (col of tableColumnsArray; track $index) {
              <div
                class="tw-skeleton-element tw-flex-1"
                [ngClass]="getElementClasses('rounded')"
                style="height: 18px;"
              ></div>
            }
          </div>

          <!-- Table Rows -->
          @for (row of tableRowsArray; track $index) {
            <div class="tw-flex tw-space-x-4">
              @for (col of tableColumnsArray; track $index) {
                <div
                  class="tw-skeleton-element tw-flex-1"
                  [ngClass]="getElementClasses('rounded')"
                  style="height: 16px;"
                ></div>
              }
            </div>
          }
        </div>
      }

      <!-- Custom Skeleton -->
      @if (variant === 'custom') {
        <ng-content></ng-content>
      }
    </div>
  `,
  styles: [`
    .tw-skeleton-container {
      @apply tw-w-full;
    }

    .tw-skeleton-element {
      @apply tw-bg-gradient-to-r tw-from-beige-200 tw-via-beige-300 tw-to-beige-200;
    }

    .tw-skeleton-line {
      @apply tw-bg-gradient-to-r tw-from-beige-200 tw-via-beige-300 tw-to-beige-200;
    }

    /* Animation Classes */
    .tw-skeleton-pulse {
      @apply tw-animate-pulse;
    }

    .tw-skeleton-wave {
      animation: skeleton-wave 1.6s ease-in-out infinite;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent);
      background-size: 200px 100%;
    }

    .tw-skeleton-shimmer {
      animation: skeleton-shimmer 2s infinite;
      background: linear-gradient(90deg,
        rgb(var(--tw-color-beige-200)) 0%,
        rgb(var(--tw-color-beige-300)) 50%,
        rgb(var(--tw-color-beige-200)) 100%
      );
      background-size: 200% 100%;
    }

    /* Shape Classes */
    .tw-skeleton-rectangle {
      @apply tw-rounded-none;
    }

    .tw-skeleton-rounded {
      @apply tw-rounded-md;
    }

    .tw-skeleton-circle {
      @apply tw-rounded-full;
    }

    /* Keyframes */
    @keyframes skeleton-wave {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes skeleton-shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Variant Specific Styles */
    .tw-skeleton-card {
      @apply tw-p-4 tw-border tw-border-beige-200 tw-rounded-lg;
    }

    .tw-skeleton-list {
      @apply tw-space-y-4;
    }

    .tw-skeleton-profile {
      @apply tw-p-6 tw-border tw-border-beige-200 tw-rounded-lg;
    }

    .tw-skeleton-table {
      @apply tw-p-4 tw-border tw-border-beige-200 tw-rounded-lg;
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'default';
  @Input() animation: SkeletonAnimation = 'pulse';
  @Input() shape: SkeletonShape = 'rounded';
  @Input() loading: boolean = true;
  @Input() count: number = 3;
  @Input() height: number = 20;
  @Input() width: string = '100%';

  // Card specific
  @Input() showImage: boolean = true;
  @Input() imageHeight: number = 200;

  // List specific
  @Input() showAvatar: boolean = true;
  @Input() showAction: boolean = false;
  @Input() avatarSize: number = 40;

  // Table specific
  @Input() tableColumns: number = 4;
  @Input() tableRows: number = 5;

  // Custom lines for default variant
  @Input() customLines: Array<{height: number, width: string}> = [];

  // Accessibility
  @Input() ariaLabel: string = 'Loading content';
  @Input() role: string = 'status';

  get lines() {
    if (this.customLines.length > 0) {
      return this.customLines;
    }

    return Array.from({ length: this.count }, (_, index) => ({
      height: this.height,
      width: index === this.count - 1 ? '60%' : this.width
    }));
  }

  get listItems() {
    return Array.from({ length: this.count }, (_, index) => index);
  }

  get tableColumnsArray() {
    return Array.from({ length: this.tableColumns }, (_, index) => index);
  }

  get tableRowsArray() {
    return Array.from({ length: this.tableRows }, (_, index) => index);
  }

  getContainerClasses(): string {
    const classes: string[] = [];

    if (!this.loading) {
      classes.push('tw-hidden');
    }

    return classes.join(' ');
  }

  getElementClasses(elementShape?: SkeletonShape): string {
    const classes: string[] = ['tw-skeleton-element'];
    const currentShape = elementShape || this.shape;

    // Animation
    switch (this.animation) {
      case 'pulse':
        classes.push('tw-skeleton-pulse');
        break;
      case 'none':
        // No animation
        break;
    }

    // Shape
    switch (currentShape) {
      case 'rectangle':
        classes.push('tw-skeleton-rectangle');
        break;
      case 'rounded':
        classes.push('tw-skeleton-rounded');
        break;
      case 'circle':
        classes.push('tw-skeleton-circle');
        break;
    }

    return classes.join(' ');
  }

  getLineClasses(line: {height: number, width: string}, index: number): string {
    const classes: string[] = ['tw-skeleton-line'];

    // Animation
    switch (this.animation) {
      case 'pulse':
        classes.push('tw-skeleton-pulse');
        break;
      case 'none':
        // No animation
        break;
    }

    // Shape
    switch (this.shape) {
      case 'rectangle':
        classes.push('tw-skeleton-rectangle');
        break;
      case 'rounded':
        classes.push('tw-skeleton-rounded');
        break;
      case 'circle':
        classes.push('tw-skeleton-circle');
        break;
    }

    return classes.join(' ');
  }
}
