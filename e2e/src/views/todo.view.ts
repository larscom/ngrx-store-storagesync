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

test('Should have Add Todo in title', async controller => {
  await controller.expect(Selector('app-todo-list h2').innerText).eql('Add Todo');
});
