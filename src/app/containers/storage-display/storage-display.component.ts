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
  constructor(private readonly store$: Store<IRootState>) {}

  sessionStorage$ = combineLatest(of(window.sessionStorage), this.store$).pipe(
    map(([storage]) => storage)
  );
  localStorage$ = combineLatest(of(window.localStorage), this.store$).pipe(
    map(([storage]) => storage)
  );
}
