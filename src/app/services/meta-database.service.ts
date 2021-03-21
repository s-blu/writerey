import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaDatabaseService {
  database;

  constructor() {
    // Dexie.delete('writerey_meta'); // TODO remove me
    this.database = new Dexie('writerey_meta');
    if (environment.debugMode) this.database.debug = true;

    this.database.version(1).stores({
      paragraphMeta: 'pId,[docPath+docName]', // paragraphNoteCount, assignedLabels
    });
    //this.database.open(); // not needed?
    // this.database.friends.add({ name: 'Ingemar Bergman', isCloseFriend: 0 });
    // this.database.pets.add({ name: 'Josephina', kind: 'dog', fur: 'too long right now' });
  }

  upsertParagraphMeta(docPath, docName, context, data) {
    let pNoteCount = 0;
    // TODO is that necessary? Shouldnt a data.notes.length be enough?
    data.notes?.forEach(note => {
      if (note.context === 'paragraph') pNoteCount++;
    });
    console.log('upsertParagraphMeta', docPath, docName, context, data);
    this.database.paragraphMeta.put({ docPath, docName, pId: context, pNoteCount, labels: data.labels });
  }

  getParagraphMetaForDocument(docPath, docName) {
    console.log('getParagraphMetaForDocument', docPath, docName);
    return this.database.paragraphMeta.where('[docPath+docName]').equals([docPath, docName]).toArray();
  }
}
