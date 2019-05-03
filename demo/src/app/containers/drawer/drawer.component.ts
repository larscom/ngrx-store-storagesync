import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { IRootState } from '../../store/interfaces/root-state';
import * as appActions from '../../store/app.actions';

@Component({
  selector: 'app-drawer',
  templateUrl: 'drawer.component.html',
  styleUrls: ['drawer.component.scss']
})
export class DrawerComponent {
  constructor(private readonly _store$: Store<IRootState>) {}

  readonly drawerOpened$ = this._store$.pipe(select(({ app }) => app.drawerOpen));

  onBackdropClicked(): void {
    this._store$.dispatch(new appActions.ToggleDrawer());
  }

  onNavigate(path: string): void {}
}
