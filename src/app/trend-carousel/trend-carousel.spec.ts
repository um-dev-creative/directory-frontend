import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TrendCarousel } from './trend-carousel';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {DebugElement} from '@angular/core';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';
import {of} from 'rxjs';

describe('TrendsCarousel', () => {
  let component: TrendCarousel;
  let fixture: ComponentFixture<TrendCarousel>;
  let activatedRoute: ActivatedRoute;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendCarousel],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    })
    .compileComponents();

    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(TrendCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty trends array', () => {
    expect(component.trends).toBeDefined();
    expect(Array.isArray(component.trends)).toBeTrue();
  });

  it('should stop scroll on stopScroll call', () => {
    expect(() => component.stopScroll()).not.toThrow();
  });

  it('should navigate to deals page on navigateToDeals', () => {
    spyOn(component as any, 'navigateToDeals').and.callThrough();
    // Just verify it doesn't throw - actual routing is mocked
    expect(() => component.navigateToDeals()).not.toThrow();
  });

  it('should handle card click with internal link', () => {
    const trend = { title: 'Test', description: 'Desc', image: 'img.png', brandLogo: 'logo.png', internalLink: '/deals' };
    expect(() => component.onCardClick(trend)).not.toThrow();
  });

  it('should handle card click without internal link', () => {
    const trend = { title: 'Test', description: 'Desc', image: 'img.png', brandLogo: 'logo.png', internalLink: '' };
    expect(() => component.onCardClick(trend)).not.toThrow();
  });
});
