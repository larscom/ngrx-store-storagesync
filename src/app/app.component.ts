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
    private readonly breakpoint: BreakpointObserver,
    private readonly store$: Store<IRootState>,
    private readonly focusMonitor: FocusMonitor
  ) {}

  readonly isHandsetPortrait$ = this.breakpoint
    .observe(Breakpoints.HandsetPortrait)
    .pipe(map(({ matches }) => matches));

  onMenuClicked(): void {
    this.store$.dispatch(appActions.toggleDrawer());
  }

  onMenuButtonRendered(menuButton: HTMLButtonElement): void {
    this.focusMonitor.stopMonitoring(menuButton);
  }

  onResetState(): void {
    if (!confirm('Reset state and reload?')) {
      return;
    }

    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.reload();
    } catch (e) {}
  }
}
