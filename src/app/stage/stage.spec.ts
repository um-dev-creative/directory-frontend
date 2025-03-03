import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Stage} from './stage';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DebugElement} from '@angular/core';
import {App} from '@app/app';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

describe('Stage', () => {
  let component: Stage;
  let fixture: ComponentFixture<Stage>;
  let debugElement: DebugElement;
  let mockRouter: Router;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(of({
        logged: false,
        userAuth: {alias: 'testAlias', fullName: 'Pepe Perez'}
      })),
      dispatch: jasmine.createSpy()
    };
    await TestBed.configureTestingModule({
      imports: [
        Stage,
        BrowserAnimationsModule
      ],
      providers: [
        App,
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
        {provide: Router, useValue: mockRouter}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Stage);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
