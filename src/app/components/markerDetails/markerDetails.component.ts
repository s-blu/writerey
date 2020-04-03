import { MarkerService } from 'src/app/services/marker.service';
import { Component, OnInit, Input } from '@angular/core';
import { MarkerDefinition, MarkerTypes } from 'src/app/interfaces/markerDefinition.class';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'wy-marker-details',
  templateUrl: './markerDetails.component.html',
  styleUrls: ['./markerDetails.component.scss']
})
export class MarkerDetailsComponent implements OnInit {
  @Input() markerDef: MarkerDefinition;

  editForm;
  types = MarkerTypes;
  values;

  constructor(private formBuilder: FormBuilder, private markerService: MarkerService) { }

  ngOnInit() {
    // TODO set these values when markerDef gets changed!
    this.editForm = this.formBuilder.group({
      type: '',
      name: this.markerDef.name,
      values: new FormArray([])
    });

    this.values = this.editForm.get('values') as FormArray;
    (this.markerDef?.values || []).forEach(val => {
      console.log('valuuuuueeee!', val)
      this.values.push(new FormGroup({
        name: new FormControl(val.name),
        id: new FormControl(val.id)
      }));
    });

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
    this.markerService.updateMarkerDefinition(this.markerDef).subscribe((res) => {
      // TODO show snackbar
      console.log('saved marker', res)
    })
  }
}
