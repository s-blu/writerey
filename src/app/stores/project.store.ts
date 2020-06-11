// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const LAST_PROJECT_KEY = 'writerey_last_selected_project';

@Injectable({ providedIn: 'root' })
export class ProjectStore {
  private readonly _projectSubject = new BehaviorSubject<string>(undefined);

  readonly project$ = this._projectSubject.asObservable();

  private get projectSubject(): any {
    return this._projectSubject.getValue();
  }

  private set projectSubject(val: any) {
    this._projectSubject.next(val);
  }

  public setProject(newproject: string) {
    if (newproject) localStorage.setItem(LAST_PROJECT_KEY, newproject);
    this.projectSubject = newproject;
  }
}
