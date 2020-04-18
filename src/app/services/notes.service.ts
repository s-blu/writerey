import { ContextStore } from './../stores/context.store';
import { MarkerService } from 'src/app/services/marker.service';
import { ApiService } from './api.service';
import { ParagraphService } from './paragraph.service';
import { Injectable } from '@angular/core';
import { catchError, map, flatMap } from 'rxjs/operators';
import { of, forkJoin, merge } from 'rxjs';

enum DEFAULT_CONTEXTS {
  PARAGRAPH = 'paragraph',
  DOCUMENT = 'document',
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {

  constructor(
    private paragraphService: ParagraphService,
    private api: ApiService,
    private markerService: MarkerService,
    private contextStore: ContextStore
  ) {}

  getContexts(docPath: string, docName: string, paragraphId?: string) {
    const contexts: Array<string> = [DEFAULT_CONTEXTS.DOCUMENT];
    if (paragraphId) contexts.push(DEFAULT_CONTEXTS.PARAGRAPH);
    return this.paragraphService.getParagraphMeta(docPath, docName, paragraphId, 'markers').pipe(
      map(markers => {
        if (markers) {
          for (const m of markers) {
            contexts.push(this.markerService.getContextStringForMarker(m));
          }
        }
        this.contextStore.setContexts(contexts);
        return contexts;
      })
    );
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

        const markerContexts = [];
        for (const c of contexts) {
          if (c.includes(':')) {
            markerContexts.push(this.markerService.getNotesForMarkerValue(c));
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
}
