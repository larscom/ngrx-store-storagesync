import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormSyncService } from '../providers/form-sync.service';

@Directive({
  selector: '[formControl]'
})
export class FormControlDirective implements OnInit, OnDestroy {
  @Input() formControl: FormControl;
  @Input() formControlSync = true;

  constructor(private readonly formSync: FormSyncService) {}

  ngOnInit(): void {
    this.formSync.registerControl(this);
  }

  ngOnDestroy(): void {
    this.formSync.deregisterControl(this);
  }
}
