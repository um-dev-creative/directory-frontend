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
      class="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200"
      [ngClass]="{
        'opacity-0': !isVisible,
        'opacity-100': isVisible,
        'absolute': contained,
        'bg-beige-50/90 backdrop-blur-sm': !transparent
      }"
    >
      <div class="relative">
        <div class="w-12 h-12">
          <div class="absolute w-full h-full rounded-full border-4 border-beige-200"></div>
          <div class="absolute w-full h-full rounded-full border-4 border-emerald-green-500 border-t-transparent animate-spin"></div>
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
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly loadingService: LoadingService) {}

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
