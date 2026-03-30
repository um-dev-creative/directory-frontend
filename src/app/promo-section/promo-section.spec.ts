import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PromoSection } from './promo-section';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';

describe('PromoSection', () => {
  let component: PromoSection;
  let fixture: ComponentFixture<PromoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoSection],
      providers: [
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null promo data', () => {
    expect(component.promo).toBeNull();
  });

  it('should have imageBucketUrl defined', () => {
    expect(component.imageBucketUrl).toBeDefined();
  });
});
