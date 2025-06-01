import {JwtPipe} from './jwt.pipe';

describe('JwtPipe', () => {
    let pipe: JwtPipe;

    let mockLoggerService: any;

    beforeEach(() => {
        mockLoggerService = { log: jasmine.createSpy('log'), error: jasmine.createSpy('error') };
        pipe = new JwtPipe(mockLoggerService);
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
