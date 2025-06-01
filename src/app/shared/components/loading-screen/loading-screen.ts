import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-white/90 tw-z-[9999]">
      <div class="loading-content tw-text-center">
        <div class="spinner tw-w-[50px] tw-h-[50px] tw-mx-auto tw-border-4 tw-border-blue-500/20 tw-rounded-full tw-relative tw-shadow-lg">
          <div class="tw-absolute tw-inset-0 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      opacity: 0;
      animation: containerFadeIn 0.3s ease 0.2s forwards;
    }

    .loading-content {
      transform: scale(0.8);
      opacity: 0;
      animation: contentPop 0.4s ease 0.4s forwards;
    }

    @keyframes containerFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes contentPop {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class LoadingScreen {}
