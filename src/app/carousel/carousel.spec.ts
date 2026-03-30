import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carousel } from './carousel';

describe('CarouselComponent', () => {
  let component: Carousel;
  let fixture: ComponentFixture<Carousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with first slide', () => {
    expect(component.currentSlide).toBe(0);
  });

  it('should have slides loaded', () => {
    expect(component.slides.length).toBeGreaterThan(0);
  });

  it('should advance to next slide', () => {
    component.nextSlide();
    expect(component.currentSlide).toBe(1);
  });

  it('should wrap to first slide when going past last', () => {
    component.currentSlide = component.slides.length - 1;
    component.nextSlide();
    expect(component.currentSlide).toBe(0);
  });

  it('should go to previous slide', () => {
    component.currentSlide = 1;
    component.prevSlide();
    expect(component.currentSlide).toBe(0);
  });

  it('should wrap to last slide when going before first', () => {
    component.currentSlide = 0;
    component.prevSlide();
    expect(component.currentSlide).toBe(component.slides.length - 1);
  });

  it('should go to a specific slide', () => {
    component.goToSlide(1);
    expect(component.currentSlide).toBe(1);
  });

  it('should pause autoplay', () => {
    component.pauseAutoplay();
    expect(component.isAutoPlaying).toBeFalse();
  });

  it('should resume autoplay', () => {
    component.pauseAutoplay();
    component.resumeAutoplay();
    expect(component.isAutoPlaying).toBeTrue();
  });
});
