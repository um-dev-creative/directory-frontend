import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCodeComponent } from './verification-code.component';

describe('VerificationCodeComponent', () => {
  let component: VerificationCodeComponent;
  let fixture: ComponentFixture<VerificationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a fixture', () => {
    expect(fixture).toBeDefined();
  });

  it('should be an instance of VerificationCodeComponent', () => {
    expect(component instanceof VerificationCodeComponent).toBeTrue();
  });

  it('should render without errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
