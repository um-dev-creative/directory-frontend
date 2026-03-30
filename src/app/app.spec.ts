import {ComponentFixture, TestBed} from '@angular/core/testing';
import {App} from './app';
import {DebugElement} from '@angular/core';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
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
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      events: of({}) // Mock the events property
    } as any;
    await TestBed.configureTestingModule({
      imports: [
        App,
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClientTesting(),
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title "directory-frontend"', () => {
    expect(component.title).toBe('directory-frontend');
  });

  it('should have isInitialized$ observable', () => {
    expect(component.isInitialized$).toBeDefined();
  });

  it('should have hideLayout$ observable', () => {
    expect(component.hideLayout$).toBeDefined();
  });

  it('should return undefined animation data when outlet has no data', () => {
    const mockOutlet = { activatedRouteData: {} } as any;
    expect(component.getRouteAnimationData(mockOutlet)).toBeUndefined();
  });

  it('should return animation data from outlet', () => {
    const mockOutlet = { activatedRouteData: { animation: 'slide' } } as any;
    expect(component.getRouteAnimationData(mockOutlet)).toBe('slide');
  });

  it('should handle null outlet gracefully', () => {
    expect(component.getRouteAnimationData(null as any)).toBeUndefined();
  });

});
