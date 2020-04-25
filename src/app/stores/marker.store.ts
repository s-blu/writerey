import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { List } from 'immutable';
import { map} from 'rxjs/operators';
import { sortMarkerDefinitions } from '../utils/marker.utils';


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
