import { by, element, promise } from 'protractor';
import { Page } from '../page.po';

export class TodoPage extends Page {
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

  getDrawerStyleVisibility(): promise.Promise<string> {
    return element(by.css('.mat-drawer')).getCssValue('visibility');
  }
}
