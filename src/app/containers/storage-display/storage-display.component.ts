import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { IRootState } from '../../store/models/root-state';

@Component({
  selector: 'app-storage-display',
  templateUrl: './storage-display.component.html',
  styleUrls: ['./storage-display.component.scss']
})
export class StorageDisplayComponent {
  constructor(private readonly store$: Store<IRootState>) {}

  sessionStorage$ = this.store$.pipe(map(() => window.sessionStorage));
  localStorage$ = this.store$.pipe(map(() => window.localStorage));
}
