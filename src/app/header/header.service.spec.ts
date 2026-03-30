import { TestBed } from '@angular/core/testing';

import { HeaderService } from './header.service';
import { HeaderType } from '@shared/constants/header-type';

describe('HeaderService', () => {
  let service: HeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to MINIMAL_HEADER', (done) => {
    service.headerType$.subscribe(type => {
      expect(type).toBe(HeaderType.MINIMAL_HEADER);
      done();
    });
  });

  it('should change header type via setHeaderType', (done) => {
    service.setHeaderType(HeaderType.USER_AUTH_HEADER);
    service.headerType$.subscribe(type => {
      expect(type).toBe(HeaderType.USER_AUTH_HEADER);
      done();
    });
  });

  it('should emit GENERAL_HEADER when set', (done) => {
    service.setHeaderType(HeaderType.GENERAL_HEADER);
    service.headerType$.subscribe(type => {
      expect(type).toBe(HeaderType.GENERAL_HEADER);
      done();
    });
  });

  it('should emit CENTER_HEADER when set', (done) => {
    service.setHeaderType(HeaderType.CENTER_HEADER);
    service.headerType$.subscribe(type => {
      expect(type).toBe(HeaderType.CENTER_HEADER);
      done();
    });
  });

  it('should expose headerType$ as observable', () => {
    expect(service.headerType$).toBeDefined();
    expect(typeof service.headerType$.subscribe).toBe('function');
  });
});
