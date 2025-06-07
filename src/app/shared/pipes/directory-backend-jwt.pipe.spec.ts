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
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const expectedPayload: DirectoryBackendJwtPayload = {
      userId: '1234567890',
      name: 'John Doe',
      iat: 1516239022
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
