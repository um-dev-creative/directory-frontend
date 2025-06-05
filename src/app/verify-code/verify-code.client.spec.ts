import { TestBed } from '@angular/core/testing';

import { VerifyCodeClient } from './verify-code-client.service';

describe('UserRegisterService', () => {
  let service: VerifyCodeClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyCodeClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
