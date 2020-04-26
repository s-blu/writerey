import { MarkerService } from 'src/app/services/marker.service';
import { ApiService } from './api.service';
import { ParagraphService } from './paragraph.service';
import { Injectable } from '@angular/core';
import { catchError, flatMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { DEFAULT_CONTEXTS } from './context.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(
    private paragraphService: ParagraphService,
    private api: ApiService,
    private markerService: MarkerService
  ) {}

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

        const markerContexts = [];
        for (const c of contexts) {
          if (c.includes(':')) {
            markerContexts.push(this.markerService.getMetaForMarkerValue(c, 'notes'));
          }
        }

        return markerContexts.length > 0 ? forkJoin(markerContexts) : of(notesWrap);
      }),
      flatMap((markerRes: Array<any>) => {
        if (markerRes && markerRes instanceof Array) {
          for (const markerNotes of markerRes) {
            const contextOnNote = markerNotes[0]?.context;
            if (contextOnNote) notesWrap[contextOnNote] = markerNotes;
          }
        }
        return of(notesWrap);
      })
    );
  }

  getNotesForMarkerDefinition(markerDef, contexts) {
    console.log('getting notes for marker', markerDef, contexts);
    const notesWrap = {};
    contexts.forEach(c => {
      notesWrap[c] = [];
    });

    const markerContexts = [];
    for (const c of contexts) {
      if (c.includes(':')) {
        markerContexts.push(this.markerService.getMetaForMarkerValue(c, 'notes'));
      }
    }

    console.log('markereure', markerContexts);
    return forkJoin(markerContexts).pipe(
      flatMap((markerRes: Array<any>) => {
        console.log('flatmap bby', markerRes);
        if (markerRes && markerRes instanceof Array) {
          for (const markerNotes of markerRes) {
            const contextOnNote = markerNotes[0]?.context;
            if (contextOnNote) notesWrap[contextOnNote] = markerNotes;
          }
        }
        return of(notesWrap);
      })
    );
  }
}
