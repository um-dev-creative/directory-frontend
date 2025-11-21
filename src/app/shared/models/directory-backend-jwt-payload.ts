import {JwtPayload} from 'jwt-decode';

export interface DirectoryBackendJwtPayload extends JwtPayload {
  vcCompleted?: string;
  /** User ID */
  uid?: string;
  /** User alias */
  sub?: string;
  /** Session type */
  type?: string;
}
