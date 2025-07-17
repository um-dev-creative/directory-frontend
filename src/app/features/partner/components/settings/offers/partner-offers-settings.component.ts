import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-offers-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-page">
      <div class="settings-header">
        <button class="back-button" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Volver
        </button>
        <h1 class="page-title">Mis Promociones</h1>
      </div>

      <div class="settings-content">
        <div class="settings-section">
          <h2>Gestión de Ofertas</h2>
          <p>Administra tus ofertas y promociones especiales.</p>
          <!-- Contenido específico de ofertas -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .settings-header {
      margin-bottom: 2rem;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: var(--coral-600);
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 1rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: var(--coral-50);
      color: var(--coral-700);
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--coral-800);
      margin: 0;
    }

    .settings-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-left: 4px solid var(--coral-500);
    }

    .settings-section h2 {
      color: var(--coral-700);
      margin-bottom: 1rem;
    }

    .settings-section p {
      color: var(--coral-600);
      line-height: 1.6;
    }
  `]
})
export class PartnerOffersSettingsComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/partner/settings']);
  }
}
