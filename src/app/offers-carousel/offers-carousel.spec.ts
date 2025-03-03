import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersCarousel } from './offers-carousel';

describe('OffersCarouselComponent', () => {
  let component: OffersCarousel;
  let fixture: ComponentFixture<OffersCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
