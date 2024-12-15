import {Routes} from '@angular/router';
import {Stage} from '@app/stage/stage';

export const routes: Routes = [
  { path: '', redirectTo:'stage',  pathMatch: 'full'},
  { path: 'stage',  component: Stage }
];
