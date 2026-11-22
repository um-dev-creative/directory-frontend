import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Banner} from './banner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {of} from 'rxjs';
import {provideMockStore} from '@ngrx/store/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('BannerComponent', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;
  let mockRouter: Router;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      events: of({}) // Mock the events property
    } as any;
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}}), 
        Banner,
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClientTesting(),
        {provide: Router, useValue: mockRouter},
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
        provideMockStore()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
