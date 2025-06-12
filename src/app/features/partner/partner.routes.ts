import { Routes } from '@angular/router';

export const partnerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./components/partner-registration-stepper.component').then(m => m.PartnerRegistrationStepperComponent),
    data: { hideFooter: true }
  },
  {
    path: ':slug',
    loadComponent: () => import('./partner').then(m => m.Partner)
  }
];
