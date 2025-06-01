import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const nonAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /*if (!authService.isLoggedIn()) {
    return true;
  }

  // If user is already logged in, redirect based on role
  const role = authService.getUserRole();
  if (role === 'user') {
    router.navigate(['/dashboard/user']);
  } else if (role === 'business') {
    router.navigate(['/dashboard/business']);
  }

  return false;
  */
};
