import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'default' | 'card' | 'list' | 'profile' | 'table' | 'custom';
export type SkeletonAnimation = 'pulse' | 'wave' | 'shimmer' | 'none';
export type SkeletonShape = 'rectangle' | 'circle' | 'rounded';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton-container"
      [ngClass]="getContainerClasses()"
      [attr.aria-label]="ariaLabel"
      [attr.role]="role"
    >
      <!-- Default Skeleton -->
      @if (variant === 'default') {
        <div class="space-y-3">
          @for (line of lines; track $index) {
            <div
              class="skeleton-line"
              [ngClass]="getLineClasses(line, $index)"
              [style.height.px]="line.height"
              [style.width]="line.width"
            ></div>
          }
        </div>
      }

      <!-- Card Skeleton -->
      @if (variant === 'card') {
        <div class="skeleton-card space-y-4">
          <!-- Card Image -->
          @if (showImage) {
            <div
              class="skeleton-element"
              [ngClass]="getElementClasses('rectangle')"
              [style.height.px]="imageHeight"
            ></div>
          }

          <!-- Card Content -->
          <div class="space-y-3">
            <!-- Title -->
            <div
              class="skeleton-element"
              [ngClass]="getElementClasses('rounded')"
              style="height: 20px; width: 80%;"
            ></div>

            <!-- Subtitle -->
            <div
              class="skeleton-element"
              [ngClass]="getElementClasses('rounded')"
              style="height: 16px; width: 60%;"
            ></div>

            <!-- Content lines -->
            @for (i of [1,2]; track i) {
              <div
                class="skeleton-element"
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
        <div class="skeleton-list space-y-4">
          @for (item of listItems; track $index) {
            <div class="flex items-center space-x-4">
              <!-- Avatar -->
              @if (showAvatar) {
                <div
                  class="skeleton-element shrink-0"
                  [ngClass]="getElementClasses('circle')"
                  [style.width.px]="avatarSize"
                  [style.height.px]="avatarSize"
                ></div>
              }

              <!-- Content -->
              <div class="flex-1 space-y-2">
                <div
                  class="skeleton-element"
                  [ngClass]="getElementClasses('rounded')"
                  style="height: 16px; width: 75%;"
                ></div>
                <div
                  class="skeleton-element"
                  [ngClass]="getElementClasses('rounded')"
                  style="height: 14px; width: 50%;"
                ></div>
              </div>

              <!-- Action -->
              @if (showAction) {
                <div
                  class="skeleton-element shrink-0"
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
        <div class="skeleton-profile text-center space-y-4">
          <!-- Profile Avatar -->
          <div class="flex justify-center">
            <div
              class="skeleton-element"
              [ngClass]="getElementClasses('circle')"
              style="width: 80px; height: 80px;"
            ></div>
          </div>

          <!-- Profile Info -->
          <div class="space-y-3">
            <!-- Name -->
            <div
              class="skeleton-element mx-auto"
              [ngClass]="getElementClasses('rounded')"
              style="height: 20px; width: 60%;"
            ></div>

            <!-- Title -->
            <div
              class="skeleton-element mx-auto"
              [ngClass]="getElementClasses('rounded')"
              style="height: 16px; width: 40%;"
            ></div>

            <!-- Description -->
            @for (i of [1,2,3]; track i) {
              <div
                class="skeleton-element mx-auto"
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
        <div class="skeleton-table space-y-3">
          <!-- Table Header -->
          <div class="flex space-x-4">
            @for (col of tableColumnsArray; track $index) {
              <div
                class="skeleton-element flex-1"
                [ngClass]="getElementClasses('rounded')"
                style="height: 18px;"
              ></div>
            }
          </div>

          <!-- Table Rows -->
          @for (row of tableRowsArray; track $index) {
            <div class="flex space-x-4">
              @for (col of tableColumnsArray; track $index) {
                <div
                  class="skeleton-element flex-1"
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
    @reference "../../../../styles.css";

    .skeleton-container {
      @apply w-full;
    }

    .skeleton-element {
      @apply bg-gradient-to-r from-beige-200 via-beige-300 to-beige-200;
    }

    .skeleton-line {
      @apply bg-gradient-to-r from-beige-200 via-beige-300 to-beige-200;
    }

    /* Animation Classes */
    .skeleton-pulse {
      @apply animate-pulse;
    }

    .skeleton-wave {
      animation: skeleton-wave 1.6s ease-in-out infinite;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent);
      background-size: 200px 100%;
    }

    .skeleton-shimmer {
      animation: skeleton-shimmer 2s infinite;
      background: linear-gradient(90deg,
        rgb(var(--color-beige-200)) 0%,
        rgb(var(--color-beige-300)) 50%,
        rgb(var(--color-beige-200)) 100%
      );
      background-size: 200% 100%;
    }

    /* Shape Classes */
    .skeleton-rectangle {
      @apply rounded-none;
    }

    .skeleton-rounded {
      @apply rounded-md;
    }

    .skeleton-circle {
      @apply rounded-full;
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
    .skeleton-card {
      @apply p-4 border border-beige-200 rounded-lg;
    }

    .skeleton-list {
      @apply space-y-4;
    }

    .skeleton-profile {
      @apply p-6 border border-beige-200 rounded-lg;
    }

    .skeleton-table {
      @apply p-4 border border-beige-200 rounded-lg;
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
      classes.push('hidden');
    }

    return classes.join(' ');
  }

  getElementClasses(elementShape?: SkeletonShape): string {
    const classes: string[] = ['skeleton-element'];
    const currentShape = elementShape || this.shape;

    // Animation
    switch (this.animation) {
      case 'pulse':
        classes.push('skeleton-pulse');
        break;
      case 'none':
        // No animation
        break;
    }

    // Shape
    switch (currentShape) {
      case 'rectangle':
        classes.push('skeleton-rectangle');
        break;
      case 'rounded':
        classes.push('skeleton-rounded');
        break;
      case 'circle':
        classes.push('skeleton-circle');
        break;
    }

    return classes.join(' ');
  }

  getLineClasses(line: {height: number, width: string}, index: number): string {
    const classes: string[] = ['skeleton-line'];

    // Animation
    switch (this.animation) {
      case 'pulse':
        classes.push('skeleton-pulse');
        break;
      case 'none':
        // No animation
        break;
    }

    // Shape
    switch (this.shape) {
      case 'rectangle':
        classes.push('skeleton-rectangle');
        break;
      case 'rounded':
        classes.push('skeleton-rounded');
        break;
      case 'circle':
        classes.push('skeleton-circle');
        break;
    }

    return classes.join(' ');
  }
}
