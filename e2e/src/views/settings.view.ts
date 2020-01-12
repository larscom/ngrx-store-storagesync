import { Selector } from 'testcafe';

import config from '../config';

/**
 * @feature Settings View
 */

fixture('Feature: Settings View').beforeEach(async controller => {
  const path = '/settings';
  await controller.navigateTo(`${config.url}/#${path}`);
  await controller.expect(await controller.eval(() => window.location.href)).contains(path);
});

test('should remember selected theme after page refresh', async controller => {
  const radioButtons = Selector('#selectTheme mat-radio-button').filter(
    ({ classList }) => !classList.contains('mat-radio-checked')
  );
  const theme = radioButtons.nth(0);
  const currentThemeId = await theme.id;

  await controller.click(theme);

  await controller.wait(300);

  await controller.eval(() => window.location.reload());

  await controller.expect(await theme.id).notEql(currentThemeId);
});
