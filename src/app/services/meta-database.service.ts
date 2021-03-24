import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaDatabaseService {
  database;

  constructor() {
    this.database = new Dexie('writerey_meta');
    if (environment.debugMode) this.database.debug = true;

    this.database.version(1).stores({
      paragraphMeta: 'pId,[docPath+docName]',
    });
  }

  upsertParagraphMeta(docPath, docName, context, data) {
    let pNoteCount = 0;
    // TODO is that necessary? Shouldnt a data.notes.length be enough?
    data.notes?.forEach(note => {
      if (note.context === 'paragraph') pNoteCount++;
    });
    this.database.paragraphMeta.put({ docPath, docName, pId: context, pNoteCount, labels: data.labels });
  }

  getParagraphMetaForDocument(docPath, docName) {
    return this.database.paragraphMeta.where('[docPath+docName]').equals([docPath, docName]).toArray();
  }
}

export interface ParagraphMetaEntry {
  pId: string;
  docPath: string;
  docName: string;
  pNoteCount: number;
  labels: { id; valueId }[];
}
