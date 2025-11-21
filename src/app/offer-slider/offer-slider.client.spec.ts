import {TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {OfferSliderClient} from './offer-slider.client';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';

describe('OfferSliderService', () => {
  let service: OfferSliderClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()]
    });
    service = TestBed.inject(OfferSliderClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
