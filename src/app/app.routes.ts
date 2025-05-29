import {Routes} from '@angular/router';
import {Stage} from '@app/stage/stage';
import {Contact} from '@app/contact/contact';
import {Auth} from '@app/features/auth/auth';
import {VerificationCode} from '@app/verification-code/verification-code';
import {AuthGuard} from './core/guards/auth.guard';
import {CoreDemoComponent} from './core-demo.component';

export const routes: Routes = [
  // Public routes
  { path: 'auth', component: Auth },
  { path: 'veracode', component: VerificationCode },
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
