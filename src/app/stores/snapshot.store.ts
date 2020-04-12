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
export class SnapshotStore {
  private readonly _lastSnapshotDateSubject = new BehaviorSubject<Date>(null);
  private readonly _lastTagDateSubject = new BehaviorSubject<Date>(null);
  private readonly _lastTagNameSubject = new BehaviorSubject<string>('');

  readonly snapshotDate$ = this._lastSnapshotDateSubject.asObservable();
  readonly tagDate$ = this._lastTagDateSubject.asObservable();
  readonly tageName$ = this._lastTagNameSubject.asObservable();

  private get lastSnapshotDateSubject(): any {
    return this._lastSnapshotDateSubject.getValue();
  }

  private set lastSnapshotDateSubject(val: any) {
    this._lastSnapshotDateSubject.next(val);
  }

  private get lastTagDateSubject(): any {
    return this._lastTagDateSubject.getValue();
  }

  private set lastTagDateSubject(val: any) {
    this._lastTagDateSubject.next(val);
  }

  private get lastTagNameSubject(): any {
    return this._lastTagNameSubject.getValue();
  }

  private set lastTagNameSubject(val: any) {
    this._lastTagNameSubject.next(val);
  }

  public setLastSnapshotDate(newDateString: string) {
    this.lastSnapshotDateSubject = new Date(newDateString);
  }

  public setLastTagDate(newDateString: string) {
    this.lastTagDateSubject = new Date(newDateString);
  }

  public setLastTagName(newDateString: string) {
    this.lastTagNameSubject = new Date(newDateString);
  }
}
