// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List } from 'immutable';
import { map } from 'rxjs/operators';

/**
 * TODO
 * This store was used previously from the note items which was refactored. Currently I think nobody is reading this information.
 * Investigate if we need this store to live-update possible note item contexts when i.e.
 * - Changing a label value on a paragraph
 * - Adding/removing/renaming a label value on the label defition page
 */
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
      console.warn('setContext was called with invalid data, will reset to an empty array', newContexts);
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
