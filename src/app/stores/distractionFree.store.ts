import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DistractionFreeStore {
  private readonly _distractionFreeSubject = new BehaviorSubject<boolean>(false);

  readonly distractionFree$ = this._distractionFreeSubject.asObservable().pipe(distinctUntilChanged());

  private get distractionFreeSubject(): any {
    return this._distractionFreeSubject.getValue();
  }

  private set distractionFreeSubject(val: any) {
    this._distractionFreeSubject.next(val);
  }

  public setDistractionFree(status: boolean) {
    this.distractionFreeSubject = status;
  }
}
