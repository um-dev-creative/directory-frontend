import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Search } from './search';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Search,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the text it is given and replace it when it changes', () => {
    fixture.componentRef.setInput('initialValue', 'pan');
    fixture.detectChanges();
    expect(component.searchText).toBe('pan');

    fixture.componentRef.setInput('initialValue', 'tacos');
    fixture.detectChanges();
    expect(component.searchText).toBe('tacos');

    fixture.componentRef.setInput('initialValue', null as unknown as string);
    fixture.detectChanges();
    expect(component.searchText).toBe('');
  });

  it('should submit the trimmed text and not submit text that is too short', () => {
    const submitted: string[] = [];
    component.searchSubmit.subscribe((text: string) => submitted.push(text));

    component.searchText = '   ';
    component.onSubmit();
    component.searchText = '  pan  ';
    component.onSubmit();

    expect(submitted).toEqual(['pan']);
  });
});
