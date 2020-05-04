import { DeletionService } from '../../../services/deletion.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelService } from 'src/app/services/label.service';
import { Component, OnInit, Input } from '@angular/core';
import { LabelDefinition, LabelTypes } from 'src/app/models/labelDefinition.class';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import * as uuid from 'uuid';

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
    this.deletionService.showDeleteConfirmDialog(value.name, 'labelValue').subscribe(res => {
      if (!res) return;
      this.values.removeAt(index);
    });
  }

  cancel() {
    // reset form to last saved state
  }

  onSubmit(newValues) {
    // TODO take over new values to obj
    this.labelService.updateLabelDefinition(newValues).subscribe(res => {
      const msg = this.translocoService.translate('labelDetails.saved');
      this.snackBar.open(msg, '', {
        duration: 2000,
        horizontalPosition: 'right',
      });
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
    });

    if (labelDef.type === LabelTypes.TEXT) {
      this.values = this.editForm.get('values') as FormArray;
      (labelDef.values || []).forEach(val => {
        this.values.push(
          new FormGroup({
            name: new FormControl(val.name),
            id: new FormControl(val.id),
          })
        );
      });
    } else if (labelDef.type === LabelTypes.NUMERIC) {
      this.editForm.addControl('start', new FormControl(labelDef.start || 1, Validators.required));
      this.editForm.addControl('end', new FormControl(labelDef.end || 10, Validators.required));
      this.editForm.addControl('interval', new FormControl(labelDef.interval || 1, Validators.required));
    } else {
      console.error('Could not determine type of labelDefinition, cannot render edit form', labelDef);
    }
  }
}
