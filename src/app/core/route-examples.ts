// Example of how to use the guards in your routing configuration

import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard, UnsavedChangesGuard } from './core/guards';

export const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Protected routes requiring authentication
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },

  // Admin routes requiring specific role
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'super_admin'] }
  },

  // User management requiring specific permission
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { permissions: ['manage_users'] }
  },

  // Form with unsaved changes protection
  {
    path: 'profile/edit',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard]
  },

  // Nested routes with child protection
  {
    path: 'settings',
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'general',
        loadChildren: () => import('./features/settings/general/general.module').then(m => m.GeneralModule)
      },
      {
        path: 'security',
        loadChildren: () => import('./features/settings/security/security.module').then(m => m.SecurityModule),
        data: { permissions: ['manage_security'] }
      }
    ]
  },

  // Default redirects
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' }
];

/*
Usage examples in components:

1. Using AuthService:
```typescript
constructor(private authService: AuthService) {}

login() {
  this.authService.login({ email: 'user@example.com', password: 'password' })
    .subscribe(success => {
      if (success) {
        console.log('Login successful');
      }
    });
}

checkPermissions() {
  if (this.authService.hasRole('admin')) {
    // Show admin features
  }

  if (this.authService.hasPermission('edit_users')) {
    // Allow user editing
  }
}
```

2. Using UnsavedChangesComponent:
```typescript
export class MyFormComponent extends UnsavedChangesComponent {

  onFormChange() {
    this.markAsChanged(); // Call when form is modified
  }

  onSave() {
    // Save logic
    this.markAsSaved(); // Call after successful save
  }
}
```

3. Using HTTP Service with special headers:
```typescript
// Skip loading indicator
this.httpService.get('/api/data', {
  headers: { 'skip-loading': 'true' }
});

// Skip auth header
this.httpService.get('/api/public', {
  headers: { 'skip-auth': 'true' }
});

// Cache control
this.httpService.get('/api/cache-me', {
  headers: { 'cache-control': 'max-age=300' } // 5 minutes
});
```
*/
