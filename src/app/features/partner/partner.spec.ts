import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Partner } from './partner';

describe('StoreComponent', () => {
  let component: Partner;
  let fixture: ComponentFixture<Partner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Partner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Partner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
