import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
import {Carousel} from '@app/carousel/carousel';
import {Cards} from '@app/cards/cards';
import {Marquee} from '@app/marquee/marquee';
import {ProductList} from '@app/product-list/product-list';
import {OffersCarousel} from '@app/offers-carousel/offers-carousel';
import {PromoSection} from '@app/promo-section/promo-section';

/**
 * Main stage component
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, Banner, Carousel, Cards, Marquee, ProductList, OffersCarousel, PromoSection ],
  templateUrl: './stage.html',
  styleUrl: './stage.css',
  animations: []
})
export class Stage {
    constructor() { }
}
