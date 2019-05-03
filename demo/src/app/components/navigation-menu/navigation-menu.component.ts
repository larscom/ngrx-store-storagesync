import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: 'navigation-menu.component.html',
  styleUrls: ['navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent {}
