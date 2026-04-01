import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type SkeletonVariant = 'default' | 'card' | 'list' | 'profile' | 'table' | 'custom';
export type SkeletonAnimation = 'pulse' | 'wave' | 'shimmer' | 'none';
export type SkeletonShape = 'rectangle' | 'circle' | 'rounded';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="skeleton-container"
      [ngClass]="getContainerClasses()"
      [attr.aria-label]="ariaLabel()"
      [attr.role]="role()"
    >
      <!-- Default Skeleton -->
      @if (variant() === 'default') {
        <div class="space-y-3">
          @for (line of lines(); track $index) {
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
      @if (variant() === 'card') {
        <div class="skeleton-card space-y-4">
          <!-- Card Image -->
          @if (showImage()) {
            <div
              class="skeleton-element"
              [ngClass]="getElementClasses('rectangle')"
              [style.height.px]="imageHeight()"
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
      @if (variant() === 'list') {
        <div class="skeleton-list space-y-4">
          @for (item of listItems(); track $index) {
            <div class="flex items-center space-x-4">
              <!-- Avatar -->
              @if (showAvatar()) {
                <div
                  class="skeleton-element shrink-0"
                  [ngClass]="getElementClasses('circle')"
                  [style.width.px]="avatarSize()"
                  [style.height.px]="avatarSize()"
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
              @if (showAction()) {
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
      @if (variant() === 'profile') {
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
      @if (variant() === 'table') {
        <div class="skeleton-table space-y-3">
          <!-- Table Header -->
          <div class="flex space-x-4">
            @for (col of tableColumnsArray(); track $index) {
              <div
                class="skeleton-element flex-1"
                [ngClass]="getElementClasses('rounded')"
                style="height: 18px;"
              ></div>
            }
          </div>

          <!-- Table Rows -->
          @for (row of tableRowsArray(); track $index) {
            <div class="flex space-x-4">
              @for (col of tableColumnsArray(); track $index) {
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
      @if (variant() === 'custom') {
        <ng-content></ng-content>
      }
    </div>
  `
})

export class SkeletonComponent {
  variant = input<SkeletonVariant>('default');
  animation = input<SkeletonAnimation>('pulse');
  shape = input<SkeletonShape>('rounded');
  loading = input<boolean>(true);
  count = input<number>(3);
  height = input<number>(20);
  width = input<string>('100%');

  // Card specific
  showImage = input<boolean>(true);
  imageHeight = input<number>(200);

  // List specific
  showAvatar = input<boolean>(true);
  showAction = input<boolean>(false);
  avatarSize = input<number>(40);

  // Table specific
  tableColumns = input<number>(4);
  tableRows = input<number>(5);

  // Custom lines for default variant
  customLines = input<Array<{height: number, width: string}>>([]);

  // Accessibility
  ariaLabel = input<string>('Loading content');
  role = input<string>('status');

  lines = computed(() => {
    const custom = this.customLines();
    if (custom.length > 0) return custom;
    const n = this.count();
    const h = this.height();
    const w = this.width();
    return Array.from({ length: n }, (_, index) => ({
      height: h,
      width: index === n - 1 ? '60%' : w
    }));
  });

  listItems = computed(() => Array.from({ length: this.count() }, (_, i) => i));

  tableColumnsArray = computed(() => Array.from({ length: this.tableColumns() }, (_, i) => i));

  tableRowsArray = computed(() => Array.from({ length: this.tableRows() }, (_, i) => i));

  getContainerClasses(): string {
    return this.loading() ? '' : 'hidden';
  }

  getElementClasses(elementShape?: SkeletonShape): string {
    const classes: string[] = ['skeleton-element'];
    const currentShape = elementShape ?? this.shape();

    if (this.animation() === 'pulse') classes.push('skeleton-pulse');

    switch (currentShape) {
      case 'rectangle': classes.push('skeleton-rectangle'); break;
      case 'rounded':   classes.push('skeleton-rounded');   break;
      case 'circle':    classes.push('skeleton-circle');    break;
    }

    return classes.join(' ');
  }

  getLineClasses(_line: {height: number, width: string}, _index: number): string {
    const classes: string[] = ['skeleton-line'];

    if (this.animation() === 'pulse') classes.push('skeleton-pulse');

    switch (this.shape()) {
      case 'rectangle': classes.push('skeleton-rectangle'); break;
      case 'rounded':   classes.push('skeleton-rounded');   break;
      case 'circle':    classes.push('skeleton-circle');    break;
    }

    return classes.join(' ');
  }
}
