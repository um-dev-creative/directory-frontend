import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {ProductList} from './product-list';
import {provideLocationMocks} from '@angular/common/testing';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {DebugElement} from '@angular/core';
import {of} from 'rxjs';
import {provideHttpClient} from '@angular/common/http';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let activatedRoute: ActivatedRoute;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductList,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })],
      providers: [
        // Provide a minimal ActivatedRoute stub for tests that inject it
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
        // HttpClientTestingModule provides HttpClient for the test environment
      ]
    })
    .compileComponents();

    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
