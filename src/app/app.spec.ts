import {ComponentFixture, TestBed} from '@angular/core/testing';
import {App} from './app';
import {AuthClient} from '@app/features/auth/auth.client';
import {DebugElement} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Stage} from '@app/stage/stage';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Store} from '@ngrx/store';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

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
        BrowserAnimationsModule,
        RouterModule.forRoot(
          [{path: '', component: Stage}, {path: 'simple', component: Stage}]
        )
      ],
      providers: [
        provideHttpClientTesting(),
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        provideHttpClient(withInterceptorsFromDi()),
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

});
