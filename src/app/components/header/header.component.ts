import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() isMobile!: boolean;

  @Output()
  navigateHome = new EventEmitter<void>();
  @Output()
  menuClicked = new EventEmitter<void>();
  @Output()
  resetState = new EventEmitter<void>();
}
