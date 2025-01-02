import {Routes} from '@angular/router';
import {Stage} from '@app/stage/stage';
import {Contact} from '@app/contact/contact';
import {Auth} from '@app/auth/auth';

export const routes: Routes = [
  { path: '', redirectTo:'stage',  pathMatch: 'full'},
  { path: 'stage',  component: Stage },
  { path: 'contact', component: Contact },
  { path: 'auth', component: Auth }
];
