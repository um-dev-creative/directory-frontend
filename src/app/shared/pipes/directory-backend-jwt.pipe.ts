import {Pipe, PipeTransform} from '@angular/core';
import {DirectoryBackendJwtPayload} from '@shared/models/directory-backend-jwt-payload';
import {jwtDecode} from 'jwt-decode';
import {LoggerService} from '@app/core/services';

@Pipe({
  name: 'directoryBackendJwt'
})
export class DirectoryBackendJwtPipe implements PipeTransform {

  constructor(private readonly logger: LoggerService) {
  }

  /**
   * Transform the token into a JwtPayload object.
   * @param token
   */
  transform(token: string): DirectoryBackendJwtPayload | null {
    try {
      if (token) {
        return jwtDecode<DirectoryBackendJwtPayload>(token);
      }
      this.logger.debug('JWT token is empty or undefined');
      return null;
    } catch (error) {
      this.logger.error('Invalid JWT token', error);
      return null;
    }

  }
}
