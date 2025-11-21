import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { VerifyCodeClient } from './verify-code-client.service';

describe('VerifyCodeClient', () => {
  let service: VerifyCodeClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(VerifyCodeClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
