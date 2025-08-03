import { TestBed } from '@angular/core/testing';

import { TimezoneClient } from './timezone.client';

describe('TimezoneClientService', () => {
  let service: TimezoneClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimezoneClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
