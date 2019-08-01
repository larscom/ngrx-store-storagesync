import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IRootState } from '../../store/interfaces/root-state';

@Component({
  selector: 'app-storage-display',
  templateUrl: './storage-display.component.html',
  styleUrls: ['./storage-display.component.scss']
})
export class StorageDisplayComponent {
  constructor(private readonly _store$: Store<IRootState>) {}

  sessionStorage$ = combineLatest(of(window.sessionStorage), this._store$).pipe(
    map(([storage]) => storage)
  );
  localStorage$ = combineLatest(of(window.localStorage), this._store$).pipe(
    map(([storage]) => storage)
  );
}
