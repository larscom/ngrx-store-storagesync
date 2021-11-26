import { Selector } from 'testcafe';
import { refreshPage } from './util';

fixture`Page: Todo`.page`http://localhost:4200`;

test('should remember completed todos after page refresh', async (tc) => {
  const completedCountSelector = Selector('h2#completed-count');
  const optionSelector = (number) => Selector(`mat-list-option#todo-${number}`);

  await tc
    .expect(completedCountSelector.count)
    .eql(0)

    .typeText(Selector('input#add-todo'), 'test')
    .click(Selector('button#add-todo'))

    .click(optionSelector(0))
    .click(optionSelector(1))
    .click(optionSelector(2))
    .click(optionSelector(3))

    .wait(500);

  await refreshPage();

  await tc.expect(completedCountSelector.innerText).eql('Completed (4)');
});
