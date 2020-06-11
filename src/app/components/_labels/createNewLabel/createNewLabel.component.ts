// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wy-createNewLabel',
  templateUrl: './createNewLabel.component.html',
  styleUrls: ['./createNewLabel.component.scss'],
})
export class CreateNewLabelComponent implements OnInit {
  createNewForm;

  constructor(public dialogRef: MatDialogRef<CreateNewLabelComponent>, private formBuilder: FormBuilder) {}

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
