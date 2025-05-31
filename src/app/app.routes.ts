import {Routes} from '@angular/router';
import {Stage} from '@app/stage/stage';
import {Contact} from '@app/contact/contact';
import {Auth} from '@app/features/auth/auth';
import {Partner} from '@app/partner/partner';
import {Deals} from '@app/deals/deals';
import {NotFound} from '@app/layout/not-found/not-found';
import {VerificationCode} from '@app/verification-code/verification-code';
import {AuthGuard} from './core/guards/auth.guard';
import {CoreDemoComponent} from './core-demo.component';
import {TestDemoComponent} from './test-demo.component';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'deals',
    component: Deals,
    canActivate: [AuthGuard]
  },

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found'}
];
