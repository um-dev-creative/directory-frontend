import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent, type SkeletonVariant, type SkeletonAnimation, type SkeletonShape } from '..';

@Component({
  selector: 'app-skeleton-examples',
  standalone: true,
  imports: [FormsModule, SkeletonComponent],
  template: `
    <div class="max-w-6xl mx-auto p-8 space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-emerald-green-600">
          Skeleton Component Examples
        </h1>
        <p class="text-lg text-beige-600 max-w-2xl mx-auto">
          Comprehensive showcase of the Skeleton component with different variants, animations, and use cases
        </p>
      </div>

      <!-- Controls -->
      <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Controls</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-beige-700 mb-2">
              Animation
            </label>
            <select
              [(ngModel)]="selectedAnimation"
              class="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-green-500"
            >
              <option value="pulse">Pulse</option>
              <option value="wave">Wave</option>
              <option value="shimmer">Shimmer</option>
              <option value="none">None</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-beige-700 mb-2">
              Shape
            </label>
            <select
              [(ngModel)]="selectedShape"
              class="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-green-500"
            >
              <option value="rectangle">Rectangle</option>
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <div>
            <label class="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                [(ngModel)]="isLoading"
                class="w-4 h-4 text-emerald-green-600 focus:ring-emerald-green-500 border-beige-300 rounded"
              >
              <span class="text-sm font-medium text-beige-700">Show Loading</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Basic Variants -->
      <section class="space-y-8">
        <h2 class="text-2xl font-bold text-emerald-green-600">Basic Variants</h2>

        <!-- Default Skeleton -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Default Skeleton</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Card Skeleton</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <app-skeleton
                variant="card"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [showImage]="true"
                [imageHeight]="200"
              ></app-skeleton>
            </div>
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">List Skeleton</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Profile Skeleton</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <app-skeleton
                variant="profile"
                [animation]="selectedAnimation"
                [loading]="isLoading"
              ></app-skeleton>
            </div>
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton
  variant="profile"
  animation="{{selectedAnimation}}"
  [loading]="{{isLoading}}"
&gt;&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Table Skeleton -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Table Skeleton</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <app-skeleton
                variant="table"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [tableColumns]="4"
                [tableRows]="5"
              ></app-skeleton>
            </div>
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton
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
      <section class="space-y-8">
        <h2 class="text-2xl font-bold text-emerald-green-600">Animation Types</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Pulse</h3>
            <app-skeleton
              variant="default"
              animation="pulse"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Wave</h3>
            <app-skeleton
              variant="default"
              animation="wave"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Shimmer</h3>
            <app-skeleton
              variant="default"
              animation="shimmer"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">None</h3>
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
      <section class="space-y-8">
        <h2 class="text-2xl font-bold text-emerald-green-600">Shape Variations</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Rectangle</h3>
            <app-skeleton
              variant="default"
              shape="rectangle"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Rounded</h3>
            <app-skeleton
              variant="default"
              shape="rounded"
              [loading]="true"
              [count]="3"
            ></app-skeleton>
          </div>

          <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm text-center">
            <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Circle</h3>
            <div class="flex justify-center space-x-4">
              <app-skeleton
                variant="custom"
                [loading]="true"
              >
                <div class="skeleton-element skeleton-pulse skeleton-circle" style="width: 60px; height: 60px;"></div>
              </app-skeleton>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Configurations -->
      <section class="space-y-8">
        <h2 class="text-2xl font-bold text-emerald-green-600">Custom Configurations</h2>

        <!-- Custom Lines -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Custom Line Patterns</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <app-skeleton
                variant="default"
                [animation]="selectedAnimation"
                [loading]="isLoading"
                [customLines]="customLinePattern"
              ></app-skeleton>
            </div>
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Custom Skeleton with Content Projection</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <app-skeleton variant="custom" [loading]="isLoading">
                <div class="flex items-start space-x-4">
                  <div class="skeleton-element skeleton-pulse skeleton-circle w-16 h-16 shrink-0"></div>
                  <div class="flex-1 space-y-3">
                    <div class="skeleton-element skeleton-pulse skeleton-rounded h-6 w-3/4"></div>
                    <div class="skeleton-element skeleton-pulse skeleton-rounded h-4 w-1/2"></div>
                    <div class="flex space-x-2">
                      <div class="skeleton-element skeleton-pulse skeleton-rounded h-8 w-20"></div>
                      <div class="skeleton-element skeleton-pulse skeleton-rounded h-8 w-16"></div>
                    </div>
                  </div>
                </div>
              </app-skeleton>
            </div>
            <div class="bg-beige-50 p-4 rounded-lg">
              <pre class="text-sm text-beige-700 whitespace-pre-wrap"><code>&lt;app-skeleton variant="custom" [loading]="isLoading"&gt;
  &lt;div class="flex items-start space-x-4"&gt;
    &lt;div class="skeleton-element skeleton-pulse
                skeleton-circle w-16 h-16"&gt;&lt;/div&gt;
    &lt;div class="flex-1 space-y-3"&gt;
      &lt;div class="skeleton-element skeleton-pulse
                  skeleton-rounded h-6 w-3/4"&gt;&lt;/div&gt;
      &lt;div class="skeleton-element skeleton-pulse
                  skeleton-rounded h-4 w-1/2"&gt;&lt;/div&gt;
      &lt;div class="flex space-x-2"&gt;
        &lt;div class="skeleton-element skeleton-pulse
                    skeleton-rounded h-8 w-20"&gt;&lt;/div&gt;
        &lt;div class="skeleton-element skeleton-pulse
                    skeleton-rounded h-8 w-16"&gt;&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/app-skeleton&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Real-world Use Cases -->
      <section class="space-y-8">
        <h2 class="text-2xl font-bold text-emerald-green-600">Real-world Use Cases</h2>

        <!-- Blog Post Loading -->
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Blog Post Loading</h3>
          <div class="space-y-6">
            <!-- Featured Post -->
            <app-skeleton
              variant="card"
              [loading]="isLoading"
              [showImage]="true"
              [imageHeight]="300"
            ></app-skeleton>

            <!-- Post List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">User Dashboard</h3>
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Profile Section -->
            <div class="lg:col-span-1">
              <app-skeleton
                variant="profile"
                [loading]="isLoading"
              ></app-skeleton>
            </div>

            <!-- Content Section -->
            <div class="lg:col-span-3 space-y-6">
              <!-- Stats -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Data Table Loading</h3>
          <app-skeleton
            variant="table"
            [loading]="isLoading"
            [tableColumns]="6"
            [tableRows]="8"
          ></app-skeleton>
        </div>
      </section>

      <!-- Integration Demo -->
      <section class="space-y-8">
        <h2 class="text-2xl font-bold text-emerald-green-600">Loading State Integration</h2>

        <div class="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-emerald-green-700">Simulate Data Loading</h3>
            <button
              (click)="simulateLoading()"
              [disabled]="simulationLoading"
              class="px-4 py-2 bg-emerald-green-600 text-white rounded-md hover:bg-emerald-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <div class="space-y-4">
              @for (item of mockData; track item.id) {
                <div class="flex items-center space-x-4 p-4 border border-beige-200 rounded-lg">
                  <div class="w-12 h-12 bg-emerald-green-100 rounded-full flex items-center justify-center">
                    <span class="text-emerald-green-600 font-semibold">{{ item.name.charAt(0) }}</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-emerald-green-800">{{ item.name }}</h4>
                    <p class="text-beige-600">{{ item.description }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <span class="px-3 py-1 bg-coral-100 text-coral-700 rounded-full text-sm">{{ item.status }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `
})
export class SkeletonExamplesComponent {
  selectedAnimation: SkeletonAnimation = 'pulse';
  selectedShape: SkeletonShape = 'rounded';
  isLoading: boolean = true;
  simulationLoading: boolean = false;

  readonly customLinePattern = [
    { height: 24, width: '100%' },
    { height: 20, width: '85%' },
    { height: 20, width: '70%' },
    { height: 16, width: '60%' },
    { height: 16, width: '40%' }
  ];

  readonly mockData = [
    { id: 1, name: 'John Smith',    description: 'Senior Developer at Tech Corp',   status: 'Active'  },
    { id: 2, name: 'Sarah Johnson', description: 'Product Manager at Design Inc',   status: 'Active'  },
    { id: 3, name: 'Mike Wilson',   description: 'UX Designer at Creative Studio',  status: 'Pending' }
  ];

  simulateLoading() {
    this.simulationLoading = true;
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => { this.simulationLoading = false; }, delay); // SSR: browser-only
  }
}
