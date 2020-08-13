// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DISTRACTION_FREE_STATES } from '@writerey/shared/models/distractionFreeStates.enum';
import { FADE_ANIMATIONS } from '@writerey/shared/utils/animation.utils';
import { DistractionFreeStore } from '../../../stores/distractionFree.store';
import { DocumentModeStore } from '../../../stores/documentMode.store';
import { LabelStore } from '../../../stores/label.store';
import { Subscription } from 'rxjs';
import { ParagraphService } from '../../../services/paragraph.service';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { Component, OnInit, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FileInfo } from '@writerey/shared/models/fileInfo.interface';
import { LabelDefinition, LabelTypes } from '@writerey/shared/models/labelDefinition.class';
import { LabelService } from 'src/app/services/label.service';
import { Label } from '@writerey/shared/models/label.interface';
import { DocumentStore } from 'src/app/stores/document.store';
import { sortLabelArray } from '@writerey/shared/utils/label.utils';
import { flatMap, tap } from 'rxjs/operators';
import { ContextService } from 'src/app/services/context.service';
@Component({
  selector: 'wy-document-marks',
  templateUrl: './documentLabels.component.html',
  styleUrls: ['./documentLabels.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class DocumentLabelsComponent implements OnInit, OnChanges, OnDestroy {
  paragraphId: string;
  fileInfo: FileInfo;
  labels: Array<Label> = [];
  labelsFromServer: Array<Label> = [];
  values: any = {};
  labelDefinitions: Array<LabelDefinition>;
  MODES = DOC_MODES;
  mode: DOC_MODES;
  TYPES = LabelTypes;
  distractionFreeState: DISTRACTION_FREE_STATES;
  DF_STATE = DISTRACTION_FREE_STATES;

  private subscription = new Subscription();

  constructor(
    private paragraphService: ParagraphService,
    private labelService: LabelService,
    private labelStore: LabelStore,
    private documentModeStore: DocumentModeStore,
    private documentStore: DocumentStore,
    private distractionFreeStore: DistractionFreeStore,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
      })
    );
    this.subscription.add(this.documentModeStore.mode$.subscribe(mode => (this.mode = mode)));
    this.subscription.add(
      this.documentStore.paragraphId$.subscribe(id => {
        this.paragraphId = id;
        this.refresh();
      })
    );
    this.subscription.add(
      this.documentStore.fileInfo$.subscribe(fileInfo => {
        this.fileInfo = fileInfo;
        this.refresh();
      })
    );
    this.subscription.add(
      this.distractionFreeStore.distractionFree$.subscribe(status => (this.distractionFreeState = status))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refresh();
  }

  setValOfTextLabel(def, event) {
    const newValue = event.value;
    if (!newValue) {
      this.removeLabel(def.id);
      return;
    }

    this.upsertLabel(def.id, newValue);
  }

  setValOfNumLabel(def, event) {
    const newValue = event.value;

    if (newValue < def.start) {
      this.removeLabel(def.id);
      return;
    }
    const valueDef = def.values.find(v => v.name === newValue);
    this.upsertLabel(def.id, valueDef.id);
  }

  private refresh() {
    if (!this.fileInfo || !this.paragraphId) return;
    this.labels = [];
    this.values = {};
    this.subscription.add(
      this.paragraphService
        .getParagraphMeta(this.fileInfo.path, this.fileInfo.name, this.paragraphId, 'labels')
        .subscribe(res => {
          this.labelsFromServer = res || [];
          this.updateDisplayInfo(res);
        })
    );
  }
  private removeLabel(labelId) {
    if (!labelId) return;
    const index = this.labels.findIndex(m => m.id === labelId);
    if (index === -1) return;

    this.subscription.add(
      this.labelService
        .removeLabelFromParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.labelsFromServer,
          labelId
        )
        .subscribe(res => {
          this.values[labelId] = undefined;
          this.labels.splice(index, 1);
          this.labelsFromServer = res;
        })
    );
  }

  private upsertLabel(labelId, valueId) {
    this.subscription.add(
      this.labelService
        .upsertLabelForParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.labelsFromServer,
          labelId,
          valueId
        )
        .pipe(
          tap(res => {
            this.labelsFromServer = res;
            this.updateDisplayInfo(res);
          }),
          flatMap(_ =>
            this.contextService.getContextsForDocument(this.fileInfo.path, this.fileInfo.name, this.paragraphId)
          )
        )
        .subscribe()
    );
  }

  private updateDisplayInfo(responseFromServer) {
    this.labels = [];
    this.values = {};
    if (!responseFromServer) return;
    responseFromServer = JSON.parse(JSON.stringify(responseFromServer));
    sortLabelArray(responseFromServer, this.labelDefinitions);

    for (const m of responseFromServer) {
      try {
        this.enhanceLabelWithDisplayInfo(m);
        this.labels.push(m);
        if (m.type === LabelTypes.TEXT) {
          this.values[m.id] = m.valueId;
        } else {
          this.values[m.id] = m.valueName;
        }
      } catch (err) {
        console.warn('Was not able to find a label definition for a label. Will remove it since it is invalid.', m);
      }
    }
  }

  private enhanceLabelWithDisplayInfo(label) {
    const labelDef = this.labelDefinitions.find(m => m.id === label.id);
    if (labelDef) {
      label.name = labelDef.name;
      label.type = labelDef.type;
      label.index = labelDef.index;
      const value = labelDef.values.find(val => val.id === label.valueId);
      if (value) label.valueName = value.name;
    } else {
      throw Error('Could not find Labeldefinition');
    }
  }
}
