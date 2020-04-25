import { DOC_MODES } from '../models/docModes.enum';
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
