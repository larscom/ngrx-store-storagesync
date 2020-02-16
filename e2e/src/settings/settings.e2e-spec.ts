import { browser, logging } from 'protractor';
import { SettingsPage } from './settings.po';

describe('Settings Page', () => {
  let page: SettingsPage;

  beforeEach(() => {
    page = new SettingsPage();
    page.navigateTo('settings');
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

  it('should remember light theme after page refresh', () => {
    expect(page.getDarkTheme().getAttribute('class')).toContain('mat-radio-checked');

    page.getLightTheme().click();

    expect(page.getLightTheme().getAttribute('class')).toContain('mat-radio-checked');

    page.reload();

    expect(page.getLightTheme().getAttribute('class')).toContain('mat-radio-checked');
  });
});
