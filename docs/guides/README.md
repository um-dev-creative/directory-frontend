# Design System Guides

This directory contains guides and documentation for the overall design system, brand guidelines, and general development patterns.

## 🎨 Brand & Design

### [Brand Colors Guide](./BRAND_COLORS_GUIDE.md)
Complete documentation of the brand color palette including:

- **Primary Colors**
  - Emerald Green (`#10b981`) - Main brand color
  - Coral (`#f97316`) - Secondary accent color
  - Sky Blue (`#0ea5e9`) - Information and links
  - Beige (`#d6d3d1`) - Neutral backgrounds

- **Color Variations**
  - Light/dark variations (50-950 scale)
  - Usage guidelines for each color
  - Accessibility considerations
  - Tailwind CSS class mappings

- **Implementation**
  - Custom Tailwind CSS configuration
  - Brand color classes (`tw-bg-emerald-green-500`)
  - Consistent usage patterns

## 🎯 Design Principles

### 1. Brand Consistency
- Uniform color usage across all components
- Consistent spacing and typography scale
- Standardized interaction patterns

### 2. Accessibility First
- WCAG 2.1 AA compliance
- High contrast ratios for all text
- Keyboard navigation support
- Screen reader compatibility

### 3. Performance Optimization
- Lightweight CSS with Tailwind purging
- Optimized animations (reduced motion support)
- Efficient component implementations

### 4. Developer Experience
- Clear documentation and examples
- TypeScript support throughout
- Predictable API patterns

## 📋 Usage Guidelines

### Color Selection
```css
/* Primary actions and CTAs */
.primary-action { @apply tw-bg-emerald-green-500; }

/* Secondary actions and highlights */
.secondary-action { @apply tw-bg-coral-500; }

/* Information and links */
.info-element { @apply tw-text-sky-blue-600; }

/* Neutral backgrounds and text */
.neutral-bg { @apply tw-bg-beige-100; }
```

### Component Styling
```typescript
// Use consistent brand classes
const buttonClasses = {
  primary: 'tw-bg-emerald-green-500 tw-text-white',
  secondary: 'tw-bg-coral-500 tw-text-white',
  outline: 'tw-border-emerald-green-500 tw-text-emerald-green-600'
};
```

## 🔄 Future Additions

Planned guides for this section:
- Typography scale and usage
- Spacing and layout guidelines  
- Icon system documentation
- Animation and transition standards
- Responsive design patterns

## 📞 Implementation Support

For questions about:
- **Brand colors**: See the Brand Colors Guide
- **Component-specific styling**: Check [../components/](../components/)
- **General design patterns**: Review this directory

---

*For component-specific documentation, see [../components/](../components/)*
