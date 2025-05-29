import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

export interface UserInfo {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private storageService: StorageService,
    private logger: LoggerService,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const requiredRoles = route.data['roles'] as string[];
    const requiredPermissions = route.data['permissions'] as string[];

    if (!requiredRoles && !requiredPermissions) {
      // No role/permission requirements
      return true;
    }

    const userInfo = this.storageService.getLocal<UserInfo>('user_info');

    if (!userInfo) {
      this.logger.warn('No user info found for role check');
      this.notificationService.error('Access denied - User information not found');
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Check roles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => userInfo.roles.includes(role));
      if (!hasRole) {
        this.logger.warn('User does not have required role', { requiredRoles, userRoles: userInfo.roles });
        this.notificationService.error('Access denied - Insufficient permissions');
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission =>
        userInfo.permissions.includes(permission)
      );
      if (!hasPermission) {
        this.logger.warn('User does not have required permission', {
          requiredPermissions,
          userPermissions: userInfo.permissions
        });
        this.notificationService.error('Access denied - Insufficient permissions');
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    this.logger.debug('Role/permission check passed');
    return true;
  }
}
