import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideMockStore} from '@ngrx/store/testing';

import {Partner} from './partner';
import {provideLocationMocks} from '@angular/common/testing';

describe('StoreComponent', () => {
  let component: Partner;
  let fixture: ComponentFixture<Partner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Partner],
      providers: [provideMockStore({}), provideLocationMocks()]
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
