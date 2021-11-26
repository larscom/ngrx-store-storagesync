import { Selector } from 'testcafe';
import { refreshPage } from './util';

fixture`Page: Settings`.page`http://localhost:4200/#/settings`;

test('should remember light theme after page refresh', async (tc) => {
  const lightThemeSelector = Selector('#selectTheme #theme-0');
  const darkThemeSelector = Selector('#selectTheme #theme-1');

  await tc
    .expect(darkThemeSelector.hasClass('mat-radio-checked'))
    .ok()
    .click(lightThemeSelector)
    .expect(lightThemeSelector.hasClass('mat-radio-checked'))
    .ok()
    .wait(250);

  await refreshPage();

  await tc.expect(lightThemeSelector.hasClass('mat-radio-checked')).ok();
});
