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

export const routes: Routes = [
  // Public routes
  { path: 'stage',  component: Stage },
  { path: 'veracode',  component: VerificationCode },
  { path: 'contact', component: Contact },
  { path: 'auth', component: Auth },
  { path: 'partner', component: Partner },
  { path: 'deals', component: Deals },
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404'},
  { path: 'demo', component: CoreDemoComponent }, // Demo route for testing core services

  // Protected routes (require authentication)
  {
    path: 'stage',
    component: Stage,
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    component: Contact,
    canActivate: [AuthGuard]
  },

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' }
];
