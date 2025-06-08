import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OfferSlider } from '@app/offer-slider/offer-slider';
import { PartnerRegistrationStepperComponent } from './components/partner-registration-stepper.component';
// import {Modal} from '@app/modal/modal';

@Component({
  selector: 'app-partner',
  imports: [CommonModule, OfferSlider, PartnerRegistrationStepperComponent],
  templateUrl: './partner.html',
  styleUrl: './partner.css'
})
export class Partner implements OnInit {
  showModal = false;
  isRegistration = false;
  partnerId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if this is a registration flow or viewing a partner profile
    this.route.paramMap.subscribe(params => {
      this.partnerId = params.get('id');
      // If partner ID is provided, show profile, otherwise show registration
      this.isRegistration = !this.partnerId;
    });

    // Also check query params for registration flow
    this.route.queryParams.subscribe(params => {
      if (params['register'] === 'true') {
        this.isRegistration = true;
      }
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
