import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Marquee } from './marquee';

describe('MarqueeComponent', () => {
  let component: Marquee;
  let fixture: ComponentFixture<Marquee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marquee],
      providers: [provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Marquee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
