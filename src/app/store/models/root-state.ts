import { ISettingsState } from '../../modules/settings/store/settings.reducer';
import { ITodoState } from '../../modules/todo/store/todo.reducer';
import { IAppState } from '../app.reducer';

export interface IRootState {
  app: IAppState;
  settings: ISettingsState;
  todo?: ITodoState;
}
