import {Pipe, PipeTransform} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {BackboneJwtPayload} from "@shared/models/backbone-jwt-payload";
import { LoggerService } from '@app/core/services';

/**
 * Pipe to decode a JWT token.
 */
@Pipe({
    name: 'jwtDecode',
    standalone: true
})
export class BackboneJwtPipe implements PipeTransform {

    constructor(private readonly logger: LoggerService) {}

    /**
     * Transform the token into a JwtPayload object.
     * @param token
     */
    transform(token: string): BackboneJwtPayload | null {
        try {
            return jwtDecode<BackboneJwtPayload>(token);
        } catch (error) {
            this.logger.error('Invalid JWT token', error);
            return null;
        }
    }

}
