// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { LabelStore } from 'src/app/stores/label.store';
import { ContextStore } from './../stores/context.store';
import { ParagraphService } from './paragraph.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Label } from '../shared/models/label.interface';
import { map } from 'rxjs/operators';
import { LabelDefinition } from '../shared/models/labelDefinition.class';
import { Subscription, of } from 'rxjs';
import { sortLabelArray } from '../shared/utils/label.utils';

export enum DEFAULT_CONTEXTS {
  PARAGRAPH = 'paragraph',
  DOCUMENT = 'document',
}

@Injectable({
  providedIn: 'root',
})
export class ContextService implements OnDestroy {
  private labelDefinitions: Array<LabelDefinition>;
  private subscription = new Subscription();

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  constructor(
    private paragraphService: ParagraphService,
    private contextStore: ContextStore,
    private labelStore: LabelStore
  ) {
    this.subscription.add(this.labelStore.labelDefinitions$.subscribe(res => (this.labelDefinitions = res)));
  }

  getContextsForDocument(docPath: string, docName: string, paragraphId?: string) {
    const contexts: Array<string> = [DEFAULT_CONTEXTS.DOCUMENT];
    if (paragraphId) contexts.unshift(DEFAULT_CONTEXTS.PARAGRAPH);
    return this.paragraphService.getParagraphMeta(docPath, docName, paragraphId, 'labels').pipe(
      map(labels => {
        if (labels) {
          sortLabelArray(labels, this.labelDefinitions);
          for (const m of labels) {
            contexts.push(this.getContextStringForLabel(m));
          }
        }

        this.contextStore.setContexts(contexts);
        return contexts;
      })
    );
  }

  getContextsForLabelDefinition(labelDef: LabelDefinition) {
    const contexts: Array<string> = [];
    if (!labelDef?.values) return contexts;
    const labels = [];

    for (const val of labelDef.values) {
      labels.push({ id: labelDef.id, valueId: val.id, index: labelDef.index } as Label);
    }

    sortLabelArray(labels, this.labelDefinitions);
    for (const m of labels) {
      contexts.push(this.getContextStringForLabel(m));
    }
    this.contextStore.setContexts(contexts);
    return of(contexts);
  }

  public getContextStringForLabel(label: Label) {
    if (!label) return '';
    return `${label.id}:${label.valueId}`;
  }

  public getLabelFromContextString(context: string) {
    if (!context) return null;
    const [id, valueId] = context.split(':');
    const newLabel: Label = {
      id,
      valueId,
    };
    return newLabel;
  }
}
