import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deals } from './deals';

describe('DealsComponent', () => {
  let component: Deals;
  let fixture: ComponentFixture<Deals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
