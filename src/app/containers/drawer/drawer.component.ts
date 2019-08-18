import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import * as appActions from '../../store/app.actions';
import { IRootState } from '../../store/interfaces/root-state';

@Component({
  selector: 'app-drawer',
  templateUrl: 'drawer.component.html',
  styleUrls: ['drawer.component.scss']
})
export class DrawerComponent {
  constructor(private readonly store$: Store<IRootState>, private readonly router: Router) {}

  readonly drawerOpened$ = this.store$.pipe(select(({ app }) => app.drawerOpen));

  onBackdropClicked(): void {
    this.store$.dispatch(appActions.toggleDrawer());
  }

  onNavigate(path: string): void {
    this.store$.dispatch(appActions.toggleDrawer());
    this.router.navigate([path]);
  }
}
