import { Selector } from 'testcafe';

// tslint:disable-next-line: no-unused-expression
fixture`Getting Started`.page`http://127.0.0.1`;

test('My first test', async t => {
  await t.expect(Selector('h2').innerText).eql('Local Storage');
});
