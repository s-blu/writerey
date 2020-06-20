import { OnChangeErrorMatcher } from './../../../utils/form.utils';
// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { NameSafetyValidator } from 'src/app/directives/nameSafetyValidator';

@Component({
  selector: 'wy-tagDialog',
  templateUrl: './tagDialog.component.html',
  styleUrls: ['./tagDialog.component.scss'],
})
export class TagDialogComponent implements OnInit {

  form; 
  matcher = new OnChangeErrorMatcher();
  
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<TagDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [NameSafetyValidator('tag')]),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(values) {
    if (this.form.invalid) return;
    this.dialogRef.close(values.name);
  }
}
