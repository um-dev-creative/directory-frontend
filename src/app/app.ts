import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@app/footer/footer';
import { Header } from '@app/header/header';
import { trigger, transition, style, query, animate } from '@angular/animations';

export const routeTransitionAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
    query(':enter', [style({ opacity: 0 }), animate('500ms ease-in', style({ opacity: 1 }))], { optional: true }),
    query(':leave', [style({ opacity: 1 }), animate('500ms ease-out', style({ opacity: 0 }))], { optional: true })
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeTransitionAnimations],
})
export class App {
  ngAfterViewInit() {
    if (typeof document !== 'undefined') {
      document.body.classList.add('tw-antialiased', 'tw-bg-white', 'tw-text-slate-500');
    }
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  title = 'directory-frontend';
}
