import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PromoSection } from './promo-section';

describe('PromoSectionComponent', () => {
  let component: PromoSection;
  let fixture: ComponentFixture<PromoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoSection],
      providers: [provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
