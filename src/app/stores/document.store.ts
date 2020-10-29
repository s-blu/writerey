// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FileInfo } from '../shared/models/fileInfo.interface';
import { DocumentDefinition, LAST_DOCUMENT_KEY } from '../shared/models/documentDefinition.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DocumentStore {
  private readonly _documentSubject = new BehaviorSubject<DocumentDefinition>(null);
  private readonly _fileInfoSubject = new BehaviorSubject<FileInfo>(null);
  private readonly _paragraphIdSubject = new BehaviorSubject<string>('');
  private readonly _lastSavedSubject = new BehaviorSubject<Date>(null);
  private readonly _wordCountSubject = new BehaviorSubject<number>(0);

  readonly document$ = this._documentSubject.asObservable().pipe(
    tap(res => {
      if (res?.last_edited) this.setLastSaved(res.last_edited);
    }),
    tap(() => {
      this.setWordCount(0);
    })
  );
  readonly fileInfo$ = this._fileInfoSubject.asObservable().pipe(
    tap(res => {
      if (res) {
        localStorage.setItem(LAST_DOCUMENT_KEY, JSON.stringify({ name: res.name, path: res.path }));
      }
    }),
    shareReplay(1)
  );
  readonly paragraphId$ = this._paragraphIdSubject.asObservable();
  readonly lastSaved$ = this._lastSavedSubject.asObservable();
  readonly wordCount$ = this._wordCountSubject.asObservable();

  private get documentSubject(): DocumentDefinition {
    return this._documentSubject.getValue();
  }

  private set documentSubject(val: DocumentDefinition) {
    const newObjectReference = JSON.parse(JSON.stringify(val));
    this._documentSubject.next(newObjectReference);
  }

  public setDocument(newDocument: DocumentDefinition) {
    this.documentSubject = newDocument;
  }

  private set fileInfoSubject(val: FileInfo) {
    const newObjectReference = JSON.parse(JSON.stringify(val));
    this._fileInfoSubject.next(newObjectReference);
  }

  public setFileInfo(newInfo: FileInfo) {
    this.fileInfoSubject = newInfo;
  }

  private set paragraphIdSubject(val: string) {
    this._paragraphIdSubject.next(val);
  }

  public setParagraphId(paragraphdId: string) {
    this.paragraphIdSubject = paragraphdId;
  }

  private set lastSavedSubject(val: Date) {
    this._lastSavedSubject.next(val);
  }

  public setLastSaved(lastSaved: Date) {
    this.lastSavedSubject = lastSaved;
  }

  private set wordCountSubject(val: number) {
    this._wordCountSubject.next(val);
  }

  public setWordCount(wordCount: number) {
    this.wordCountSubject = wordCount;
  }
}
