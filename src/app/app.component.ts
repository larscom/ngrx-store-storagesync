import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as appActions from './store/app.actions';
import { IRootState } from './store/models/root-state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  readonly isHandsetPortrait$ = this.breakpoint
    .observe(Breakpoints.HandsetPortrait)
    .pipe(map(({ matches }) => matches));

  constructor(private readonly breakpoint: BreakpointObserver, private readonly store$: Store<IRootState>) {}

  onMenuClicked(): void {
    this.store$.dispatch(appActions.toggleDrawer({ open: true }));
  }

  onResetState(): void {
    if (!confirm('Reset state and reload?')) return;

    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.reload();
  }
}
