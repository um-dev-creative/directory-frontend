import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TrendCarousel } from './trend-carousel';

describe('OffersCarouselComponent', () => {
  let component: TrendCarousel;
  let fixture: ComponentFixture<TrendCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendCarousel],
      providers: [provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
