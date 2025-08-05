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
    loadComponent: () => import('./components').then(m => m.PartnerRegistrationStepper),
    data: { hideFooter: true }
  },
  {
    path: 'settings',
    loadComponent: () => import('./components').then(m => m.PartnerSettings),
    canActivate: [authGuard],
    canActivateChild: [authGuardChild],
    data: { hideFooter: true }
  },
  {
    path: 'settings/general',
    loadComponent: () => import('./components/settings/general').then(m => m.PartnerGeneralSettings),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },
  {
    path: 'settings/offers',
    loadComponent: () => import('./components/settings/offers').then(m => m.PartnerOffersSettings),
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
    loadComponent: () => import('./components/settings/products').then(m => m.PartnerProductsSettingsComponent),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },
  {
    path: ':slug',
    loadComponent: () => import('./partner').then(m => m.Partner)
  }
];
