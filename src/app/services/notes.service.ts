// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { LabelService, metaTypesLabelValues } from 'src/app/services/label.service';
import { ApiService } from './api.service';
import { ParagraphService } from './paragraph.service';
import { Injectable } from '@angular/core';
import { catchError, mergeMap } from 'rxjs/operators';
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
      mergeMap(pRes => {
        notesWrap[DEFAULT_CONTEXTS.PARAGRAPH] = pRes || [];
        return this.paragraphService.getParagraphMeta(docPath, docName, 'document', 'notes');
      }),
      mergeMap(docRes => {
        notesWrap[DEFAULT_CONTEXTS.DOCUMENT] = docRes || [];

        const labelContexts = [];
        for (const c of contexts) {
          if (c.includes(':')) {
            labelContexts.push(this.labelService.getMetaForLabelValue(c, metaTypesLabelValues.NOTES_AND_INFO));
          }
        }
        return labelContexts.length > 0 ? forkJoin(labelContexts) : of(notesWrap);
      }),
      mergeMap((labelRes: Array<any>) => {
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

    return this.labelService.getLabelStatistics().pipe(
      mergeMap(valueIds => {
        console.log('labelstatistic reponse', valueIds);
        const contextObs = [];
        contexts.forEach(context => {
          const valueId = context.split(':')[1];
          if (valueIds.includes(valueId))
            contextObs.push(this.labelService.getMetaForLabelValue(context, metaTypesLabelValues.NOTES));
        });
        return forkJoin(contextObs);
      }),
      mergeMap((labelRes: Array<any>) => {
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
