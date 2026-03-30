import { TestBed } from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import { CategoryClient } from './category.client';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('CategoryClient', () => {
  let service: CategoryClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CategoryClient, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] });
    service = TestBed.inject(CategoryClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
