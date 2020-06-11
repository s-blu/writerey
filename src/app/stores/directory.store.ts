// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DirectoryStore {
  private readonly _treeSubject = new BehaviorSubject<any>(null);

  readonly tree$ = this._treeSubject.asObservable();

  private set treeSubject(val: any) {
    this._treeSubject.next(val);
  }

  public setTree(newTree: any) {
    this.treeSubject = newTree;
  }
}
