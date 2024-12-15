import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Stage} from './stage';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('Stage', () => {
  let component: Stage;
  let fixture: ComponentFixture<Stage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stage, BrowserAnimationsModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(Stage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
