import { browser, logging } from 'protractor';
import { TodoPage } from './todo.po';

describe('Todo Page', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
    page.navigateTo('todo');
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

  it('should remember completed todos after page refresh', () => {
    page.addTodo('test');

    page.clickAllTodos();

    page.reload();

    expect(page.getCompletedTodosTitle()).toContain(4);
  });

  it('should keep menu open after page refresh', () => {
    expect(page.getDrawerStyleVisibility()).toEqual('hidden');

    page.openMenu();

    expect(page.getDrawerStyleVisibility()).toEqual('visible');

    page.reload();

    expect(page.getDrawerStyleVisibility()).toEqual('visible');
  });
});
