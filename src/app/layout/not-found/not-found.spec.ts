import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotFound} from './not-found';
import {provideLocationMocks} from '@angular/common/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('NotFound', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}}), NotFound],
      providers: [
        {provide: ActivatedRoute,
          useValue: {
            params: of({}),
            paramMap: of(convertToParamMap({})),
            queryParams: of({}),
            snapshot: {paramMap: convertToParamMap({})}
          }
        },
        provideLocationMocks()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
