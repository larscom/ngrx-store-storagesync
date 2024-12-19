import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { IRootState } from '../../store/models/root-state';

@Component({
  selector: 'app-storage-display',
  templateUrl: './storage-display.component.html',
  styleUrls: ['./storage-display.component.scss'],
  standalone: false
})
export class StorageDisplayComponent {
  readonly sessionStorage$ = this.store$.pipe(
    filter(() => isPlatformBrowser(this.platformId)),
    map(() => JSON.stringify(window.sessionStorage, null, 4))
  );
  readonly localStorage$ = this.store$.pipe(
    filter(() => isPlatformBrowser(this.platformId)),
    map(() => JSON.stringify(window.localStorage, null, 4))
  );

  constructor(private readonly store$: Store<IRootState>, @Inject(PLATFORM_ID) private platformId: Object) {}
}
