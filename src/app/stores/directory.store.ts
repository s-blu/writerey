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
