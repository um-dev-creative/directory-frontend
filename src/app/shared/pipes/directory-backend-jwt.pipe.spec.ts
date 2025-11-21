import { DirectoryBackendJwtPipe } from './directory-backend-jwt.pipe';
import { LoggerService } from '@app/core/services';
import { DirectoryBackendJwtPayload } from '@shared/models/directory-backend-jwt-payload';

describe('DirectoryBackendJwtPipe', () => {
  let pipe: DirectoryBackendJwtPipe;
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = jasmine.createSpyObj('LoggerService', ['error']);
    pipe = new DirectoryBackendJwtPipe(loggerService);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should decode a valid JWT token', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI4MTI1NzE4YS00ODk2LTQ0MWUtYjZiMS1jNjFkMGQ3MGJjYjgiLCJ2Y0NvbXBsZXRlZCI6InRydWUiLCJ0eXBlIjoic2Vzc2lvbi10b2tlbiIsImlhdCI6MTc2MzczMzc0OCwianRpIjoiMTZmODYzMDMtNWUwYS00N2VhLTllMzYtMjEwOWQ3YzI1YjI4Iiwic3ViIjoiYW1hdGEyOTA4MzkiLCJleHAiOjE3NjM3MzczNDh9.yBj3-0XbXTw3pd_VM6ShZ3YUEefazOo6ayiKKshQDpY';
    const expectedPayload: DirectoryBackendJwtPayload = {
      uid: "8125718a-4896-441e-b6b1-c61d0d70bcb8",
      vcCompleted: "true",
      type: "session-token",
      iat: 1763733748,
      jti: "16f86303-5e0a-47ea-9e36-2109d7c25b28",
      sub: "amata290839",
      exp: 1763737348
    };

    const result = pipe.transform(validToken);
    expect(result).toEqual(expectedPayload);
  });

  it('should return null for an invalid JWT token', () => {
    const invalidToken = 'invalid.token.value';

    const result = pipe.transform(invalidToken);
    expect(result).toBeNull();
    expect(loggerService.error).toHaveBeenCalledWith('Invalid JWT token', jasmine.any(Error));
  });

  it('should return null and log an error when decoding fails', () => {
    spyOn(JSON, 'parse').and.throwError('Decoding error');
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload';

    const result = pipe.transform(invalidToken);
    expect(result).toBeNull();
    expect(loggerService.error).toHaveBeenCalledWith('Invalid JWT token', jasmine.any(Error));
  });
});
