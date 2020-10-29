// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List } from 'immutable';
import { map } from 'rxjs/operators';
import { sortLabelDefinitions } from '../shared/utils/label.utils';

@Injectable({ providedIn: 'root' })
export class LabelStore {
  private readonly _labelDefinitionsSubject = new BehaviorSubject<List<LabelDefinition>>(List());

  readonly labelDefinitions$ = this._labelDefinitionsSubject.asObservable().pipe(
    map((res: List<LabelDefinition>) => {
      const array = res.toArray();
      array.sort(sortLabelDefinitions);
      return array;
    })
  );

  private readonly _labelDefinitionSubject = new BehaviorSubject<LabelDefinition>(null);

  readonly labelDefinition$ = this._labelDefinitionSubject.asObservable();

  private get labelDefinitionsSubject(): any {
    return this._labelDefinitionsSubject.getValue();
  }

  private set labelDefinitionsSubject(val: any) {
    this._labelDefinitionsSubject.next(List(val));
  }

  public setLabelDefinitions(newLabelDefinitions: Array<LabelDefinition>) {
    if (!newLabelDefinitions || !(newLabelDefinitions instanceof Array)) {
      console.warn(
        'setLabelDefinitions was called with invalid data, will reset to an empty array',
        newLabelDefinitions
      );
      newLabelDefinitions = [];
    }
    this.labelDefinitionsSubject = List(newLabelDefinitions);
  }

  private get labelDefinitionSubject(): LabelDefinition | null {
    return this._labelDefinitionSubject.getValue();
  }

  private set labelDefinitionSubject(val: LabelDefinition) {
    this._labelDefinitionSubject.next(val);
  }

  public setLabelDefinition(newLabelDefinition: LabelDefinition) {
    this.labelDefinitionSubject = newLabelDefinition ?? null;
  }
}
