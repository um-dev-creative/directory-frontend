import {Routes} from '@angular/router';
import {Stage} from '@app/features/stage';
import {Auth} from '@app/features/auth/auth';
import {Partner} from '@app/features/partner';
import {Deals} from '@app/features/deals';
import {NotFound} from '@app/layout/not-found';
import {VerificationCode} from '@app/verification-code/verification-code';
import {authGuard} from './core/guards/auth.guard';
import {CoreDemoComponent} from './core-demo.component';
import {BrandShowcase} from './components/brand-showcase'

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'demo', component: CoreDemoComponent }, // Demo route for testing core services - MOVED TO TOP
  { path: 'brand-showcase', component: BrandShowcase }, // Showcase for brand colors
  { path: 'stage', component: Stage },
  { path: 'partner', component: Partner },
  { path: 'contact', loadComponent: () => import('./features/contact').then(m => m.Contact) },
  { path: 'auth', component: Auth },
  { path: 'not-found', component: NotFound },
  { path: 'deals', component: Deals },

  // Protected routes (require authentication)
  {
    path: 'veracode',
    component: VerificationCode,
    canActivate: [authGuard]
  },

  // Protected profile route (lazy loaded)
  {
  path: 'profile',
  loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
  canActivate: [authGuard]
},

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found'}
];
