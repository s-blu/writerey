import { FileInfo } from './../models/fileInfo.interface';
import { DocumentDefinition } from './../models/documentDefinition.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DocumentStore {
  private readonly _documentSubject = new BehaviorSubject<DocumentDefinition>(null);
  private readonly _fileInfoSubject = new BehaviorSubject<FileInfo>(null);
  private readonly _paragraphIdSubject = new BehaviorSubject<string>('');
  private readonly _lastSavedSubject = new BehaviorSubject<Date>(null);

  readonly document$ = this._documentSubject.asObservable().pipe(
    tap(res => {
      if (res?.last_edited) {
        this.setLastSaved(res.last_edited);
      }
    })
  );
  readonly fileInfo$ = this._fileInfoSubject.asObservable();
  readonly paragraphId$ = this._paragraphIdSubject.asObservable();

  readonly lastSaved$ = this._lastSavedSubject.asObservable();

  private get documentSubject(): DocumentDefinition {
    return this._documentSubject.getValue();
  }

  private set documentSubject(val: DocumentDefinition) {
    const newObjectReference = JSON.parse(JSON.stringify(val));
    this._documentSubject.next(newObjectReference);
  }

  public setDocument(newDocument: DocumentDefinition) {
    if (!newDocument) {
      console.error('setDocument was called with invalid data, will ignore value', newDocument);
      return;
    }
    this.documentSubject = newDocument;
  }

  private set fileInfoSubject(val: FileInfo) {
    const newObjectReference = JSON.parse(JSON.stringify(val));
    this._fileInfoSubject.next(newObjectReference);
  }

  public setFileInfo(newInfo: FileInfo) {
    if (!newInfo) {
      console.error('setFileInfo was called with invalid data, will ignore value', newInfo);
      return;
    }
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
}
