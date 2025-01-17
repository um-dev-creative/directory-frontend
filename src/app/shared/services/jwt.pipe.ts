import {Pipe, PipeTransform} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {CustomJwtPayload} from "@shared/models/custom-jwt-payload";

/**
 * Pipe to decode a JWT token.
 */
@Pipe({
    name: 'jwtDecode',
    standalone: true
})
export class JwtPipe implements PipeTransform {

    /**
     * Transform the token into a JwtPayload object.
     * @param token
     */
    transform(token: string): CustomJwtPayload | null {
        try {
            return jwtDecode<CustomJwtPayload>(token);
        } catch (error) {
            console.error('Invalid JWT token', error);
            return null;
        }
    }

}
