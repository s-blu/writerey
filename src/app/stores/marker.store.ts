import { LabelDefinition } from 'src/app/models/labelDefinition.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { List } from 'immutable';
import { map} from 'rxjs/operators';
import { sortLabelDefinitions } from '../utils/label.utils';


@Injectable({ providedIn: 'root' })
export class LabelStore {
  private readonly _labelDefinitionSubject = new BehaviorSubject<List<LabelDefinition>>(List());

  readonly labelDefinitions$ = this._labelDefinitionSubject.asObservable().pipe(
    map((res: List<LabelDefinition>) => {
      const array = res.toArray();
      array.sort(sortLabelDefinitions);
      return array;
    })
  );

  private get labelDefinitionSubject(): any {
    return this._labelDefinitionSubject.getValue();
  }

  private set labelDefinitionSubject(val: any) {
    this._labelDefinitionSubject.next(List(val));
  }

  public setLabelDefinitions(newLabelDefinitions: Array<LabelDefinition>) {
    if (!newLabelDefinitions || !(newLabelDefinitions instanceof Array)) {
      console.warn(
        'setLabelDefinitions was called with invalid data, will reset to an empty array',
        newLabelDefinitions
      );
      newLabelDefinitions = [];
    }
    this.labelDefinitionSubject = List(newLabelDefinitions);
  }
}
