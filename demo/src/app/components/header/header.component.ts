import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements AfterViewInit {
  @Input() isMobile: boolean;

  @Output()
  disableFocus = new EventEmitter<HTMLButtonElement>();
  @Output()
  navigateHome = new EventEmitter<void>();
  @Output()
  menuClicked = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.disableFocus.emit(document.querySelector('button'));
  }
}
