// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { editorWyNotesModules, setDecoupledToolbar } from 'src/app/shared/utils/editor.utils';
import { DeletionService } from '../../../services/deletion.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelService } from 'src/app/services/label.service';
import { Component, OnInit, Input } from '@angular/core';
import { LabelDefinition, LabelTypes } from 'src/app/shared/models/labelDefinition.class';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import * as uuid from 'uuid';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

@Component({
  selector: 'wy-label-details',
  templateUrl: './labelDetails.component.html',
  styleUrls: ['./labelDetails.component.scss'],
})
export class LabelDetailsComponent implements OnInit {
  @Input() set labelDef(md: LabelDefinition) {
    this.initializeForm(md);
    this.labelDefinition = md;
  }

  editForm;
  labelDefinition: LabelDefinition;
  types = LabelTypes;
  values;
  Editor = DecoupledEditor;
  editorConfig = editorWyNotesModules;
  onReady = setDecoupledToolbar;

  constructor(
    private formBuilder: FormBuilder,
    private labelService: LabelService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    private deletionService: DeletionService
  ) {}

  ngOnInit() {}

  addNewValue() {
    this.values.insert(
      this.values.length,
      new FormGroup({
        name: new FormControl(''),
        id: new FormControl(uuid.v4()),
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
    if (
      this.labelDefinition.type === LabelTypes.NUMERIC &&
      (this.labelDefinition.start !== newValues.start ||
        this.labelDefinition.end !== newValues.end ||
        this.labelDefinition.interval !== newValues.interval)
    ) {
      const newNumValues = [];
      for (let i = newValues.start; i <= newValues.end; i += newValues.interval) {
        newNumValues.push(i);
      }
      const newLabelValues = this.labelDefinition.values.filter(v => newNumValues.includes(v.name));
      if (newLabelValues.length < this.labelDefinition.values.length) {
        // todo show a user facing warning with the possibility to abort
        console.warn(
          `Changing start/end/interval of ${this.labelDefinition.name} led` +
            ` to removal of ${this.labelDefinition.values.length - newLabelValues.length} values.`
        );
      }
      for (const newValName of newNumValues) {
        let val = newLabelValues.find(v => '' + v.name === '' + newValName);
        if (!val) {
          val = {
            id: uuid.v4(),
            name: newValName,
          };
          newLabelValues.push(val);
        }
      }
      newLabelValues.sort((a, b) => ('' + a.name).localeCompare('' + b.name));
      newValues.values = newLabelValues;
    }
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
      template: labelDef.template || ' \n',
    });

    this.values = this.editForm.get('values') as FormArray;
    (labelDef.values || []).forEach(val => {
      this.values.push(
        new FormGroup({
          name: new FormControl(val.name),
          id: new FormControl(val.id),
        })
      );
    });
    if (labelDef.type === LabelTypes.NUMERIC) {
      this.editForm.addControl('start', new FormControl(labelDef.start || 1, Validators.required));
      this.editForm.addControl('end', new FormControl(labelDef.end || 1, Validators.required));
      this.editForm.addControl('interval', new FormControl(labelDef.interval || 1, Validators.required));
    }
  }
}
