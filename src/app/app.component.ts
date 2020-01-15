import { FocusMonitor } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as appActions from './store/app.actions';
import * as settingsSelectors from './modules/settings/store/settings.selectors';
import { IRootState } from './store/models/root-state';

const STORAGE_CHANGED_EVENT = 'STORAGE_CHANGED_EVENT';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  readonly showStorageDisplay$ = this.breakpoint
    .observe(Breakpoints.HandsetPortrait)
    .pipe(map(({ matches }) => !matches && !this.isTestRunner));

  readonly isHandsetPortrait$ = this.breakpoint
    .observe(Breakpoints.HandsetPortrait)
    .pipe(map(({ matches }) => matches));

  readonly isDarkTheme$ = this.store$.pipe(select(settingsSelectors.isDarkTheme));

  constructor(
    private readonly breakpoint: BreakpointObserver,
    private readonly store$: Store<IRootState>,
    private readonly focusMonitor: FocusMonitor
  ) {}

  private readonly isTestRunner = Boolean(window.localStorage && window.localStorage[STORAGE_CHANGED_EVENT]);

  onMenuClicked(): void {
    this.store$.dispatch(appActions.toggleDrawer({ open: true }));
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
    } catch (e) {
      // ignored
    }
  }
}
