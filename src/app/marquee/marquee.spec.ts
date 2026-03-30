import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Marquee } from './marquee';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';

describe('Marquee', () => {
  let component: Marquee;
  let fixture: ComponentFixture<Marquee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marquee],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Marquee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty images array', () => {
    expect(component.images).toBeDefined();
  });

  it('should initialize with empty duplicatedImages array', () => {
    expect(component.duplicatedImages).toBeDefined();
  });
});
