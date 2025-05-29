import {JwtPayload} from "jwt-decode";

/**
 * CustomJwtPayload is a custom model that extends the JwtPayload model.
 */
export interface CustomJwtPayload extends JwtPayload {
    /** User ID */
    uid?: string;
    /** User alias */
    alias?: string;
    /** First name */
    firstname?: string;
    /** Last name */
    lastname?: string;
    /** Email */
    email?: string;
}
