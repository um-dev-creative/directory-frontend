import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TimezoneClient } from './timezone.client';

describe('TimezoneClientService', () => {
  let service: TimezoneClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(TimezoneClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
