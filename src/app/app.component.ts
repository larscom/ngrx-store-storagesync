import { FocusMonitor } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as settingsSelectors from './modules/settings/store/settings.selectors';
import * as appActions from './store/app.actions';
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
  readonly isPlatformBrowser = isPlatformBrowser(this.platformId);

  private readonly isTestRunner = Boolean(
    this.isPlatformBrowser && window.localStorage && window.localStorage[STORAGE_CHANGED_EVENT]
  );

  constructor(
    private readonly breakpoint: BreakpointObserver,
    private readonly store$: Store<IRootState>,
    private readonly focusMonitor: FocusMonitor,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  onMenuClicked(): void {
    this.store$.dispatch(appActions.toggleDrawer({ open: true }));
  }

  onMenuButtonRendered(menuButton: HTMLButtonElement | null): void {
    if (!menuButton) return;
    this.focusMonitor.stopMonitoring(menuButton);
  }

  onResetState(): void {
    if (confirm('Reset state and reload?')) {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.reload();
    }
  }
}
