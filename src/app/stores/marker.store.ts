import { Marker } from 'src/app/models/marker.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { map, flatMap } from 'rxjs/operators';
import { sortMarkerDefinitions } from '../utils/marker.utils';

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
export class MarkerStore {
  private readonly _markerDefinitionSubject = new BehaviorSubject<List<MarkerDefinition>>(List());

  readonly markerDefinitions$ = this._markerDefinitionSubject.asObservable().pipe(
    map((res: List<MarkerDefinition>) => {
      const array = res.toArray();
      array.sort(sortMarkerDefinitions);
      return array;
    })
  );

  private get markerDefinitionSubject(): any {
    return this._markerDefinitionSubject.getValue();
  }

  private set markerDefinitionSubject(val: any) {
    this._markerDefinitionSubject.next(List(val));
  }

  public setMarkerDefinitions(newMarkerDefinitions: Array<MarkerDefinition>) {
    if (!newMarkerDefinitions || !(newMarkerDefinitions instanceof Array)) {
      console.warn(
        'setMarkerDefinitions was called with invalid data, will reset to an empty array',
        newMarkerDefinitions
      );
      newMarkerDefinitions = [];
    }
    this.markerDefinitionSubject = List(newMarkerDefinitions);
  }
}
