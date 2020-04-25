import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SnapshotStore {
  private readonly _lastSnapshotDateSubject = new BehaviorSubject<Date>(null);
  private readonly _lastTagDateSubject = new BehaviorSubject<Date>(null);
  private readonly _lastTagNameSubject = new BehaviorSubject<string>('');

  readonly snapshotDate$ = this._lastSnapshotDateSubject.asObservable();
  readonly tagDate$ = this._lastTagDateSubject.asObservable();
  readonly tagName$ = this._lastTagNameSubject.asObservable();

  private set lastSnapshotDateSubject(val: any) {
    this._lastSnapshotDateSubject.next(val);
  }

  private set lastTagDateSubject(val: any) {
    this._lastTagDateSubject.next(val);
  }

  private set lastTagNameSubject(val: any) {
    this._lastTagNameSubject.next(val);
  }

  public setLastSnapshotDate(newDateString: string) {
    this.lastSnapshotDateSubject = new Date(newDateString);
  }

  public setLastTagDate(newDateString: string) {
    this.lastTagDateSubject = new Date(newDateString);
  }

  public setLastTagName(newDateString: string) {
    this.lastTagNameSubject = new Date(newDateString);
  }
}
