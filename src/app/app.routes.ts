import {Routes} from '@angular/router';
import {Stage} from '@app/features/stage/stage';
import {Contact} from '@app/features/contact';
import {Auth} from '@app/features/auth/auth';
import {Partner} from '@app/features/partner';
import {Deals} from '@app/features/deals';
import {NotFound} from '@app/layout/not-found';
import {VerificationCode} from '@app/verification-code/verification-code';
import {authGuard} from './core/guards/auth.guard';
import {CoreDemoComponent} from './core-demo.component';

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'demo', component: CoreDemoComponent }, // Demo route for testing core services - MOVED TO TOP
  { path: 'stage', component: Stage },
  { path: 'partner', component: Partner },
  { path: 'contact', component: Contact },
  { path: 'auth', component: Auth },
  { path: 'not-found', component: NotFound },

  // Protected routes (require authentication)
  {
    path: 'veracode',
    component: VerificationCode,
    canActivate: [authGuard]
  },
  {
    path: 'deals',
    component: Deals,
    canActivate: [authGuard]
  },

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found'}
];
