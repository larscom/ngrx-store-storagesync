import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormRegisterService } from '../services/form-register.service';

@Directive({
  selector: '[formControl]'
})
export class FormControlDirective implements OnInit, OnDestroy {
  @Input() formControl: FormControl;
  @Input() formControlSync = true;

  constructor(private readonly formRegister: FormRegisterService) {}

  ngOnInit(): void {
    this.formRegister.registerControl(this);
  }

  ngOnDestroy(): void {
    this.formRegister.deregisterControl(this);
  }
}
