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
  constructor(private readonly _store$: Store<IRootState>, private readonly _router: Router) {}

  readonly drawerOpened$ = this._store$.pipe(select(({ app }) => app.drawerOpen));

  onBackdropClicked(): void {
    this._store$.dispatch(new appActions.ToggleDrawer());
  }

  onNavigate(path: string): void {
    this._store$.dispatch(new appActions.ToggleDrawer());
    this._router.navigate([path]);
  }
}
