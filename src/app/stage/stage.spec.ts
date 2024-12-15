import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Stage} from './stage';
import {of} from "rxjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('Stage', () => {
    let component: Stage;
    let fixture: ComponentFixture<Stage>;
    let mockStore: any;

    beforeEach(async () => {
        mockStore = {
            select: jasmine.createSpy().and.returnValue(of({})),
            dispatch: jasmine.createSpy()
        };
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
