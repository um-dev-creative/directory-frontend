import { TestBed } from '@angular/core/testing';

import { UserRegisterClient } from './user-register.client';

describe('UserRegisterService', () => {
  let service: UserRegisterClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRegisterClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
