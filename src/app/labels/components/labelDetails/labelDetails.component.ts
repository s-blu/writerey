// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { editorWyNotesModules, setDecoupledToolbar } from '@writerey/shared/utils/editor.utils';
import { DeletionService } from '../../../services/deletion.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelService } from 'src/app/services/label.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import * as uuid from 'uuid';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, mergeMap, take, tap } from 'rxjs/operators';
import { LabelStore } from 'src/app/stores/label.store';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { delayValues } from '@writerey/shared/utils/observable.utils';
import { DocumentModeStore } from './../../../stores/documentMode.store';

@Component({
  selector: 'wy-label-details',
  templateUrl: './labelDetails.component.html',
  styleUrls: ['./labelDetails.component.scss'],
})
export class LabelDetailsComponent implements OnInit, OnDestroy {
  editForm;
  labelDefinition: LabelDefinition;
  values;
  renderValues = new FormArray([]);
  Editor = DecoupledEditor;
  editorConfig = editorWyNotesModules;
  onReady = setDecoupledToolbar;
  isLoadingValues = false;

  @ViewChild('tabGroup') tabGroup;

  private subscription = new Subscription();
  private template = ' \n';

  constructor(
    private formBuilder: FormBuilder,
    private labelService: LabelService,
    private labelStore: LabelStore,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    private deletionService: DeletionService,
    private route: ActivatedRoute,
    private documentModeStore: DocumentModeStore
  ) {}

  ngOnInit() {
    this.documentModeStore.setMode(DOC_MODES.REVIEW);
    this.subscription.add(
      this.route.params
        .pipe(mergeMap(params => this.labelService.getLabelDefinition(params.labelDefinitionId)))
        .subscribe(labelDef => {
          if (!labelDef) return;
          this.template = labelDef.template || ' \n';
          this.labelDefinition = labelDef;
          this.initializeForm(labelDef);
          this.labelStore.setLabelDefinition(labelDef);
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addNewValue() {
    this.values.insert(
      this.values.length,
      new FormGroup({
        name: new FormControl(''),
        id: new FormControl(uuid.v4()),
        info: new FormControl(this.template),
      })
    );
  }

  removeValue(index: number, value) {
    this.deletionService.handleDeleteUserInputAndSnapshot(value.name, 'labelValue').subscribe(res => {
      if (!res) return;
      this.values.removeAt(index);
    });
  }

  cancel() {
    this.initializeForm(this.labelDefinition);
  }

  onSubmit(newValues) {
    newValues.values.forEach(value => {
      if (value.info === this.template || value.info?.trim() === '') {
        delete value.info;
      }
    });

    this.labelService.updateLabelDefinition(newValues).subscribe(res => {
      const msg = this.translocoService.translate('labelDetails.saved');
      this.snackBar.open(msg, '', {
        duration: 2000,
        horizontalPosition: 'right',
      });
      this.labelDefinition = res;
    });
  }

  private initializeForm(labelDef) {
    if (!labelDef) {
      console.warn('got no label definition, cannot initialize form');
      return;
    }

    this.editForm = this.formBuilder.group({
      id: labelDef.id,
      type: labelDef.type,
      name: labelDef.name,
      index: labelDef.index,
      values: new FormArray([]),
      template: this.template,
    });

    this.renderValues = new FormArray([]);
    this.values = this.editForm.get('values') as FormArray;
    labelDef.values?.forEach(val => {
      this.values.push(
        new FormGroup({
          name: new FormControl(val.name),
          id: new FormControl(val.id),
          info: new FormControl(val.info || this.template),
        })
      );
    });

    if (this.tabGroup?.selectedIndex === 1) {
      this.initValues({ index: 1 });
    }
  }

  initValues(ev) {
    if (ev.index === 1 && this.renderValues.controls.length === 0 && this.values.controls.length !== 0) {
      this.isLoadingValues = true;
      delayValues(this.values.controls, 80)
        .pipe(
          take(this.values.controls.length),
          finalize(() => {
            // use the "real" array again to reflect adds & deletions
            this.renderValues = this.values;
            this.isLoadingValues = false;
          })
        )
        .subscribe((control: FormControl) => {
          this.renderValues.controls.push(control);
        });
    }
  }
}
