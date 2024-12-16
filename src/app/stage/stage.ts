import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {animate, query, style, transition, trigger} from "@angular/animations";
import {Header} from '@app/header/header';

/**
 * Route transition animations
 */
export const routeTransitionAnimations = trigger('routeAnimations', [
    transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        query(':enter', [style({ opacity: 0 }), animate('500ms ease-in', style({ opacity: 1 }))], { optional: true }),
        query(':leave', [style({ opacity: 1 }), animate('500ms ease-out', style({ opacity: 0 }))], { optional: true })
    ])
]);

/**
 * Main stage component
 */
@Component({
    selector: 'app-main',
  imports: [
    Header,
    RouterOutlet
  ],
    templateUrl: './stage.html',
    styleUrl: './stage.css',
    animations: [routeTransitionAnimations]
})
export class Stage {

    constructor() {
      // This is a constructor
    }

  /**
   * Get the route animation data
   * @param outlet
   */
  getRouteAnimationData(outlet: any) {
        return outlet.activatedRouteData.animation;
    }

}
