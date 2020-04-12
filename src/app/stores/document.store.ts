import { FileInfo } from './../models/fileInfo.interface';
import { DocumentDefinition } from './../models/documentDefinition.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// For each entity, create:
// private readonly _nameOfEntity = new BehaviorSubject<Type>(Initial state);
// readonly nameOfEntity$ = this._nameOfEntity.asObservable();
// if needed add specialised streams
// readonly completedTodos$ = this.todos$.pipe(
//   map(todos => todos.filter(todo => todo.isCompleted))
// )
// and create get and setters for each observable
// get obsName(): Todo[] {
//   return this._nameOfEntity.getValue();
// }
// private set obsName(val: Todo[]) {
//   this._nameOfEntity.next(val);
// }
// Handle manipulation via functions, make sure to always create NEW object reference!

@Injectable({ providedIn: 'root' })
export class DocumentStore {
  private readonly _documentSubject = new BehaviorSubject<DocumentDefinition>(null);
  private readonly _fileInfoSubject = new BehaviorSubject<FileInfo>(null);
  private readonly _paragraphIdSubject = new BehaviorSubject<string>('');

  readonly document$ = this._documentSubject.asObservable();
  readonly fileInfo$ = this._fileInfoSubject.asObservable();
  readonly paragraphId$ = this._paragraphIdSubject.asObservable();

  readonly lastSaved$ = this._documentSubject.asObservable().pipe(map((res: DocumentDefinition) => res?.last_edited));

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
}
