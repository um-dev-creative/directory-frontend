// filepath: src/app/components/ui/ui-variant.ts
export enum UiVariant {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Dark = 'dark',
  Light = 'light',
  Alert = 'alert',
  Outline = 'outline',
  // add more as needed
}

// backward-compatible type for inputs that may still be string-literals
export type UiVariantType = UiVariant | string;

