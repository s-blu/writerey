import { LabelService } from 'src/app/services/label.service';
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
    private labelService: LabelService
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

        const labelContexts = [];
        for (const c of contexts) {
          if (c.includes(':')) {
            labelContexts.push(this.labelService.getMetaForLabelValue(c, 'notes'));
          }
        }

        return labelContexts.length > 0 ? forkJoin(labelContexts) : of(notesWrap);
      }),
      flatMap((labelRes: Array<any>) => {
        if (labelRes && labelRes instanceof Array) {
          for (const labelNotes of labelRes) {
            const contextOnNote = labelNotes[0]?.context;
            if (contextOnNote) notesWrap[contextOnNote] = labelNotes;
          }
        }
        return of(notesWrap);
      })
    );
  }

  getNotesForLabelDefinition(labelDef, contexts) {
    const notesWrap = {};
    contexts.forEach(c => {
      notesWrap[c] = [];
    });

    const labelContexts = [];
    for (const c of contexts) {
      if (c.includes(':')) {
        labelContexts.push(this.labelService.getMetaForLabelValue(c, 'notes'));
      }
    }

    return forkJoin(labelContexts).pipe(
      flatMap((labelRes: Array<any>) => {
        if (labelRes && labelRes instanceof Array) {
          for (const labelNotes of labelRes) {
            const contextOnNote = labelNotes[0]?.context;
            if (contextOnNote) notesWrap[contextOnNote] = labelNotes;
          }
        }
        return of(notesWrap);
      })
    );
  }
}
