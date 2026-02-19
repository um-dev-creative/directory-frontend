import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '@app/core/services/logger.service';

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
  private readonly logger = inject(LoggerService);

  protected reportProblem(): void {
    this.logger.info('Report problem requested');

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
    this.logger.debug('Opening problem report form with context:', contextInfo);

    // Abrir Google Form en nueva pestaña
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  }

  // Getters para clases CSS dinámicas
  protected get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center gap-2 transition-all duration-200 font-medium';

    const variantClasses = {
      'link': 'text-emerald-green-600 hover:text-emerald-green-700 underline decoration-dotted hover:decoration-solid',
      'button': 'bg-emerald-green-600 hover:bg-emerald-green-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md',
      'card': 'bg-white border border-emerald-green-200 hover:border-emerald-green-300 p-4 rounded-lg shadow-sm hover:shadow-md text-emerald-green-700'
    };

    const sizeClasses = {
      'sm': this.variant === 'link' ? 'text-sm' : 'text-sm px-3 py-1.5',
      'md': this.variant === 'link' ? 'text-base' : 'text-base px-4 py-2',
      'lg': this.variant === 'link' ? 'text-lg' : 'text-lg px-5 py-3'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }

  protected get iconSize(): string {
    const iconSizes = {
      'sm': 'w-3 h-3',
      'md': 'w-4 h-4',
      'lg': 'w-5 h-5'
    };
    return iconSizes[this.size];
  }
}
