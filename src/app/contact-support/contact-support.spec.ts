import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupport } from './contact-support';

describe('ContactSupportComponent', () => {
  let component: ContactSupport;
  let fixture: ComponentFixture<ContactSupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSupport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSupport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
