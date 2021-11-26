import { Selector } from 'testcafe';
import { refreshPage } from './util';

fixture`Menu`.page`http://localhost:4200`;

test('should keep menu open after page refresh', async (tc) => {
  const menuSelector = Selector('.mat-drawer');

  await tc
    .expect(menuSelector.visible)
    .eql(false)

    .click(Selector('button#menu'))

    .expect(menuSelector.visible)
    .eql(true)

    .wait(100);

  await refreshPage();

  await tc.expect(menuSelector.visible).eql(true);
});
