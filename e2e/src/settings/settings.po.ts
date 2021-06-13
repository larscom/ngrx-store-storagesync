import { by, element, ElementFinder } from 'protractor';
import { Page } from '../page.po';

export class SettingsPage extends Page {
  getLightTheme(): ElementFinder {
    return element(by.css('#selectTheme #theme-0'));
  }

  getDarkTheme(): ElementFinder {
    return element(by.css('#selectTheme #theme-1'));
  }
}
