import { ApiService } from './api.service';
import { ParagraphService } from './paragraph.service';
import { Injectable } from '@angular/core';
import { catchError, map, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

enum DEFAULT_CONTEXTS {
  PARAGRAPH = 'paragraph',
  DOCUMENT = 'document',
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private defaultContextForParagraphs = [DEFAULT_CONTEXTS.PARAGRAPH, DEFAULT_CONTEXTS.DOCUMENT];

  constructor(private paragraphService: ParagraphService, private api: ApiService) {}

  getContextesForParagraph(paragraphId) {
    // TODO get paragraph meta, look at the marks on t he paragraph and add them to this list
    return paragraphId ? this.defaultContextForParagraphs : ['document'];
  }

  getNotesForParagraph(docPath, docName, paragraphId, contexts) {
    const notesWrap = {};
    contexts.forEach(c => {
      notesWrap[c] = [];
    });
    return this.paragraphService.getParagraphMeta(docPath, docName, paragraphId, 'notes').pipe(
      catchError(err => this.api.handleHttpError(err)),
      flatMap(pRes => {
        notesWrap[DEFAULT_CONTEXTS.PARAGRAPH] = pRes || [];
        return this.paragraphService.getParagraphMeta(docPath, docName, 'document', 'notes');
      }),
      flatMap(docRes => {
        notesWrap[DEFAULT_CONTEXTS.DOCUMENT] = docRes || [];
        return of(notesWrap);
        // return this.markerService.getMetaForMarkers(contexts)
      })
      // map(markerRes => {
      //   // TODO map the marker map to the notesWrap and return
      // })
    );
  }
}
