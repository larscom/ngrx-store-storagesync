import { Action } from '@ngrx/store';
import { Observable, Operator } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable: deprecation
export class MockStore<S> extends Observable<S> {
  constructor(private state?: Observable<S>) {
    super();
    this.source = state;
  }

  lift<R>(operator: Operator<S, R>): Observable<R> {
    const observable = new MockStore<R>();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }

  select(mapFn: (partial: Partial<S>) => Partial<S>): Observable<Partial<S>> {
    return this.state.pipe(map(state => mapFn.call(this, state)));
  }

  dispatch<A extends Action>(action: A): void {}
}
