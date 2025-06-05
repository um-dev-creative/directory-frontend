import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent, Button, type SkeletonAnimation, type SkeletonShape } from '../../ui';

@Component({
  selector: 'app-skeletons-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent, Button],
  template: `
    <section class="tw-space-y-8">
      <!-- Header -->
      <div class="tw-text-center tw-space-y-4">
        <h2 class="tw-text-3xl tw-font-bold tw-text-emerald-green-600">
          Skeleton Components
        </h2>
        <p class="tw-text-lg tw-text-beige-600 tw-max-w-3xl tw-mx-auto">
          Provide visual feedback during loading states with beautiful skeleton placeholders.
          Perfect for improving perceived performance and user experience.
        </p>
      </div>

      <!-- Interactive Controls -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
        <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-6 tw-mb-6">
          <div class="tw-flex tw-items-center tw-space-x-3">
            <label class="tw-text-sm tw-font-medium tw-text-beige-700">Animation:</label>
            <select
              [(ngModel)]="selectedAnimation"
              class="tw-px-3 tw-py-1 tw-border tw-border-beige-300 tw-rounded-md tw-text-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-emerald-green-500"
            >
              <option value="pulse">Pulse</option>
              <option value="none">None</option>
            </select>
          </div>

          <div class="tw-flex tw-items-center tw-space-x-3">
            <label class="tw-text-sm tw-font-medium tw-text-beige-700">Shape:</label>
            <select
              [(ngModel)]="selectedShape"
              class="tw-px-3 tw-py-1 tw-border tw-border-beige-300 tw-rounded-md tw-text-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-emerald-green-500"
            >
              <option value="rounded">Rounded</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <label class="tw-flex tw-items-center tw-space-x-2">
            <input
              type="checkbox"
              [(ngModel)]="showLoading"
              class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-focus:ring-emerald-green-500 tw-border-beige-300 tw-rounded"
            >
            <span class="tw-text-sm tw-font-medium tw-text-beige-700">Show Loading</span>
          </label>
        </div>
      </div>

      <!-- Variant Showcase -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8">

        <!-- Card Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Card Layout</h3>
          <app-skeleton
            variant="card"
            [animation]="selectedAnimation"
            [loading]="showLoading"
            [showImage]="true"
            [imageHeight]="180"
          ></app-skeleton>
        </div>

        <!-- List Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">List Items</h3>
          <app-skeleton
            variant="list"
            [animation]="selectedAnimation"
            [loading]="showLoading"
            [count]="3"
            [showAvatar]="true"
            [showAction]="true"
            [avatarSize]="40"
          ></app-skeleton>
        </div>

        <!-- Profile Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Profile Card</h3>
          <app-skeleton
            variant="profile"
            [animation]="selectedAnimation"
            [loading]="showLoading"
          ></app-skeleton>
        </div>

        <!-- Table Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Data Table</h3>
          <app-skeleton
            variant="table"
            [animation]="selectedAnimation"
            [loading]="showLoading"
            [tableColumns]="4"
            [tableRows]="4"
          ></app-skeleton>
        </div>
      </div>

      <!-- Animation Types -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
        <h3 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700 tw-mb-6">Animation Types</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <div class="tw-space-y-3">
            <h4 class="tw-font-medium tw-text-emerald-green-600">Pulse</h4>
            <app-skeleton
              variant="default"
              animation="pulse"
              [loading]="true"
              [count]="3"
              [height]="16"
            ></app-skeleton>
          </div>

          <div class="tw-space-y-3">
            <h4 class="tw-font-medium tw-text-emerald-green-600">Static</h4>
            <app-skeleton
              variant="default"
              animation="none"
              [loading]="true"
              [count]="3"
              [height]="16"
            ></app-skeleton>
          </div>
        </div>
      </div>

      <!-- Real-world Examples -->
      <div class="tw-space-y-6">
        <h3 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700">Real-world Use Cases</h3>

        <!-- Business Directory Loading -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700">Business Directory Loading</h4>
            <app-button
              variant="primary"
              size="sm"
              (click)="toggleBusinessLoad()"
            >
              {{ businessLoading ? 'Stop Loading' : 'Simulate Loading' }}
            </app-button>
          </div>

          @if (businessLoading) {
            <!-- Featured Business -->
            <div class="tw-mb-6">
              <app-skeleton
                variant="card"
                [loading]="true"
                [showImage]="true"
                [imageHeight]="200"
              ></app-skeleton>
            </div>

            <!-- Business List -->
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
              @for (i of [1,2,3,4,5,6]; track i) {
                <app-skeleton
                  variant="card"
                  [loading]="true"
                  [showImage]="true"
                  [imageHeight]="120"
                ></app-skeleton>
              }
            </div>
          } @else {
            <!-- Actual Business Content -->
            <div class="tw-text-center tw-py-12 tw-text-beige-500">
              <p>Click "Simulate Loading" to see skeleton placeholders</p>
            </div>
          }
        </div>

        <!-- User Dashboard Loading -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700">Dashboard Loading</h4>
            <app-button
              variant="secondary"
              size="sm"
              (click)="toggleDashboardLoad()"
            >
              {{ dashboardLoading ? 'Stop Loading' : 'Simulate Loading' }}
            </app-button>
          </div>

          @if (dashboardLoading) {
            <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-6">
              <!-- Profile Section -->
              <div class="lg:tw-col-span-1">
                <app-skeleton
                  variant="profile"
                  [loading]="true"
                ></app-skeleton>
              </div>

              <!-- Content Section -->
              <div class="lg:tw-col-span-3 tw-space-y-6">
                <!-- Stats Cards -->
                <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                  @for (i of [1,2,3]; track i) {
                    <div class="tw-p-4 tw-border tw-border-beige-200 tw-rounded-lg tw-space-y-2">
                      <app-skeleton
                        variant="default"
                        [loading]="true"
                        [count]="2"
                        [height]="16"
                      ></app-skeleton>
                    </div>
                  }
                </div>

                <!-- Activity List -->
                <app-skeleton
                  variant="list"
                  [loading]="true"
                  [count]="4"
                  [showAvatar]="true"
                  [showAction]="false"
                  [avatarSize]="32"
                ></app-skeleton>
              </div>
            </div>
          } @else {
            <div class="tw-text-center tw-py-12 tw-text-beige-500">
              <p>Click "Simulate Loading" to see dashboard skeleton</p>
            </div>
          }
        </div>

        <!-- Data Table Loading -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <h4 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700">Data Table Loading</h4>
            <app-button
              variant="outline"
              size="sm"
              (click)="toggleTableLoad()"
            >
              {{ tableLoading ? 'Stop Loading' : 'Simulate Loading' }}
            </app-button>
          </div>

          @if (tableLoading) {
            <app-skeleton
              variant="table"
              [loading]="true"
              [tableColumns]="6"
              [tableRows]="8"
            ></app-skeleton>
          } @else {
            <div class="tw-text-center tw-py-12 tw-text-beige-500">
              <p>Click "Simulate Loading" to see table skeleton</p>
            </div>
          }
        </div>
      </div>

      <!-- Custom Skeleton Examples -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
        <h3 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700 tw-mb-6">Custom Skeleton Patterns</h3>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
          <!-- Article Preview -->
          <div class="tw-space-y-4">
            <h4 class="tw-font-medium tw-text-emerald-green-600">Article Preview</h4>
            <app-skeleton
              variant="custom"
              [loading]="showLoading"
            >
              <div class="tw-space-y-4">
                <!-- Title -->
                <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-6 tw-w-4/5"></div>
                <!-- Subtitle -->
                <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-3/5"></div>
                <!-- Image -->
                <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-48 tw-w-full"></div>
                <!-- Content lines -->
                <div class="tw-space-y-2">
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-full"></div>
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-5/6"></div>
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-4/6"></div>
                </div>
                <!-- Meta info -->
                <div class="tw-flex tw-justify-between tw-items-center">
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-24"></div>
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-16"></div>
                </div>
              </div>
            </app-skeleton>
          </div>

          <!-- Message Thread -->
          <div class="tw-space-y-4">
            <h4 class="tw-font-medium tw-text-emerald-green-600">Message Thread</h4>
            <app-skeleton
              variant="custom"
              [loading]="showLoading"
            >
              <div class="tw-space-y-4">
                @for (i of [1,2,3]; track i) {
                  <div class="tw-flex tw-space-x-3" [class.tw-flex-row-reverse]="i % 2 === 0">
                    <!-- Avatar -->
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-circle tw-w-8 tw-h-8 tw-flex-shrink-0"></div>
                    <!-- Message -->
                    <div class="tw-space-y-1 tw-max-w-xs">
                      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-3 tw-w-16"></div>
                      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded"
                           [style.height.px]="16 + (i * 8)"
                           [style.width]="(60 + i * 20) + '%'"></div>
                    </div>
                  </div>
                }
              </div>
            </app-skeleton>
          </div>
        </div>
      </div>

      <!-- Implementation Guide -->
      <div class="tw-bg-emerald-green-50 tw-p-6 tw-rounded-xl tw-border tw-border-emerald-green-200">
        <h3 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Implementation Guide</h3>
        <div class="tw-space-y-4 tw-text-sm">
          <div>
            <h4 class="tw-font-semibold tw-text-emerald-green-600 tw-mb-2">Basic Usage:</h4>
            <pre class="tw-bg-white tw-p-3 tw-rounded tw-text-beige-800 tw-overflow-x-auto"><code>&lt;app-skeleton variant="card" [loading]="isLoading"&gt;&lt;/app-skeleton&gt;</code></pre>
          </div>

          <div>
            <h4 class="tw-font-semibold tw-text-emerald-green-600 tw-mb-2">Available Variants:</h4>
            <ul class="tw-list-disc tw-list-inside tw-text-emerald-green-700 tw-space-y-1">
              <li><code>default</code> - Simple line skeletons</li>
              <li><code>card</code> - Card layout with image and content</li>
              <li><code>list</code> - List items with avatars and actions</li>
              <li><code>profile</code> - User profile layout</li>
              <li><code>table</code> - Data table structure</li>
              <li><code>custom</code> - Use with content projection</li>
            </ul>
          </div>

          <div>
            <h4 class="tw-font-semibold tw-text-emerald-green-600 tw-mb-2">Animation Options:</h4>
            <ul class="tw-list-disc tw-list-inside tw-text-emerald-green-700 tw-space-y-1">
              <li><code>pulse</code> - Gentle opacity animation</li>
              <li><code>none</code> - No animation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tw-skeleton-element {
      @apply tw-bg-gradient-to-r tw-from-beige-200 tw-via-beige-300 tw-to-beige-200;
    }

    .tw-skeleton-pulse {
      @apply tw-animate-pulse;
    }

    .tw-skeleton-rounded {
      @apply tw-rounded-md;
    }

    .tw-skeleton-circle {
      @apply tw-rounded-full;
    }
  `]
})
export class SkeletonsSectionComponent {
  selectedAnimation: SkeletonAnimation = 'pulse';
  selectedShape: SkeletonShape = 'rounded';
  showLoading: boolean = true;

  businessLoading: boolean = false;
  dashboardLoading: boolean = false;
  tableLoading: boolean = false;

  toggleBusinessLoad() {
    this.businessLoading = !this.businessLoading;
    if (this.businessLoading) {
      setTimeout(() => this.businessLoading = false, 5000);
    }
  }

  toggleDashboardLoad() {
    this.dashboardLoading = !this.dashboardLoading;
    if (this.dashboardLoading) {
      setTimeout(() => this.dashboardLoading = false, 4000);
    }
  }

  toggleTableLoad() {
    this.tableLoading = !this.tableLoading;
    if (this.tableLoading) {
      setTimeout(() => this.tableLoading = false, 3000);
    }
  }
}
