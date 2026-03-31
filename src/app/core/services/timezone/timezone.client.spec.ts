import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TimezoneClient } from './timezone.client';

describe('TimezoneClientService', () => {
  let service: TimezoneClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimezoneClient]
    });
    service = TestBed.inject(TimezoneClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
