import { FormGroupDirective } from '../../src/lib/form-sync/directives/form-group.directive';

describe('FormGroupDirective', () => {
  it('should create', () => {
    const directive = new FormGroupDirective({}, jasmine.createSpyObj('store', ['']));
    expect(directive).toBeTruthy();
  });
});
