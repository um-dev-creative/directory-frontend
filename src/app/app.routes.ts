import {Routes} from '@angular/router';
import {Stage} from '@app/features/stage';
import {Auth} from '@app/features/auth/auth';
import {Partner} from '@app/features/partner';
import {Deals} from '@app/features/deals';
import {NotFound} from '@app/layout/not-found';
import {VerifyCode} from '@app/verify-code/verify-code';
import {authGuard} from './core/guards/auth.guard';
import {CoreDemoComponent} from './core-demo.component';
import {BrandShowcase} from './components/brand-showcase';
import {BrandShowcaseLegacy} from './components/brand-showcase-legacy';

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'demo', component: CoreDemoComponent }, // Demo route for testing core services - MOVED TO TOP
  { path: 'brand-showcase', component: BrandShowcase }, // Showcase for brand colors
  { path: 'brand-showcase-legacy', component: BrandShowcaseLegacy },
  { path: 'stage', component: Stage },
  { path: 'partner', component: Partner },
  { path: 'about', loadComponent: () => import('./features/about').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./features/contact').then(m => m.Contact) },
  { path: 'auth', component: Auth },
  { path: 'not-found', component: NotFound, data: { hideLayout: true } },
  { path: 'deals', component: Deals },

  // Protected routes (require authentication)
  {
    path: 'veracode',
    component: VerifyCode,
    canActivate: [authGuard]
  },

  // Protected profile route (lazy loaded)
  {
  path: 'profile',
  loadComponent: () => import('./features/profile').then(m => m.Profile),
  canActivate: [authGuard]
},

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found'}
];
