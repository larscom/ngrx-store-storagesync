import { ITodoState } from '../../modules/todo/store/todo.reducer';
import { IAppState } from '../app.reducer';

export interface IRootState {
  app: IAppState;
  todo?: ITodoState;
}
