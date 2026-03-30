import { TestBed } from '@angular/core/testing';

import { UserClient } from './user.client';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('UserClient', () => {
  let service: UserClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [UserClient, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
