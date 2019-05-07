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
  menuButtonRendered = new EventEmitter<HTMLButtonElement>();
  @Output()
  navigateHome = new EventEmitter<void>();
  @Output()
  menuClicked = new EventEmitter<void>();
  @Output()
  reset = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.menuButtonRendered.emit(document.querySelector('button'));
  }
}
