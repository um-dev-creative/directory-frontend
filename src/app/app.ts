import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RouterOutlet, Router, NavigationEnd} from '@angular/router';
import {Footer} from '@app/layout/footer/footer';
import {Header} from '@app/header/header';
import {animate, query, style, transition, trigger} from '@angular/animations';
import {JwtPipe} from '@app/shared/pipes/jwt.pipe';
import {Store} from '@ngrx/store';
import {SessionState} from '@app/core/store/session/session.state';
import {Observable} from 'rxjs';
import {LoadingScreen} from '@app/shared/components/loading-screen/loading-screen';
import {filter, map} from 'rxjs/operators';

export const routeTransitionAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({position: 'absolute', width: '100%'}), {optional: true}),
    query(':enter', [style({opacity: 0}), animate('500ms ease-in', style({opacity: 1}))], {optional: true}),
    query(':leave', [style({opacity: 1}), animate('500ms ease-out', style({opacity: 0}))], {optional: true})
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Footer,
    LoadingScreen
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeTransitionAnimations],
  providers: [JwtPipe]
})
export class App implements AfterViewInit, OnInit {
  isInitialized$: Observable<boolean>;
  hideLayout$: Observable<boolean>;

  constructor(
    private readonly store: Store<{ session: SessionState }>,
    private readonly router: Router
  ) {
    this.isInitialized$ = this.store.select(state => state.session?.isInitialized ?? false);

    // Observable para detectar si la ruta actual debe ocultar el layout
    this.hideLayout$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['hideLayout'] || false;
      })
    );
  }

  ngOnInit() {
    // The initialization is handled by APP_INITIALIZER
    // We just observe the state here
  }

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
