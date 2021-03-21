import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaDatabaseService {
  database;

  constructor() {
    Dexie.delete('writerey_meta'); // TODO remove me
    this.database = new Dexie('writerey_meta');
    if (environment.debugMode) this.database.debug = true;

    this.database.version(1).stores({
      paragraphMeta: 'pId,docPath,docName', // paragraphNoteCount, assignedLabels
    });
    //this.database.open(); // not needed?
    // this.database.friends.add({ name: 'Ingemar Bergman', isCloseFriend: 0 });
    // this.database.pets.add({ name: 'Josephina', kind: 'dog', fur: 'too long right now' });
  }

  upsertParagraphMeta(docPath, docName, context, data) {
    let pNoteCount = 0;
    data.notes?.forEach(note => {
      if (note.context === 'paragraph') pNoteCount++;
    });
    console.log('upsertParagraphMeta', docPath, docName, context, data);
    // todo check if existing
    this.database.paragraphMeta.put({ docPath, docName, pId: context, pNoteCount, labels: data.labels });
  }
}
