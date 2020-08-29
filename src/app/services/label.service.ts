// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ProjectStore } from './../stores/project.store';
import { Label } from '@writerey/shared/models/label.interface';
import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { LabelDefinition, LabelTypes } from '../shared/models/labelDefinition.class';
import { ContextStore } from '../stores/context.store';
import { LabelStore } from '../stores/label.store';
import { ContextService } from './context.service';
import { off } from 'process';

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

  createNewLabelCategory(name: string, type: LabelTypes) {
    const newLabel = new LabelDefinition(name, type);

    return this.getLabelDefinitions().pipe(
      flatMap(labelDefRes => {
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
      flatMap(labelDefRes => {
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
      catchError(err => this.api.handleHttpError(err)),
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
      flatMap(labelDefRes => {
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

  // TODO TAKE METATYPE INTO ACCOUNT AS SOON AS NECESSARY
  saveMetaForLabelValue(contextId, content, metaType?) {
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

  // TODO TAKE METATYPE INTO ACCOUNT AS SOON AS NECESSARY
  getMetaForLabelValue(contextId, metaType?): Observable<any> {
    if (!contextId) return of([]);
    const label = this.contextService.getLabelFromContextString(contextId);
    const params = {
      value_id: label.valueId,
      project: this.project,
    };
    return this.httpClient.get(this.api.getLabelRoute(label.id), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        return this.parseLabelValueResponse(res);
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
    if (!res || res === '') return res;
    try {
      const data = JSON.parse(res);
      return data;
    } catch {
      console.warn('Was not able to parse label value meta. Returning result as-is.');
      return res;
    }
  }
}
