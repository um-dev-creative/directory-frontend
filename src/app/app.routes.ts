import {Routes} from '@angular/router';
import {NotFound} from '@app/layout/not-found';
import {VerifyCode} from '@app/verify-code/verify-code';
import {authGuard, noAuthGuard} from '@app/core/guards';
import {BrandShowcase} from './components/brand-showcase';

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'brand-showcase', component: BrandShowcase }, // Showcase for brand colors

  // Lazy loaded feature routes
  {
    path: 'stage',
    loadComponent: () => import('./features/stage').then(m => m.Stage)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then(m => m.Auth),
    canActivate: [noAuthGuard],
    data: { hideFooter: true }
  },
  {
    path: 'deals',
    loadComponent: () => import('./features/deals').then(m => m.Deals)
  },

  // Partner routes as loadChildren
  {
    path: 'partner',
    loadChildren: () => import('./features/partner/partner.routes').then(m => m.partnerRoutes)
  },

  // Other lazy loaded routes
  { path: 'about', loadComponent: () => import('./features/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./features/contact').then(m => m.Contact) },
  { path: 'not-found', component: NotFound, data: { hideLayout: true } },

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

  // Protected favorites route (lazy loaded)
  {
    path: 'favorites',
    loadComponent: () => import('./features/community-member/favorites').then(m => m.Favorites),
    canActivate: [authGuard],
    data: { hideFooter: true }
  },

  // Default redirect
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found'}
];
