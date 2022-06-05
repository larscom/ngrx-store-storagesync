import { Component, OnDestroy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IRootState } from 'src/app/store/models/root-state';
import { Theme } from '../../models/theme';
import { setTheme } from '../../store/settings.actions';
import { getTheme } from '../../store/settings.selectors';

@Component({
  selector: 'app-settings-list',
  templateUrl: 'settings-list.component.html',
  styleUrls: ['settings-list.component.scss']
})
export class SettingsListComponent implements OnDestroy {
  readonly themes = Object.keys(Theme);
  readonly themeControl = new UntypedFormControl();
  readonly subscriptions = new Subscription();

  constructor(private readonly store$: Store<IRootState>) {
    this.subscriptions.add(
      this.store$.pipe(select(getTheme)).subscribe(theme => this.themeControl.setValue(theme, { emitEvent: false }))
    );
    this.subscriptions.add(
      this.themeControl.valueChanges.subscribe(theme => this.store$.dispatch(setTheme({ theme })))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
