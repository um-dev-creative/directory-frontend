import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container fixed inset-0 flex items-center justify-center bg-beige-50/90 z-[9999]">
      <div class="loading-content text-center">
        <div class="spinner w-[50px] h-[50px] mx-auto border-4 border-beige-200 rounded-full relative shadow-lg">
          <div class="absolute inset-0 border-4 border-emerald-green-500 border-t-transparent rounded-full animate-spin"></div>
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
