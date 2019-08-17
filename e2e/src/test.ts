import { Selector } from 'testcafe';

import config from './config';

fixture(`Getting Started`).page(`${config.url}`);

test('My first test', async t => {
  await t.expect(Selector('h2').innerText).eql('Local Storage');
});
