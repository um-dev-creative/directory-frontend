import {BackboneJwtPipe} from './backbone-jwt.pipe';

describe('BackboneJwtPipe', () => {
    let pipe: BackboneJwtPipe;

    let mockLoggerService: any;

    beforeEach(() => {
        mockLoggerService = { log: jasmine.createSpy('log'), error: jasmine.createSpy('error') };
        pipe = new BackboneJwtPipe(mockLoggerService);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return null for an invalid JWT token', () => {
        const token = 'invalid.jwt.token';

        const result = pipe.transform(token);

        expect(result).toBeNull();
    });

    it('should return null for an empty JWT token', () => {
        const token = '';
        const result = pipe.transform(token);

        expect(result).toBeNull();
    });
});
