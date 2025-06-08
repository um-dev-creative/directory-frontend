import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ReportProblemOptions {
  userEmail?: string;
  userDisplayName?: string;
  contextData?: Record<string, any>;
  googleFormUrl?: string;
}

@Component({
  selector: 'app-report-problem',
  imports: [CommonModule],
  templateUrl: './report-problem.html',
  styleUrl: './report-problem.css',
  standalone: true
})
export class ReportProblem {
  @Input() options: ReportProblemOptions = {};
  @Input() variant: 'link' | 'button' | 'card' = 'link';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcon: boolean = true;
  @Input() text: string = 'Reportar un problema';

  // URL por defecto del Google Form (puedes cambiarla)
  private readonly defaultGoogleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=DefaultReportProblem';

  protected reportProblem(): void {
    console.log('Report problem requested');

    // URL del Google Form para reportes de problemas
    const googleFormUrl = this.options.googleFormUrl || this.defaultGoogleFormUrl;

    // Información del contexto que podría ser útil (para referencia en logs)
    const contextInfo = {
      timestamp: new Date().toISOString(),
      userEmail: this.options.userEmail,
      userDisplayName: this.options.userDisplayName,
      currentPath: window.location.pathname,
      userAgent: navigator.userAgent,
      contextData: this.options.contextData || {}
    };

    // Log para referencia del desarrollador
    console.log('Opening problem report form with context:', contextInfo);

    // Abrir Google Form en nueva pestaña
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  }

  // Getters para clases CSS dinámicas
  protected get buttonClasses(): string {
    const baseClasses = 'tw-inline-flex tw-items-center tw-gap-2 tw-transition-all tw-duration-200 tw-font-medium';

    const variantClasses = {
      'link': 'tw-text-emerald-green-600 hover:tw-text-emerald-green-700 tw-underline tw-decoration-dotted hover:tw-decoration-solid',
      'button': 'tw-bg-emerald-green-600 hover:tw-bg-emerald-green-700 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-sm hover:tw-shadow-md',
      'card': 'tw-bg-white tw-border tw-border-emerald-green-200 hover:tw-border-emerald-green-300 tw-p-4 tw-rounded-lg tw-shadow-sm hover:tw-shadow-md tw-text-emerald-green-700'
    };

    const sizeClasses = {
      'sm': this.variant === 'link' ? 'tw-text-sm' : 'tw-text-sm tw-px-3 tw-py-1.5',
      'md': this.variant === 'link' ? 'tw-text-base' : 'tw-text-base tw-px-4 tw-py-2',
      'lg': this.variant === 'link' ? 'tw-text-lg' : 'tw-text-lg tw-px-5 tw-py-3'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }

  protected get iconSize(): string {
    const iconSizes = {
      'sm': 'tw-w-3 tw-h-3',
      'md': 'tw-w-4 tw-h-4',
      'lg': 'tw-w-5 tw-h-5'
    };
    return iconSizes[this.size];
  }
}
