import { TestBed } from '@angular/core/testing';

import { OfferSliderClient } from './offer-slider.client';

describe('OfferSliderService', () => {
  let service: OfferSliderClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferSliderClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
