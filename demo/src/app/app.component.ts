import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as appActions from './store/app.actions';
import { IRootState } from './store/interfaces/root-state';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private readonly _breakpoint: BreakpointObserver,
    private readonly _store$: Store<IRootState>,
    private readonly _focusMonitor: FocusMonitor
  ) {}

  readonly isHandsetPortrait$ = this._breakpoint
    .observe(Breakpoints.HandsetPortrait)
    .pipe(map(({ matches }) => matches));

  onMenuClicked(): void {
    this._store$.dispatch(new appActions.ToggleDrawer());
  }

  onMenuButtonRendered(menuButton: HTMLButtonElement): void {
    this._focusMonitor.stopMonitoring(menuButton);
  }
}
