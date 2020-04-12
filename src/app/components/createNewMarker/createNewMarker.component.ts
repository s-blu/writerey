import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MarkerTypes } from 'src/app/models/markerDefinition.class';

@Component({
  selector: 'wy-createNewMarker',
  templateUrl: './createNewMarker.component.html',
  styleUrls: ['./createNewMarker.component.scss'],
})
export class CreateNewMarkerComponent implements OnInit {
  createNewForm;

  constructor(public dialogRef: MatDialogRef<CreateNewMarkerComponent>, private formBuilder: FormBuilder) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.createNewForm = this.formBuilder.group({
      type: '',
      name: '',
    });
  }

  onSubmit(data) {
    if (this.createNewForm.invalid) return;
    this.dialogRef.close(data);
  }
}
