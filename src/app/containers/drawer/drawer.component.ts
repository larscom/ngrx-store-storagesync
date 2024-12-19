import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as appActions from '../../store/app.actions';
import { IRootState } from '../../store/models/root-state';

@Component({
  selector: 'app-drawer',
  templateUrl: 'drawer.component.html',
  styleUrls: ['drawer.component.scss'],
  standalone: false
})
export class DrawerComponent {
  readonly drawerOpened$ = this.store$.pipe(select(({ app }) => app.drawerOpen));

  constructor(private readonly store$: Store<IRootState>, private readonly router: Router) {}

  onBackdropClicked(): void {
    this.store$.dispatch(appActions.toggleDrawer({ open: false }));
  }

  onNavigate(path: string): void {
    this.store$.dispatch(appActions.toggleDrawer({ open: false }));
    this.router.navigate([path]);
  }
}
