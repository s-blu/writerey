// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { editorWyNotesModules, setDecoupledToolbar } from '@writerey/shared/utils/editor.utils';
import { delayValues } from '@writerey/shared/utils/observable.utils';
import { of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, mergeMap, take } from 'rxjs/operators';
import { LabelService } from 'src/app/services/label.service';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';
import * as uuid from 'uuid';
import { DeletionService } from '../../../services/deletion.service';
import { DocumentModeStore } from './../../../stores/documentMode.store';

const LABEL_AUTOSAVE_KEY = 'writerey_label_definition_autosave';

@Component({
  selector: 'wy-label-details',
  templateUrl: './labelDetails.component.html',
  styleUrls: ['./labelDetails.component.scss'],
})
export class LabelDetailsComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  labelDefinition: LabelDefinition;
  values: FormArray;
  renderValues = new FormArray([]);
  Editor = DecoupledEditor;
  editorConfig = editorWyNotesModules;
  onReady = setDecoupledToolbar;
  isLoadingValues = false;
  autosave = true;

  @ViewChild('tabGroup') tabGroup;

  private subscription = new Subscription();
  private template = ' \n';

  constructor(
    private formBuilder: FormBuilder,
    private labelService: LabelService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    private deletionService: DeletionService,
    private route: ActivatedRoute,
    private documentModeStore: DocumentModeStore
  ) {}

  ngOnInit() {
    this.documentModeStore.setMode(DOC_MODES.REVIEW);
    this.autosave = JSON.parse(localStorage.getItem(LABEL_AUTOSAVE_KEY)) ?? true;

    this.subscription.add(
      this.route.queryParams
        .pipe(mergeMap(params => this.labelService.getLabelDefinition(params.id)))
        .subscribe(labelDef => {
          if (this.labelDefinition) {
            this.saveOnLeave();
          }
          if (!labelDef) {
            this.labelDefinition = null;
            return;
          }

          this.template = labelDef.template || ' \n';
          this.labelDefinition = labelDef;
          this.initializeForm(labelDef);
        })
    );

    if (this.autosave) {
      const msg = this.translocoService.translate('labelDetails.autosave.activated');
      this.snackBar.open(msg, '', {
        duration: 4000,
        horizontalPosition: 'right',
      });
    }
  }

  ngOnDestroy() {
    this.saveOnLeave();
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

  toggleAutosave() {
    this.autosave = !this.autosave;
    localStorage.setItem(LABEL_AUTOSAVE_KEY, '' + this.autosave);
  }

  saveOnLeave() {
    if (this.editForm?.dirty && this.autosave) {
      this.subscription.add(this.save().subscribe());
    }
  }

  onSubmit() {
    this.subscription.add(
      this.save().subscribe(res => {
        const msg = this.translocoService.translate('labelDetails.saved');
        this.snackBar.open(msg, '', {
          duration: 2000,
          horizontalPosition: 'right',
        });
        this.labelDefinition = res;
      })
    );
  }

  private save() {
    if (!this.editForm?.value) return of(null);

    const labelDefChanges = Object.assign({}, this.editForm.value);
    labelDefChanges.values.forEach(value => {
      if (value.info === this.template || value.info?.trim() === '') {
        delete value.info;
      }
    });

    return this.labelService.updateLabelDefinition(labelDefChanges);
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
    // if the user switches from another label definition and has the values already open, we need to trigger that explicitly
    if (this.tabGroup?.selectedIndex === 1) {
      this.initRenderValues({ index: 1 });
    }
    // autosave on pause
    if (this.autosave) {
      this.subscription.add(
        this.editForm.valueChanges.pipe(distinctUntilChanged(), debounceTime(4000)).subscribe(res => {
          this.subscription.add(this.save().subscribe());
        })
      );
    }
  }

  /**
   * Push values of form into the array that should be rendered in a delayed matter.
   * This prevents the view from freezing (even though it still lags) on huge amount of values.
   */
  initRenderValues(ev) {
    if (ev.index === 1 && this.renderValues.controls.length === 0) {
      // Delayed handling is not needed if its only a few values
      if (this.values.controls.length < 8) {
        this.renderValues = this.values;
        return;
      }

      this.isLoadingValues = true;
      this.subscription.add(
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
          })
      );
    }
  }
}
