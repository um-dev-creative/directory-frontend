# Skeleton Component Implementation Guide

## Overview

The Skeleton component provides beautiful loading placeholders to improve perceived performance and user experience. It offers multiple predefined variants and extensive customization options.

## Installation

The Skeleton component is part of the UI component library and can be imported directly:

```typescript
import { SkeletonComponent } from './components/ui';
```

## Basic Usage

### Simple Lines
```html
<app-skeleton
  variant="default"
  [loading]="isLoading"
  [count]="3"
  [height]="20"
  width="100%"
></app-skeleton>
```

### Card Layout
```html
<app-skeleton
  variant="card"
  [loading]="isLoading"
  [showImage]="true"
  [imageHeight]="200"
></app-skeleton>
```

### List Items
```html
<app-skeleton
  variant="list"
  [loading]="isLoading"
  [count]="4"
  [showAvatar]="true"
  [showAction]="true"
  [avatarSize]="48"
></app-skeleton>
```

## Variants

### 1. Default (`variant="default"`)
Simple horizontal lines, perfect for text content loading.

**Properties:**
- `count`: Number of lines (default: 3)
- `height`: Height of each line in pixels (default: 20)
- `width`: Width of lines (default: "100%")
- `customLines`: Array of custom line configurations

**Example:**
```html
<app-skeleton
  variant="default"
  [count]="5"
  [height]="16"
  [customLines]="[
    {height: 24, width: '100%'},
    {height: 20, width: '85%'},
    {height: 20, width: '70%'}
  ]"
></app-skeleton>
```

### 2. Card (`variant="card"`)
Mimics card layout with optional image and content sections.

**Properties:**
- `showImage`: Show image placeholder (default: true)
- `imageHeight`: Height of image placeholder in pixels (default: 200)

**Example:**
```html
<app-skeleton
  variant="card"
  [showImage]="true"
  [imageHeight]="250"
></app-skeleton>
```

### 3. List (`variant="list"`)
List items with avatars and optional actions.

**Properties:**
- `count`: Number of list items (default: 3)
- `showAvatar`: Show avatar placeholder (default: true)
- `showAction`: Show action button placeholder (default: false)
- `avatarSize`: Size of avatar in pixels (default: 40)

**Example:**
```html
<app-skeleton
  variant="list"
  [count]="5"
  [showAvatar]="true"
  [showAction]="true"
  [avatarSize]="56"
></app-skeleton>
```

### 4. Profile (`variant="profile"`)
User profile layout with centered avatar and information.

**Example:**
```html
<app-skeleton variant="profile"></app-skeleton>
```

### 5. Table (`variant="table"`)
Data table structure with headers and rows.

**Properties:**
- `tableColumns`: Number of columns (default: 4)
- `tableRows`: Number of rows (default: 5)

**Example:**
```html
<app-skeleton
  variant="table"
  [tableColumns]="6"
  [tableRows]="10"
></app-skeleton>
```

### 6. Custom (`variant="custom"`)
Use content projection for completely custom layouts.

**Example:**
```html
<app-skeleton variant="custom" [loading]="isLoading">
  <div class="tw-flex tw-items-start tw-space-x-4">
    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-circle tw-w-16 tw-h-16"></div>
    <div class="tw-flex-1 tw-space-y-3">
      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-6 tw-w-3/4"></div>
      <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-1/2"></div>
    </div>
  </div>
</app-skeleton>
```

## Animations

### Animation Types
- `pulse`: Gentle opacity animation (default)
- `wave`: Wave effect across elements
- `shimmer`: Shimmer effect with gradient
- `none`: No animation

**Example:**
```html
<app-skeleton
  variant="default"
  animation="shimmer"
  [loading]="isLoading"
></app-skeleton>
```

## Shapes

### Shape Options
- `rounded`: Rounded corners (default)
- `rectangle`: Sharp corners
- `circle`: Circular (for avatars)

**Example:**
```html
<app-skeleton
  variant="default"
  shape="rectangle"
  [loading]="isLoading"
></app-skeleton>
```

## Custom Styling Classes

For custom skeletons, use these utility classes:

### Base Classes
- `tw-skeleton-element`: Base skeleton styling
- `tw-skeleton-line`: For line elements

### Animation Classes
- `tw-skeleton-pulse`: Pulse animation
- `tw-skeleton-wave`: Wave animation
- `tw-skeleton-shimmer`: Shimmer animation

### Shape Classes
- `tw-skeleton-rounded`: Rounded corners
- `tw-skeleton-rectangle`: Sharp corners
- `tw-skeleton-circle`: Circular shape

## Real-world Examples

### Blog Post Loading
```html
<!-- Featured post -->
<app-skeleton
  variant="card"
  [loading]="loadingPosts"
  [showImage]="true"
  [imageHeight]="300"
></app-skeleton>

<!-- Post list -->
<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
  <app-skeleton
    *ngFor="let post of placeholderPosts"
    variant="card"
    [loading]="loadingPosts"
    [showImage]="true"
    [imageHeight]="200"
  ></app-skeleton>
</div>
```

### User Dashboard
```html
<div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-6">
  <!-- Profile section -->
  <div class="lg:tw-col-span-1">
    <app-skeleton
      variant="profile"
      [loading]="loadingProfile"
    ></app-skeleton>
  </div>
  
  <!-- Content section -->
  <div class="lg:tw-col-span-3">
    <app-skeleton
      variant="list"
      [loading]="loadingActivity"
      [count]="5"
      [showAvatar]="true"
    ></app-skeleton>
  </div>
</div>
```

### Data Table
```html
<app-skeleton
  variant="table"
  [loading]="loadingData"
  [tableColumns]="6"
  [tableRows]="8"
></app-skeleton>
```

## Integration with Loading States

### Component Integration
```typescript
export class MyComponent {
  isLoading = true;
  data: any[] = [];

  async loadData() {
    this.isLoading = true;
    try {
      this.data = await this.dataService.fetchData();
    } finally {
      this.isLoading = false;
    }
  }
}
```

### Template Integration
```html
<div class="tw-space-y-4">
  <!-- Show skeleton while loading -->
  <app-skeleton
    variant="list"
    [loading]="isLoading"
    [count]="5"
  ></app-skeleton>
  
  <!-- Show actual content when loaded -->
  <div *ngIf="!isLoading" class="tw-space-y-4">
    <div *ngFor="let item of data" class="tw-p-4 tw-border tw-rounded">
      {{ item.name }}
    </div>
  </div>
</div>
```

## Accessibility

The Skeleton component includes accessibility features:

- `aria-label`: Describes the loading content (default: "Loading content")
- `role`: ARIA role (default: "status")
- Screen reader friendly

**Custom accessibility:**
```html
<app-skeleton
  variant="list"
  [loading]="isLoading"
  ariaLabel="Loading user profiles"
  role="progressbar"
></app-skeleton>
```

## Performance Tips

1. **Use appropriate variants**: Choose the variant that best matches your content structure
2. **Optimize count**: Don't render more skeleton items than necessary
3. **Consider animation**: Use `animation="none"` for better performance on slower devices
4. **Custom patterns**: Use `variant="custom"` for unique layouts

## Troubleshooting

### Common Issues

1. **Skeleton not showing**: Ensure `[loading]="true"`
2. **Custom skeleton not rendering**: Verify `variant="custom"`
3. **Animations not working**: Check animation property spelling
4. **Table skeleton incorrect**: Verify `tableColumns` and `tableRows` are numbers

### Browser Support

The Skeleton component works in all modern browsers. CSS animations are gracefully degraded in older browsers.

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `SkeletonVariant` | `'default'` | Type of skeleton layout |
| `animation` | `SkeletonAnimation` | `'pulse'` | Animation type |
| `shape` | `SkeletonShape` | `'rounded'` | Shape of skeleton elements |
| `loading` | `boolean` | `true` | Whether to show skeleton |
| `count` | `number` | `3` | Number of items (default/list variants) |
| `height` | `number` | `20` | Height of lines in pixels |
| `width` | `string` | `'100%'` | Width of elements |
| `showImage` | `boolean` | `true` | Show image placeholder (card variant) |
| `imageHeight` | `number` | `200` | Height of image placeholder |
| `showAvatar` | `boolean` | `true` | Show avatar placeholder (list variant) |
| `showAction` | `boolean` | `false` | Show action placeholder (list variant) |
| `avatarSize` | `number` | `40` | Size of avatar in pixels |
| `tableColumns` | `number` | `4` | Number of table columns |
| `tableRows` | `number` | `5` | Number of table rows |
| `customLines` | `Array<{height: number, width: string}>` | `[]` | Custom line configurations |
| `ariaLabel` | `string` | `'Loading content'` | Accessibility label |
| `role` | `string` | `'status'` | ARIA role |

### Types

```typescript
export type SkeletonVariant = 'default' | 'card' | 'list' | 'profile' | 'table' | 'custom';
export type SkeletonAnimation = 'pulse' | 'wave' | 'shimmer' | 'none';
export type SkeletonShape = 'rectangle' | 'circle' | 'rounded';
```

## Brand Integration

The Skeleton component uses the brand color palette:
- Primary skeleton color: `beige-200`
- Gradient colors: `beige-200` to `beige-300`
- Border colors: `beige-200`

This ensures consistency with your brand design system.
