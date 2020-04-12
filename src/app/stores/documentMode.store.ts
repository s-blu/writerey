import { DOC_MODES } from '../models/docModes.enum';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// For each entity, create:
// private readonly _nameOfEntity = new BehaviorSubject<Type>(Initial state);
// readonly nameOfEntity$ = this._nameOfEntity.asObservable();
// if needed add specialised streams
// readonly completedTodos$ = this.todos$.pipe(
//   map(todos => todos.filter(todo => todo.isCompleted))
// )
// and create get and setters for each observable
// get nameOfEntity(): Todo[] {
//   return this._nameOfEntity.getValue();
// }
// private set nameOfEntity(val: Todo[]) {
//   this._nameOfEntity.next(val);
// }
// Handle manipulation via functions, make sure to always create NEW object reference!

@Injectable({ providedIn: 'root' })
export class DocumentModeStore {
  private readonly _modeSubject = new BehaviorSubject<DOC_MODES>(DOC_MODES.WRITE);

  readonly mode$ = this._modeSubject.asObservable();

  private get modeSubject(): any {
    return this._modeSubject.getValue();
  }

  private set modeSubject(val: any) {
    this._modeSubject.next(val);
  }

  public setMode(newmode: DOC_MODES) {
    this.modeSubject = newmode;
  }
}
