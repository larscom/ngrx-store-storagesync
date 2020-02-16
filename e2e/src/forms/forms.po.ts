import { by, element, ElementFinder } from 'protractor';
import { Page } from '../page.po';

export class FormsPage extends Page {
  getSyncSwitch(): ElementFinder {
    return element(by.css('mat-slide-toggle#sync-switch'));
  }

  getFirstName(): ElementFinder {
    return element(by.css('form input#firstName'));
  }

  getLastName(): ElementFinder {
    return element(by.css('form input#lastName'));
  }
}
