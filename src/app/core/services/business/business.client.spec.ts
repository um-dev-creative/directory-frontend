import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BusinessClient } from './business.client';

describe('BusinessClient', () => {
  let service: BusinessClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(BusinessClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
