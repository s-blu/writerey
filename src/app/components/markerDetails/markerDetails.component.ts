import { MarkerService } from 'src/app/services/marker.service';
import { Component, OnInit, Input } from '@angular/core';
import { MarkerDefinition, MarkerTypes } from 'src/app/models/markerDefinition.class';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'wy-marker-details',
  templateUrl: './markerDetails.component.html',
  styleUrls: ['./markerDetails.component.scss']
})
export class MarkerDetailsComponent implements OnInit {
  @Input() set markerDef(md: MarkerDefinition) {
    this.initializeForm(md);
    this.markerType = md.type;
  };

  editForm;
  markerType: MarkerTypes;
  types = MarkerTypes;
  values;

  constructor(private formBuilder: FormBuilder, private markerService: MarkerService) { }

  ngOnInit() {
  }

  addNewValue() {
    this.values.insert(this.values.length, new FormGroup({
      name: new FormControl(''),
      id: new FormControl(uuid.v4())
    }));
  }

  removeValue(index: number) {
    // TODO show a confirm plz
    this.values.removeAt(index);
  }

  cancel() {
    // reset form to last saved state
  }

  onSubmit(newValues) {
    // TODO take over new values to obj
    console.log('onSubmit', newValues)
    this.markerService.updateMarkerDefinition(newValues).subscribe((res) => {
      // TODO show snackbar
      console.log('saved marker', res)
    })
  }

  private initializeForm(markerDef) {
    if (!markerDef) {
      console.warn('got no marker definition, cannot initialize form');
      return;
    }

    this.editForm = this.formBuilder.group({
      id: markerDef.id,
      type: markerDef.type,
      name: markerDef.name,
      values: new FormArray([])
    });

    if (markerDef.type === MarkerTypes.TEXT) {
      this.values = this.editForm.get('values') as FormArray;
      (markerDef.values || []).forEach(val => {
        console.log('valuuuuueeee!', val)
        this.values.push(new FormGroup({
          name: new FormControl(val.name),
          id: new FormControl(val.id)
        }));
      });
    } else if (markerDef.type === MarkerTypes.NUMERIC) {
      this.editForm.addControl('start', new FormControl(markerDef.start || 1, Validators.required));
      this.editForm.addControl('end', new FormControl(markerDef.end || 10, Validators.required));
      this.editForm.addControl('interval', new FormControl(markerDef.interval || 1, Validators.required));
    } else {
      console.error('Could not determine type of markerDefinition, cannot render edit form', markerDef)
    }
  }
}
