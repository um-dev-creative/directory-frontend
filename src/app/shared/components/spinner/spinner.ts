import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@app/core/services/loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible"
      class="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-transition-opacity tw-duration-200"
      [ngClass]="{
        'tw-opacity-0': !isVisible,
        'tw-opacity-100': isVisible,
        'tw-absolute': contained,
        'tw-bg-white/80 tw-backdrop-blur-sm': !transparent
      }"
    >
      <div class="tw-relative">
        <div class="tw-w-12 tw-h-12">
          <div class="tw-absolute tw-w-full tw-h-full tw-rounded-full tw-border-4 tw-border-gray-200"></div>
          <div class="tw-absolute tw-w-full tw-h-full tw-rounded-full tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-animate-spin"></div>
        </div>
      </div>
    </div>
  `
})
export class Spinner implements OnInit, OnDestroy {
  @Input() key = 'auth';
  @Input() transparent = false;
  @Input() contained = false;

  isVisible = false;
  private destroy$ = new Subject<void>();

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isVisible = !!state[this.key];
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
