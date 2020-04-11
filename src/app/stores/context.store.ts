import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List } from 'immutable';
import { map } from 'rxjs/operators';

// For each entity, create:
// private readonly _nameOfEntity = new BehaviorSubject<Type>(Initial state);
// readonly nameOfEntity$ = this._nameOfEntity.asObservable();
// if needed add specialised streams
// readonly completedTodos$ = this.todos$.pipe(
//   map(todos => todos.filter(todo => todo.isCompleted))
// )
// and create get and setters for each observable
// get obsName(): Todo[] {
//   return this._nameOfEntity.getValue();
// }
// private set obsName(val: Todo[]) {
//   this._nameOfEntity.next(val);
// }
// Handle manipulation via functions, make sure to always create NEW object reference!

@Injectable({ providedIn: 'root' })
export class ContextStore {

  private readonly _contextsSubject = new BehaviorSubject<List<string>>(List());

  readonly contexts$ = this._contextsSubject.asObservable().pipe(
    map((res: List<string>) => {
      if (!res) return res;
      return res.toArray();
    })
  );

  private get contextsSubject(): any {
    return this._contextsSubject.getValue();
  }

  private set contextsSubject(val: any) {
    this._contextsSubject.next(List(val));
  }

  public setContexts(newContexts: Array<string>) {
    if (!newContexts || !(newContexts instanceof Array)) {
      console.warn('setContext was called with invalid data, will reset to an empty array', newContexts)
      newContexts = [];
    }
    this.contextsSubject = List(newContexts);
  }

  public removeContext(contextToRemove: string) {
    if (!contextToRemove) return;
    this.contextsSubject = this.contextsSubject.filter(c => c !== contextToRemove);
  }

  public replaceContext(contextToRemove: string, contextToAdd) {
    if (!contextToRemove || !contextToAdd) return;
    const index = this.contextsSubject.indexOf(contextToRemove);
    if (index === -1) {
      console.error('Could not find context to replace doing nothing');
      return;
    }
    this.contextsSubject = this.contextsSubject.splice(index, 1, contextToAdd);
  }

  public addContext(contextToAdd: string) {
    if (!contextToAdd) return;
    this.contextsSubject = this.contextsSubject.concat(contextToAdd);
  }
}
