import { TodoPage } from './todo.po';
import { browser, logging } from 'protractor';

describe('Todo Tests', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('first test case', () => {
    page.navigateTo();
    // page.navigateTo('https://ngrx-store-storagesync.netlify.com/#/todo');
    expect(page.getTitleText()).toEqual('Add Todo');
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
});
