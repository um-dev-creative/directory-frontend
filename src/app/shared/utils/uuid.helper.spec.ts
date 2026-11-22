import {isUuid} from './uuid.helper';

describe('isUuid', () => {
  it('accepts UUIDs in any case', () => {
    expect(isUuid('7a1b2c3d-1111-4222-8333-444455556666')).toBeTrue();
    expect(isUuid('7A1B2C3D-1111-4222-8333-444455556666')).toBeTrue();
  });

  it('rejects everything else', () => {
    for (const value of ['42', '', 'not-a-uuid', '7a1b2c3d-1111-4222-8333-44445555666', 42, null, undefined, {}]) {
      expect(isUuid(value)).toBeFalse();
    }
  });
});
