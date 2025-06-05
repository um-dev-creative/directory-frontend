import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent, type SkeletonVariant, type SkeletonAnimation, type SkeletonShape } from '..';

@Component({
  selector: 'app-skeleton-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent],
  template: `
    <div class="tw-max-w-6xl tw-mx-auto tw-p-8 tw-space-y-12">
      <!-- Header -->
      <div class="tw-text-center tw-space-y-4">
        <h1 class="tw-text-4xl tw-font-bold tw-text-emerald-green-600">
          Skeleton Component Examples
        </h1>
        <p class="tw-text-lg tw-text-beige-600 tw-max-w-2xl tw-mx-auto">
          Comprehensive showcase of the Skeleton component with different variants, animations, and use cases
        </p>
      </div>

      <!-- Controls -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Controls</h3>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-700 tw-mb-2">
              Animation
            </label>
            <select
              [(ngModel)]="selectedAnimation"
              class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-beige-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-emerald-green-500"
            >
              <option value="pulse">Pulse</option>
              <option value="wave">Wave</option>
              <option value="shimmer">Shimmer</option>
              <option value="none">None</option>
            </select>
          </div>

          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-beige-700 tw-mb-2">
              Shape
            </label>
            <select
              [(ngModel)]="selectedShape"
              class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-beige-300 tw-rounded-md tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-emerald-green-500"
            >
              <option value="rectangle">Rectangle</option>
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <div>
            <label class="tw-flex tw-items-center tw-space-x-2 tw-mt-6">
              <input
                type="checkbox"
                [(ngModel)]="isLoading"
                class="tw-w-4 tw-h-4 tw-text-emerald-green-600 tw-focus:ring-emerald-green-500 tw-border-beige-300 tw-rounded"
              >
              <span class="tw-text-sm tw-font-medium tw-text-beige-700">Show Loading</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Basic Variants -->
      <section class="tw-space-y-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">Basic Variants</h2>

        <!-- Default Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Default Skeleton</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton
                variant="default"
                [animation]="selectedAnimation"
                [shape]="selectedShape"
                [loading]="isLoading"
                [count]="3"
                [height]="20"
                width="100%"
              ></app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="default"
  animation="{{selectedAnimation}}"
  shape="{{selectedShape}}"
  [loading]="{{isLoading}}"
  [count]="3"
  [height]="20"
  width="100%"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Card Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Card Skeleton</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton
                variant="card"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [showImage]="true"
                [imageHeight]="200"
              ></app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="card"
  animation="{{selectedAnimation}}"
  [loading]="{{isLoading}}"
  [showImage]="true"
  [imageHeight]="200"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- List Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">List Skeleton</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton
                variant="list"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [count]="4"
                [showAvatar]="true"
                [showAction]="true"
                [avatarSize]="48"
              ></app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="list"
  animation="{{selectedAnimation}}"
  [loading]="{{isLoading}}"
  [count]="4"
  [showAvatar]="true"
  [showAction]="true"
  [avatarSize]="48"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Profile Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Profile Skeleton</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton
                variant="profile"
                [animation]="selectedAnimation"
                [loading]="isLoading"
              ></app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="profile"
  animation="{{selectedAnimation}}"
  [loading]="{{isLoading}}"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Table Skeleton -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Table Skeleton</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton
                variant="table"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [tableColumns]="4"
                [tableRows]="5"
              ></app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="table"
  animation="{{selectedAnimation}}"
  [loading]="{{isLoading}}"
  [tableColumns]="4"
  [tableRows]="5"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Animation Showcase -->
      <section class="tw-space-y-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">Animation Types</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Pulse</h3>
            <app-skeleton
              variant="default"
              animation="pulse"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Wave</h3>
            <app-skeleton
              variant="default"
              animation="wave"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Shimmer</h3>
            <app-skeleton
              variant="default"
              animation="shimmer"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">None</h3>
            <app-skeleton
              variant="default"
              animation="none"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>
        </div>
      </section>

      <!-- Shape Variations -->
      <section class="tw-space-y-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">Shape Variations</h2>

        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Rectangle</h3>
            <app-skeleton
              variant="default"
              shape="rectangle"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Rounded</h3>
            <app-skeleton
              variant="default"
              shape="rounded"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm tw-text-center">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Circle</h3>
            <div class="tw-flex tw-justify-center tw-space-x-4">
              <app-skeleton
                variant="custom"
                [loading]="true"
              >
                <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-circle" style="width: 60px; height: 60px;"></div>
              </app-skeleton>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Configurations -->
      <section class="tw-space-y-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">Custom Configurations</h2>

        <!-- Custom Lines -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Custom Line Patterns</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton
                variant="default"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [customLines]="customLinePattern"
              ></app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="default"
  [customLines]="[
    {{ '{' }}height: 24, width: '100%'{{ '}' }},
    {{ '{' }}height: 20, width: '85%'{{ '}' }},
    {{ '{' }}height: 20, width: '70%'{{ '}' }},
    {{ '{' }}height: 16, width: '60%'{{ '}' }},
    {{ '{' }}height: 16, width: '40%'{{ '}' }}
  ]"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Custom Skeleton with Content Projection -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Custom Skeleton with Content Projection</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div>
              <app-skeleton variant="custom" [loading]="isLoading">
                <div class="tw-flex tw-items-start tw-space-x-4">
                  <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-circle tw-w-16 tw-h-16 tw-flex-shrink-0"></div>
                  <div class="tw-flex-1 tw-space-y-3">
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-6 tw-w-3/4"></div>
                    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-1/2"></div>
                    <div class="tw-flex tw-space-x-2">
                      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-8 tw-w-20"></div>
                      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-8 tw-w-16"></div>
                    </div>
                  </div>
                </div>
              </app-skeleton>
            </div>
            <div class="tw-bg-beige-50 tw-p-4 tw-rounded-lg">
              <pre class="tw-text-sm tw-text-beige-700 tw-whitespace-pre-wrap"><code>&lt;app-skeleton variant="custom" [loading]="isLoading"&gt;
  &lt;div class="tw-flex tw-items-start tw-space-x-4"&gt;
    &lt;div class="tw-skeleton-element tw-skeleton-pulse
                tw-skeleton-circle tw-w-16 tw-h-16"&gt;&lt;/div&gt;
    &lt;div class="tw-flex-1 tw-space-y-3"&gt;
      &lt;div class="tw-skeleton-element tw-skeleton-pulse
                  tw-skeleton-rounded tw-h-6 tw-w-3/4"&gt;&lt;/div&gt;
      &lt;div class="tw-skeleton-element tw-skeleton-pulse
                  tw-skeleton-rounded tw-h-4 tw-w-1/2"&gt;&lt;/div&gt;
      &lt;div class="tw-flex tw-space-x-2"&gt;
        &lt;div class="tw-skeleton-element tw-skeleton-pulse
                    tw-skeleton-rounded tw-h-8 tw-w-20"&gt;&lt;/div&gt;
        &lt;div class="tw-skeleton-element tw-skeleton-pulse
                    tw-skeleton-rounded tw-h-8 tw-w-16"&gt;&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Real-world Use Cases -->
      <section class="tw-space-y-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">Real-world Use Cases</h2>

        <!-- Blog Post Loading -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Blog Post Loading</h3>
          <div class="tw-space-y-6">
            <!-- Featured Post -->
            <app-skeleton
              variant="card"
              [loading]="isLoading"
              [showImage]="true"
              [imageHeight]="300"
            ></app-skeleton>

            <!-- Post List -->
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
              @for (i of [1,2,3]; track i) {
                <app-skeleton
                  variant="card"
                  [loading]="isLoading"
                  [showImage]="true"
                  [imageHeight]="200"
                ></app-skeleton>
              }
            </div>
          </div>
        </div>

        <!-- User Dashboard -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">User Dashboard</h3>
          <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-6">
            <!-- Profile Section -->
            <div class="lg:tw-col-span-1">
              <app-skeleton
                variant="profile"
                [loading]="isLoading"
              ></app-skeleton>
            </div>

            <!-- Content Section -->
            <div class="lg:tw-col-span-3 tw-space-y-6">
              <!-- Stats -->
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
                @for (i of [1,2,3]; track i) {
                  <app-skeleton
                    variant="default"
                    [loading]="isLoading"
                    [count]="2"
                    [height]="20"
                  ></app-skeleton>
                }
              </div>

              <!-- Recent Activity -->
              <app-skeleton
                variant="list"
                [loading]="isLoading"
                [count]="5"
                [showAvatar]="true"
                [showAction]="false"
                [avatarSize]="32"
              ></app-skeleton>
            </div>
          </div>
        </div>

        <!-- Data Table Loading -->
        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Data Table Loading</h3>
          <app-skeleton
            variant="table"
            [loading]="isLoading"
            [tableColumns]="6"
            [tableRows]="8"
          ></app-skeleton>
        </div>
      </section>

      <!-- Integration Demo -->
      <section class="tw-space-y-8">
        <h2 class="tw-text-2xl tw-font-bold tw-text-emerald-green-600">Loading State Integration</h2>

        <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-beige-200 tw-shadow-sm">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700">Simulate Data Loading</h3>
            <button
              (click)="simulateLoading()"
              [disabled]="simulationLoading"
              class="tw-px-4 tw-py-2 tw-bg-emerald-green-600 tw-text-white tw-rounded-md tw-hover:bg-emerald-green-700 tw-disabled:opacity-50 tw-disabled:cursor-not-allowed tw-transition-colors"
            >
              {{ simulationLoading ? 'Loading...' : 'Load Data' }}
            </button>
          </div>

          <!-- Skeleton during loading -->
          @if (simulationLoading) {
            <app-skeleton
              variant="list"
              [loading]="true"
              [count]="3"
              [showAvatar]="true"
              [showAction]="true"
            ></app-skeleton>
          } @else {
            <!-- Actual content when loaded -->
            <div class="tw-space-y-4">
              @for (item of mockData; track item.id) {
                <div class="tw-flex tw-items-center tw-space-x-4 tw-p-4 tw-border tw-border-beige-200 tw-rounded-lg">
                  <div class="tw-w-12 tw-h-12 tw-bg-emerald-green-100 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                    <span class="tw-text-emerald-green-600 tw-font-semibold">{{ item.name.charAt(0) }}</span>
                  </div>
                  <div class="tw-flex-1">
                    <h4 class="tw-font-semibold tw-text-emerald-green-800">{{ item.name }}</h4>
                    <p class="tw-text-beige-600">{{ item.description }}</p>
                  </div>
                  <div class="tw-flex tw-space-x-2">
                    <span class="tw-px-3 tw-py-1 tw-bg-coral-100 tw-text-coral-700 tw-rounded-full tw-text-sm">{{ item.status }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
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
export class SkeletonExamplesComponent implements OnInit {
  selectedAnimation: SkeletonAnimation = 'pulse';
  selectedShape: SkeletonShape = 'rounded';
  isLoading: boolean = true;
  simulationLoading: boolean = false;

  customLinePattern = [
    { height: 24, width: '100%' },
    { height: 20, width: '85%' },
    { height: 20, width: '70%' },
    { height: 16, width: '60%' },
    { height: 16, width: '40%' }
  ];

  mockData = [
    {
      id: 1,
      name: 'John Smith',
      description: 'Senior Developer at Tech Corp',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      description: 'Product Manager at Design Inc',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      description: 'UX Designer at Creative Studio',
      status: 'Pending'
    }
  ];

  ngOnInit() {
    // Demo auto-toggle for visibility
    setInterval(() => {
      if (!this.simulationLoading) {
        // Auto demo toggle every 5 seconds if not in simulation mode
        // this.isLoading = !this.isLoading;
      }
    }, 5000);
  }

  simulateLoading() {
    this.simulationLoading = true;

    // Simulate API call with random delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds

    setTimeout(() => {
      this.simulationLoading = false;
    }, delay);
  }
}
