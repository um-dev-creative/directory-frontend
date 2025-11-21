import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {OfferSlider} from './offer-slider';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';

describe('OfferSlider', () => {
  let component: OfferSlider;
  let fixture: ComponentFixture<OfferSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferSlider],
      providers: [
        {provide: ActivatedRoute, useValue: {params: of({}), snapshot: {paramMap: convertToParamMap({})}}},
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
