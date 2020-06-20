// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DISTRACTION_FREE_STATES } from './../models/distractionFreeStates.enum';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DistractionFreeStore {
  private readonly _distractionFreeSubject = new BehaviorSubject<DISTRACTION_FREE_STATES>(DISTRACTION_FREE_STATES.NONE);

  readonly distractionFree$ = this._distractionFreeSubject.asObservable().pipe(distinctUntilChanged());

  private get distractionFreeSubject(): any {
    return this._distractionFreeSubject.getValue();
  }

  private set distractionFreeSubject(val: any) {
    this._distractionFreeSubject.next(val);
  }

  public setDistractionFree(status: DISTRACTION_FREE_STATES) {
    this.distractionFreeSubject = status;
  }
}
