import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {OfferSlider} from '@app/offer-slider/offer-slider';
// import {Modal} from '@app/modal/modal';

@Component({
  selector: 'app-partner',
  imports: [CommonModule, OfferSlider, /*Modal*/],
  templateUrl: './partner.html',
  styleUrl: './partner.css'
})
export class Partner {
  showModal = false;

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
