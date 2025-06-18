import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggerService, StorageMockService } from '@app/core/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageMockService,
    private readonly logger: LoggerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  private checkAuth(url: string): boolean {
    const token = this.storageService.getLocal<string>('auth_token');

    if (token && !this.isTokenExpired(token)) {
      this.logger.debug('User is authenticated');
      return true;
    }

    this.logger.warn('User is not authenticated, redirecting to auth');

    // Store the attempted URL for redirecting after login
    this.storageService.setLocal('redirect_url', url);

    // Navigate to auth page
    this.router.navigate(['/auth']);
    return false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      // Decode JWT token (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < currentTime;
    } catch (error) {
      this.logger.error('Error decoding token', error);
      return true; // Treat invalid tokens as expired
    }
  }
}
