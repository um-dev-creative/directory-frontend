import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { OfferSliderClient } from './offer-slider.client';

describe('OfferSliderService', () => {
  let service: OfferSliderClient;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(OfferSliderClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
