import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colors-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-5 tw-gap-6 tw-mb-12">
      <!-- Emerald Green -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-emerald-green-700 tw-mb-4">Emerald Green</h3>
        <div class="tw-space-y-2">
          <div class="tw-h-8 tw-bg-emerald-green-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
          <div class="tw-h-8 tw-bg-emerald-green-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
          <div class="tw-h-8 tw-bg-emerald-green-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
          <div class="tw-h-8 tw-bg-emerald-green-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
        </div>
      </div>

      <!-- Coral -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-coral-700 tw-mb-4">Coral</h3>
        <div class="tw-space-y-2">
          <div class="tw-h-8 tw-bg-coral-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
          <div class="tw-h-8 tw-bg-coral-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
          <div class="tw-h-8 tw-bg-coral-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
          <div class="tw-h-8 tw-bg-coral-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
        </div>
      </div>

      <!-- Sky Blue -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-sky-blue-700 tw-mb-4">Sky Blue</h3>
        <div class="tw-space-y-2">
          <div class="tw-h-8 tw-bg-sky-blue-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
          <div class="tw-h-8 tw-bg-sky-blue-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
          <div class="tw-h-8 tw-bg-sky-blue-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
          <div class="tw-h-8 tw-bg-sky-blue-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
        </div>
      </div>

      <!-- Beige -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-beige-800 tw-mb-4">Beige</h3>
        <div class="tw-space-y-2">
          <div class="tw-h-8 tw-bg-beige-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
          <div class="tw-h-8 tw-bg-beige-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
          <div class="tw-h-8 tw-bg-beige-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">500</div>
          <div class="tw-h-8 tw-bg-beige-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
        </div>
      </div>

      <!-- Gray -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-6">
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Gray</h3>
        <div class="tw-space-y-2">
          <div class="tw-h-8 tw-bg-gray-100 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">100</div>
          <div class="tw-h-8 tw-bg-gray-300 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs">300</div>
          <div class="tw-h-8 tw-bg-gray-500 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">500</div>
          <div class="tw-h-8 tw-bg-gray-700 tw-rounded tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-white">700</div>
        </div>
      </div>
    </div>

  `
})
export class ColorsSectionComponent {}
