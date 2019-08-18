import { ClientFunction, Selector } from 'testcafe';

import config from '../config';

/**
 * @feature Todo View
 */

fixture('Feature: Todo View').beforeEach(async controller => {
  const path = '/todo';
  await controller.navigateTo(`${config.url}/#${path}`);

  const getUrl = ClientFunction(() => window.location.href);
  await controller.expect(getUrl()).contains(path);
});

test('should remember completed todos after page refresh', async controller => {
  await controller.typeText(Selector('input#add-todo'), 'test');
  await controller.click(Selector('button#add-todo'));

  const checkboxes = Selector('.mat-list-option');
  const checkboxCount = await checkboxes.count;

  for (let i = 0; i < checkboxCount; i++) {
    await controller.click(checkboxes.nth(i));
  }

  await controller.wait(300);

  await controller.eval(() => location.reload());

  await controller.expect(Selector('h2#completed-count').innerText).contains(String(checkboxCount));
});

test('should keep menu open after page refresh', async controller => {
  const drawer = Selector('.mat-drawer');

  // check for visibility hidden
  await controller.expect(drawer.withAttribute('style', /(^|[\s])visibility\s*:\s*hidden\s*($|;)/).exists).ok();

  await controller.click(Selector('button#menu'));
  await controller.eval(() => location.reload());

  // check for visibility visible
  await controller.expect(drawer.withAttribute('style', /(^|[\s])visibility\s*:\s*visible\s*($|;)/).exists).ok();
});
