import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SocialProvider = 'google' | 'facebook' | 'apple' | 'twitter';
export type SocialButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

@Component({
  selector: 'app-social-login-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      type="button"
      (click)="handleClick()"
      [attr.aria-label]="ariaLabel"
    >
      <!-- Spinner de Carga -->
      @if (loading) {
        <svg
          class="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      } @else {
        <!-- Icono del Proveedor -->
        <div [class]="iconClasses">
          @switch (provider) {
            @case ('google') {
              <svg viewBox="0 0 512 512" aria-hidden="true">
                <path
                  style="fill:#167EE6;"
                  d="M492.668,211.489l-208.84-0.01c-9.222,0-16.697,7.474-16.697,16.696v66.715
            c0,9.22,7.475,16.696,16.696,16.696h117.606c-12.878,33.421-36.914,61.41-67.58,79.194L384,477.589
            c80.442-46.523,128-128.152,128-219.53c0-13.011-0.959-22.312-2.877-32.785C507.665,217.317,500.757,211.489,492.668,211.489z"
                />
                <path
                  style="fill:#12B347;"
                  d="M256,411.826c-57.554,0-107.798-31.446-134.783-77.979l-86.806,50.034
            C78.586,460.443,161.34,512,256,512c46.437,0,90.254-12.503,128-34.292v-0.119l-50.147-86.81
            C310.915,404.083,284.371,411.826,256,411.826z"
                />
                <path
                  style="fill:#0F993E;"
                  d="M384,477.708v-0.119l-50.147-86.81c-22.938,13.303-49.48,21.047-77.853,21.047V512
            C302.437,512,346.256,499.497,384,477.708z"
                />
                <path
                  style="fill:#FFD500;"
                  d="M100.174,256c0-28.369,7.742-54.91,21.043-77.847l-86.806-50.034
            C12.502,165.746,0,209.444,0,256s12.502,90.254,34.411,127.881l86.806-50.034C107.916,310.91,100.174,284.369,100.174,256z"
                />
                <path
                  style="fill:#FF4B26;"
                  d="M256,100.174c37.531,0,72.005,13.336,98.932,35.519c6.643,5.472,16.298,5.077,22.383-1.008
            l47.27-47.27c6.904-6.904,6.412-18.205-0.963-24.603C378.507,23.673,319.807,0,256,0C161.34,0,78.586,51.557,34.411,128.119
            l86.806,50.034C148.202,131.62,198.446,100.174,256,100.174z"
                />
                <path
                  style="fill:#D93F21;"
                  d="M354.932,135.693c6.643,5.472,16.299,5.077,22.383-1.008l47.27-47.27
            c6.903-6.904,6.411-18.205-0.963-24.603C378.507,23.672,319.807,0,256,0v100.174C293.53,100.174,328.005,113.51,354.932,135.693z"
                />
              </svg>
            }
            @case ('facebook') {
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            }
            @case ('apple') {
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                />
              </svg>
            }
            @case ('twitter') {
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            }
          }
        </div>
      }

      <!-- Texto del Botón -->
      <span [class]="textClasses">{{ buttonText }}</span>
    </button>
  `,
  styles: []
})
export class SocialLoginButton {
  @Input() provider: SocialProvider = 'google';
  @Input() size: SocialButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = true;
  @Input() mode: 'signin' | 'signup' = 'signin';

  @Output() socialLogin = new EventEmitter<SocialProvider>();

  get buttonClasses(): string {
    const baseClasses = [
      'font-semibold',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'whitespace-nowrap',
      'border',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-emerald-green-600',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:transform-none',
      // Estilos específicos para login social - usando colores de marca LatinHub
      'bg-white',
      'text-gray-900',
      'border-gray-300',
      'hover:bg-gray-50',
      'hover:border-gray-400',
      'hover:scale-[1.02]',
      'active:bg-gray-100',
      'active:scale-[0.98]'
    ];

    // Clases de tamaño que coinciden con el componente Button
    const sizeClasses = {
      sm: ['text-xs', 'px-3', 'py-1.5', 'h-8', 'min-w-[200px]'],
      md: ['text-sm', 'px-4', 'py-2', 'h-[42px]', 'min-w-[250px]'],
      lg: ['text-base', 'px-6', 'py-3', 'h-12', 'min-w-[300px]'],
      xl: ['text-base', 'px-8', 'py-4', 'h-14', 'min-w-[350px]'],
      xxl: ['text-lg', 'px-8', 'py-4', 'h-16', 'min-w-[400px]']
    };

    // Clases de ancho
    const widthClasses = this.fullWidth ? ['w-full'] : [];

    // Combinar todas las clases
    const allClasses = [
      ...baseClasses,
      ...sizeClasses[this.size],
      ...widthClasses
    ];

    return allClasses.join(' ');
  }

  get iconClasses(): string {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-8 h-8',
      xxl: 'w-9 h-9'
    };

    return `shrink-0 mr-2 ${sizeMap[this.size]}`;
  }

  get textClasses(): string {
    return 'font-semibold';
  }

  get buttonText(): string {
    const providerNames = {
      google: 'Google',
      facebook: 'Facebook',
      apple: 'Apple',
      twitter: 'Twitter'
    };

    const providerName = providerNames[this.provider];
    return this.mode === 'signup'
      ? `Registrarse con ${providerName}`
      : `Continuar con ${providerName}`;
  }

  get ariaLabel(): string {
    return this.buttonText;
  }

  handleClick(): void {
    if (!this.disabled && !this.loading) {
      this.socialLogin.emit(this.provider);
    }
  }
}
