import {Routes} from '@angular/router';
import {Stage} from '@app/stage/stage';
import {Contact} from '@app/contact/contact';
import {Auth} from '@app/auth/auth';
import {Partner} from '@app/partner/partner';
import {Deals} from '@app/deals/deals';
import {NotFound} from '@app/layout/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo:'stage',  pathMatch: 'full'},
  { path: 'stage',  component: Stage },
  { path: 'contact', component: Contact },
  { path: 'auth', component: Auth },
  { path: 'partner', component: Partner },
  { path: 'deals', component: Deals },
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404'}
];
