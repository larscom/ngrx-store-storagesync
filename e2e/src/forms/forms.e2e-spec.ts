import { browser, logging } from 'protractor';
import { FormsPage } from './forms.po';

describe('Forms Page', () => {
  let page: FormsPage;

  beforeEach(() => {
    page = new FormsPage();
    page.navigateTo('forms');
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

  fit('should remember form input values after page refresh', async () => {
    expect(page.getSyncSwitch().getAttribute('class')).toContain('mat-checked');

    page.getFirstName().sendKeys('jan');
    page.getLastName().sendKeys('piet');

    page.reload();

    expect(page.getFirstName().getAttribute('value')).toEqual('jan');
    expect(page.getLastName().getAttribute('value')).toEqual('piet');
  });

  it('should not remember form input values after page refresh', () => {
    expect(page.getSyncSwitch().getAttribute('class')).toContain('mat-checked');

    page.getSyncSwitch().click();

    expect(page.getSyncSwitch().getAttribute('class')).not.toContain('mat-checked');

    page.getFirstName().sendKeys('jan');
    page.getLastName().sendKeys('piet');

    page.reload();

    expect(page.getFirstName().getAttribute('value')).toEqual('');
    expect(page.getLastName().getAttribute('value')).toEqual('');
  });
});
