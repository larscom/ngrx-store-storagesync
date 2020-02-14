import { browser, by, element, promise } from 'protractor';

export class TodoPage {
  navigateTo(): promise.Promise<string> {
    return browser.get(browser.baseUrl);
  }

  getTitleText(): promise.Promise<string> {
    return element(by.css('app-todo-list h2')).getText();
  }
}
