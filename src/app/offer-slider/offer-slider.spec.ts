import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { OfferSlider } from './offer-slider';

describe('OfferSliderComponent', () => {
  let component: OfferSlider;
  let fixture: ComponentFixture<OfferSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferSlider],
      providers: [provideHttpClientTesting()]
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
