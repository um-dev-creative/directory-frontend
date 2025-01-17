import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
import {App} from '@app/app';
import {SIMPLE_HEADER_DISABLED} from '@shared/app.const';
import {JwtPipe} from '@shared/services/jwt.pipe';

/**
 * Main stage component
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, Banner],
  templateUrl: './stage.html',
  styleUrl: './stage.css',
  animations: [],
  providers: [JwtPipe]
})
export class Stage implements OnInit, AfterViewInit {

  /**
   * Change detector reference
   * @private
   */
  protected changeDetectorRefs = inject(ChangeDetectorRef);

  constructor(private readonly appComponent: App) {
  }

  ngOnInit(): void {
    this.appComponent.changeHeaderSimple(SIMPLE_HEADER_DISABLED);
  }

  ngAfterViewInit(): void {
    console.info('Stage component initialized');
    this.changeDetectorRefs.detectChanges();
  }
}
