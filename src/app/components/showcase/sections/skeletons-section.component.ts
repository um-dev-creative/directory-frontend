import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent, Button, type SkeletonAnimation, type SkeletonShape } from '../../ui';

@Component({
  selector: 'app-skeletons-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent, Button],
  template: `
    <section class="space-y-8">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h2 class="text-3xl font-bold text-emerald-green-600">
          Skeleton Components
        </h2>
        <p class="text-lg text-beige-600 max-w-3xl mx-auto">
          Provide visual feedback during loading states with beautiful skeleton placeholders.
          Perfect for improving perceived performance and user experience.
        </p>
      </div>

      <!-- Interactive Controls -->
      <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
        <div class="flex flex-wrap items-center gap-6 mb-6">
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-beige-700">Animation:</label>
            <select
              [(ngModel)]="selectedAnimation"
              class="px-3 py-1 border border-beige-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-green-500"
            >
              <option value="pulse">Pulse</option>
              <option value="none">None</option>
            </select>
          </div>

          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-beige-700">Shape:</label>
            <select
              [(ngModel)]="selectedShape"
              class="px-3 py-1 border border-beige-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-green-500"
            >
              <option value="rounded">Rounded</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              [(ngModel)]="showLoading"
              class="w-4 h-4 text-emerald-green-600 focus:ring-emerald-green-500 border-beige-300 rounded"
            >
            <span class="text-sm font-medium text-beige-700">Show Loading</span>
          </label>
        </div>
      </div>

      <!-- Variant Showcase -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Card Skeleton -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Card Layout</h3>
          <app-skeleton
            variant="card"
            [animation]="selectedAnimation"
            [loading]="showLoading"
            [showImage]="true"
            [imageHeight]="180"
          ></app-skeleton>
        </div>

        <!-- List Skeleton -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">List Items</h3>
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Profile Card</h3>
          <app-skeleton
            variant="profile"
            [animation]="selectedAnimation"
            [loading]="showLoading"
          ></app-skeleton>
        </div>

        <!-- Table Skeleton -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Data Table</h3>
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
      <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
        <h3 class="text-xl font-semibold text-emerald-green-700 mb-6">Animation Types</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <h4 class="font-medium text-emerald-green-600">Pulse</h4>
            <app-skeleton
              variant="default"
              animation="pulse"
              [loading]="true"
              [count]="3"
              [height]="16"
            ></app-skeleton>
          </div>

          <div class="space-y-3">
            <h4 class="font-medium text-emerald-green-600">Static</h4>
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
      <div class="space-y-6">
        <h3 class="text-xl font-semibold text-emerald-green-700">Real-world Use Cases</h3>

        <!-- Business Directory Loading -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-lg font-semibold text-emerald-green-700">Business Directory Loading</h4>
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
            <div class="mb-6">
              <app-skeleton
                variant="card"
                [loading]="true"
                [showImage]="true"
                [imageHeight]="200"
              ></app-skeleton>
            </div>

            <!-- Business List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div class="text-center py-12 text-beige-500">
              <p>Click "Simulate Loading" to see skeleton placeholders</p>
            </div>
          }
        </div>

        <!-- User Dashboard Loading -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-lg font-semibold text-emerald-green-700">Dashboard Loading</h4>
            <app-button
              variant="secondary"
              size="sm"
              (click)="toggleDashboardLoad()"
            >
              {{ dashboardLoading ? 'Stop Loading' : 'Simulate Loading' }}
            </app-button>
          </div>

          @if (dashboardLoading) {
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <!-- Profile Section -->
              <div class="lg:col-span-1">
                <app-skeleton
                  variant="profile"
                  [loading]="true"
                ></app-skeleton>
              </div>

              <!-- Content Section -->
              <div class="lg:col-span-3 space-y-6">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  @for (i of [1,2,3]; track i) {
                    <div class="p-4 border border-beige-200 rounded-lg space-y-2">
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
            <div class="text-center py-12 text-beige-500">
              <p>Click "Simulate Loading" to see dashboard skeleton</p>
            </div>
          }
        </div>

        <!-- Data Table Loading -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-lg font-semibold text-emerald-green-700">Data Table Loading</h4>
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
            <div class="text-center py-12 text-beige-500">
              <p>Click "Simulate Loading" to see table skeleton</p>
            </div>
          }
        </div>
      </div>

      <!-- Custom Skeleton Examples -->
      <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
        <h3 class="text-xl font-semibold text-emerald-green-700 mb-6">Custom Skeleton Patterns</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Article Preview -->
          <div class="space-y-4">
            <h4 class="font-medium text-emerald-green-600">Article Preview</h4>
            <app-skeleton
              variant="custom"
              [loading]="showLoading"
            >
              <div class="space-y-4">
                <!-- Title -->
                <div class="skeleton-element skeleton-pulse skeleton-rounded h-6 w-4/5"></div>
                <!-- Subtitle -->
                <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-3/5"></div>
                <!-- Image -->
                <div class="skeleton-element skeleton-pulse skeleton-rounded h-48 w-full"></div>
                <!-- Content lines -->
                <div class="space-y-2">
                  <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-full"></div>
                  <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-5/6"></div>
                  <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-4/6"></div>
                </div>
                <!-- Meta info -->
                <div class="flex justify-between items-center">
                  <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-24"></div>
                  <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-16"></div>
                </div>
              </div>
            </app-skeleton>
          </div>

          <!-- Message Thread -->
          <div class="space-y-4">
            <h4 class="font-medium text-emerald-green-600">Message Thread</h4>
            <app-skeleton
              variant="custom"
              [loading]="showLoading"
            >
              <div class="space-y-4">
                @for (i of [1,2,3]; track i) {
                  <div class="flex space-x-3" [class.flex-row-reverse]="i % 2 === 0">
                    <!-- Avatar -->
                    <div class="skeleton-element skeleton-pulse skeleton-circle w-8 h-8 shrink-0"></div>
                    <!-- Message -->
                    <div class="space-y-1 max-w-xs">
                      <div class="skeleton-element skeleton-pulse skeleton-rounded h-3 w-16"></div>
                      <div class="skeleton-element skeleton-pulse skeleton-rounded"
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
      <div class="bg-emerald-green-50 p-6 rounded-xl border border-emerald-green-200">
        <h3 class="text-xl font-semibold text-emerald-green-700 mb-4">Implementation Guide</h3>
        <div class="space-y-4 text-sm">
          <div>
            <h4 class="font-semibold text-emerald-green-600 mb-2">Basic Usage:</h4>
            <pre class="bg-white p-3 rounded text-beige-800 overflow-x-auto"><code>&lt;app-skeleton variant="card" [loading]="isLoading"&gt;&lt;/app-skeleton&gt;</code></pre>
          </div>

          <div>
            <h4 class="font-semibold text-emerald-green-600 mb-2">Available Variants:</h4>
            <ul class="list-disc list-inside text-emerald-green-700 space-y-1">
              <li><code>default</code> - Simple line skeletons</li>
              <li><code>card</code> - Card layout with image and content</li>
              <li><code>list</code> - List items with avatars and actions</li>
              <li><code>profile</code> - User profile layout</li>
              <li><code>table</code> - Data table structure</li>
              <li><code>custom</code> - Use with content projection</li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-emerald-green-600 mb-2">Animation Options:</h4>
            <ul class="list-disc list-inside text-emerald-green-700 space-y-1">
              <li><code>pulse</code> - Gentle opacity animation</li>
              <li><code>none</code> - No animation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @reference "../../../../styles.css";

    .skeleton-element {
      @apply bg-gradient-to-r from-beige-200 via-beige-300 to-beige-200;
    }

    .skeleton-pulse {
      @apply animate-pulse;
    }

    .skeleton-rounded {
      @apply rounded-md;
    }

    .skeleton-circle {
      @apply rounded-full;
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
