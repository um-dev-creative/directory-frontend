import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CategoryClient } from './category.client';

describe('CategoryClientService', () => {
  let service: CategoryClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(CategoryClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
