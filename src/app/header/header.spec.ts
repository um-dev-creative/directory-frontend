import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Header} from './header';
import {DebugElement} from '@angular/core';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {App} from '@app/app';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {provideLocationMocks} from '@angular/common/testing';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let sessionStoreService: any;
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
        Header,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })],
      providers: [
        App,
        SessionStoreService,
        provideHttpClientTesting(),
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
        , provideLocationMocks()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Header);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    sessionStoreService = debugElement.injector.get(SessionStoreService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
