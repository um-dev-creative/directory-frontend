import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSlider } from './offer-slider';

describe('OfferCarouselComponent', () => {
  let component: OfferSlider;
  let fixture: ComponentFixture<OfferSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferSlider]
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
