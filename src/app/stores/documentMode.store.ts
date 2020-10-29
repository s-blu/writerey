// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DOC_MODES } from '../shared/models/docModes.enum';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
