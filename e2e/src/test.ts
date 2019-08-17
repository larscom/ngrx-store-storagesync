import { Selector } from 'testcafe';

// tslint:disable-next-line: no-unused-expression
fixture`Getting Started`.page`${process.env.NGRX_STORE_STORAGESYNC_URL}`;

test('My first test', async t => {
  await t.expect(Selector('h2').innerText).eql('Local Storage');
});
