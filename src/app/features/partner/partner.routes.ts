import { Routes } from '@angular/router';
import { authGuard, authGuardChild } from '@app/core/guards/auth.guard';

export const partnerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./components/partner-registration-stepper').then(m => m.PartnerRegistrationStepper),
    data: { hideFooter: true }
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/partner-settings').then(m => m.PartnerSettings),
    canActivate: [authGuard],
    canActivateChild: [authGuardChild],
    data: { hideFooter: true }
  },
  {
    path: 'settings/general',
    loadComponent: () => import('./components/settings/general/partner-general-settings').then(m => m.PartnerGeneralSettings),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },
  {
    path: 'settings/offers',
    loadComponent: () => import('./components/settings/offers/partner-offers-settings.component').then(m => m.PartnerOffersSettingsComponent),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },
  {
    path: 'settings/locations',
    loadComponent: () => import('./components/settings/locations').then(m => m.PartnerLocationsSettingsComponent),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },
  {
    path: 'settings/products',
    loadComponent: () => import('./components/settings/products/partner-products-settings.component').then(m => m.PartnerProductsSettingsComponent),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },
  {
    path: ':slug',
    loadComponent: () => import('./partner').then(m => m.Partner)
  }
];
