import { TestBed } from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import { BusinessClient } from './business.client';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('BusinessClient', () => {
  let service: BusinessClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessClient, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(BusinessClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
