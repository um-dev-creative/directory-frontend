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
import {PartnerRegistrationStepperComponent} from './features/partner/components/partner-registration-stepper.component';

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'demo', component: CoreDemoComponent }, // Demo route for testing core services - MOVED TO TOP
  { path: 'brand-showcase', component: BrandShowcase }, // Showcase for brand colors
  { path: 'stage', component: Stage },
  { path: 'partner/register', component: PartnerRegistrationStepperComponent, data: { hideFooter: true } },
  { path: 'partner/:id', component: Partner },
  { path: 'partner', redirectTo: 'partner/register', pathMatch: 'full' },
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
  path: 'member',
  loadComponent: () => import('./features/community-member').then(m => m.CommunityMember),
  canActivate: [authGuard],
  data: { hideFooter: true }
},

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found'}
];
