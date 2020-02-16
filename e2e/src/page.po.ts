import { browser, element, by } from 'protractor';

export class Page {
  navigateTo(path: string): void {
    browser.get(`${browser.baseUrl}/#/${path}`);
  }

  reload(): void {
    browser.sleep(250);
    browser.refresh();
  }

  openMenu(): void {
    element(by.css('button#menu')).click();
  }
}
