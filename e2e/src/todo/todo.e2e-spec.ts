import { browser, logging } from 'protractor';
import { TodoPage } from './todo.po';

describe('Todo', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  afterEach(async () => {
    const logs = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER);

    const logEntry = {
      level: logging.Level.SEVERE
    } as logging.Entry;

    expect(logs).not.toContain(jasmine.objectContaining(logEntry));
  });

  it('should remember completed todos after page refresh', async () => {
    page.navigateTo();

    page.addTodo('test');

    page.clickAllTodos();

    page.refresh();

    expect(page.getCompletedTodosTitle()).toContain(4);
  });
});
