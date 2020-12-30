// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { LabelInfo, NoteItemStereotypes } from '@writerey/shared/models/notesItems.interface';
import { ProjectStore } from './../stores/project.store';
import { Label } from '@writerey/shared/models/label.interface';
import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, mergeMap, map, take } from 'rxjs/operators';
import { LabelDefinition } from '../shared/models/labelDefinition.class';
import { ContextStore } from '../stores/context.store';
import { LabelStore } from '../stores/label.store';
import { ContextService } from './context.service';

export enum metaTypesLabelValues {
  NOTES = 'notes',
  NOTES_AND_INFO = 'notesAndInfo',
}
@Injectable({
  providedIn: 'root',
})
export class LabelService implements OnDestroy {
  private subscription = new Subscription();
  private project: string;

  constructor(
    private api: ApiService,
    private httpClient: HttpClient,
    private paragraphService: ParagraphService,
    private contextStore: ContextStore,
    private labelStore: LabelStore,
    private projectStore: ProjectStore,
    private contextService: ContextService
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createNewLabelCategory(name: string) {
    const newLabel = new LabelDefinition(name);

    return this.getLabelDefinitions().pipe(
      mergeMap(labelDefRes => {
        let newLabelDef;
        if (!labelDefRes) {
          newLabelDef = [newLabel];
        } else {
          newLabelDef = [newLabel, ...labelDefRes];
        }
        return this.setLabelDefinitions(newLabelDef);
      })
    );
  }

  deleteLabelCategory(labelId: string) {
    if (!labelId) return;
    // TODO REMOVE META FILES

    return this.getLabelDefinitions().pipe(
      mergeMap(labelDefRes => {
        if (!labelDefRes) return;
        const index = labelDefRes.findIndex(m => m.id === labelId);
        if (index > -1) {
          labelDefRes.splice(index, 1);
          return this.setLabelDefinitions(labelDefRes);
        }
      })
    );
  }

  getLabelDefinitions() {
    const params = {
      project: this.project,
    };

    return this.httpClient.get(this.api.getLabelRoute('definitions'), { params }).pipe(
      catchError(err => {
        if (err.status === 404) return of('');
        return this.api.handleHttpError(err);
      }),
      map((res: string) => {
        return this.parseLabelValueResponse(res);
      }),
      map((res: any) => {
        if (res && res instanceof Array) {
          res = res.sort((labelA, labelB) => {
            if (labelA.index === undefined) return 1;
            if (labelA.index < labelB.index) return -1;
            if (labelA.index > labelB.index) return 1;
            return 0;
          });
        }
        this.labelStore.setLabelDefinitions(res);
        return res;
      })
    );
  }

  getLabelDefinition(id) {
    if (!id) return of(null);
    return this.labelStore.labelDefinitions$.pipe(
      take(1),
      map(defs => {
        return defs.find(def => def.id === id);
      })
    );
  }

  init() {
    this.subscription.add(
      this.projectStore.project$.subscribe(project => {
        this.project = project;
        if (!project) return;
        this.getLabelDefinitions().pipe(take(1)).subscribe();
      })
    );
  }

  updateLabelDefinition(labelDef: LabelDefinition) {
    return this.getLabelDefinitions().pipe(
      mergeMap(labelDefRes => {
        let updatedLabelDefs;
        if (!labelDefRes) {
          console.error('Could not get any label definitions, even though I try to update an existing one. Aborting.');
          return;
        } else {
          const oldIndex = labelDefRes.findIndex(el => el.id === labelDef.id);
          if (oldIndex === -1) {
            console.warn('could not find old item for labelDef. Inserting new.', labelDef);
            updatedLabelDefs = [labelDef, ...labelDefRes];
          } else {
            updatedLabelDefs = labelDefRes;
            updatedLabelDefs.splice(oldIndex, 1, labelDef);
          }
        }
        return this.setLabelDefinitions(updatedLabelDefs).pipe(map(res => res.find(def => def.id === labelDef.id)));
      })
    );
  }

  setLabelDefinitions(content) {
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const file = new File([blob], name, { type: 'application/json' });

    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('project', this.project);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient.put(this.api.getLabelRoute('definitions'), formdata, { headers: httpHeaders }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        const result = this.parseLabelValueResponse(res);
        this.labelStore.setLabelDefinitions(result);
        return result;
      })
    );
  }

  saveMetaForLabelValue(contextId, content) {
    content = content?.filter(item => item.stereotype !== NoteItemStereotypes.LABEL);

    const [labelId, valueId] = contextId.split(':');
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const file = new File([blob], name, { type: 'application/json' });

    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('project', this.project);
    formdata.append('value_id', valueId);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.httpClient.put(this.api.getLabelRoute(labelId), formdata, { headers: httpHeaders }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: any) => this.parseLabelValueResponse(res))
    );
  }

  getInfoForLabelValue(label) {
    return this.getLabelDefinition(label.id).pipe(
      map(labelDef => {
        const infoText = labelDef.values?.find(val => val.id === label.valueId)?.info;
        let response;
        if (infoText) {
          response = {
            stereotype: NoteItemStereotypes.LABEL,
            id: 'label-info',
            context: this.contextService.getContextStringForLabel(label),
            text: infoText,
            type: 'label',
          } as LabelInfo;
        }
        return response;
      })
    );
  }

  getLabelIdsWithExistingMeta(): Observable<any> {
    return this.httpClient
      .get(this.api.getLabelStatisticRoute(this.project))
      .pipe(catchError(err => this.api.handleHttpError(err)));
  }

  getMetaForLabelValue(contextId, metaType?): Observable<any> {
    if (!contextId) return of([]);
    const label = this.contextService.getLabelFromContextString(contextId);
    const params = {
      value_id: label.valueId,
      project: this.project,
    };
    return this.httpClient.get(this.api.getLabelRoute(label.id), { params }).pipe(
      catchError(err => {
        if (err.status === 404) return of('');
        return this.api.handleHttpError(err);
      }),
      map((res: string) => {
        return this.parseLabelValueResponse(res);
      }),
      mergeMap(notes => {
        if (metaType === metaTypesLabelValues.NOTES_AND_INFO) {
          return this.getInfoForLabelValue(label).pipe(map(info => [info, ...notes]));
        } else {
          return of(notes);
        }
      })
    );
  }

  upsertLabelForParagraph(path, name, paragraphId, labels, labelId, valueId) {
    if (!labelId || !valueId) {
      console.error('upsertLabelForParagraph was called with invalid data, aborting');
      return;
    }
    const newLabels = [...labels];
    const existingLabel = newLabels.find(m => m.id === labelId);
    if (existingLabel) {
      const oldContext = this.contextService.getContextStringForLabel(existingLabel);
      existingLabel.valueId = valueId;
      this.contextStore.replaceContext(oldContext, this.contextService.getContextStringForLabel(existingLabel));
    } else {
      const newLabel: Label = {
        id: labelId,
        valueId,
      };
      newLabels.push(newLabel);
      this.contextStore.addContext(this.contextService.getContextStringForLabel(newLabel));
    }

    return this.paragraphService.setParagraphMeta(path, name, paragraphId, 'labels', newLabels);
  }

  removeLabelFromParagraph(path, name, paragraphId, labels, labelId) {
    if (!labelId) {
      console.error('removeLabelFromParagraph was called with invalid data, aborting');
      return;
    }
    const indexToRemove = (labels || []).findIndex(m => m.id === labelId);
    if (indexToRemove === -1) {
      console.warn('removeLabelFromParagraph could not find item to remove, do nothing', labels, labelId);
      return;
    }
    const updatedLabels = [...labels];
    const [removedLabel] = updatedLabels.splice(indexToRemove, 1);
    this.contextStore.removeContext(this.contextService.getContextStringForLabel(removedLabel));

    return this.paragraphService.setParagraphMeta(path, name, paragraphId, 'labels', updatedLabels);
  }

  private parseLabelValueResponse(res) {
    if (!res || res === '') return [];
    try {
      const data = JSON.parse(res);
      return data;
    } catch {
      console.warn('Was not able to parse label value meta. Returning result as-is.');
      return res;
    }
  }
}
