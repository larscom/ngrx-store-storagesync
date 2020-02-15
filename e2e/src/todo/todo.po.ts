import { browser, by, element, promise } from 'protractor';

// mat-pseudo-checkbox
export class TodoPage {
  navigateTo(): promise.Promise<string> {
    const url = `${browser.baseUrl}/#/todo`;
    return browser.get(url);
  }

  addTodo(value: string): void {
    element(by.css('input#add-todo')).sendKeys(value);
    element(by.css('button#add-todo')).click();
  }

  clickAllTodos(): void {
    const checkboxes = element.all(by.css('.mat-pseudo-checkbox'));
    checkboxes.each(checkbox => checkbox.click());
  }

  getCompletedTodosTitle(): promise.Promise<string> {
    return element(by.css('h2#completed-count')).getText();
  }

  refresh(): void {
    browser.sleep(250);
    browser.refresh();
  }
}
