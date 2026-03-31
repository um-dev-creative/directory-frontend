import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportProblem } from './report-problem';

describe('ReportProblem', () => {
  let component: ReportProblem;
  let fixture: ComponentFixture<ReportProblem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportProblem]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportProblem);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should default variant to "link"', () => {
    expect(component.variant).toBe('link');
  });

  it('should default size to "md"', () => {
    expect(component.size).toBe('md');
  });

  it('should default showIcon to true', () => {
    expect(component.showIcon).toBeTrue();
  });

  it('should default text to "Reportar un problema"', () => {
    expect(component.text).toBe('Reportar un problema');
  });

  it('should accept custom options input', () => {
    component.options = { userEmail: 'test@test.com', userDisplayName: 'Test User' };
    expect(component.options.userEmail).toBe('test@test.com');
    expect(component.options.userDisplayName).toBe('Test User');
  });

  it('should accept variant input', () => {
    component.variant = 'button';
    expect(component.variant).toBe('button');
  });
});
