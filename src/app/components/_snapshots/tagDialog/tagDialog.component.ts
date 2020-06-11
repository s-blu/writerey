// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wy-tagDialog',
  templateUrl: './tagDialog.component.html',
  styleUrls: ['./tagDialog.component.scss'],
})
export class TagDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<TagDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {}

  isTagNameValid() {
    console.log('isTagNameValid', this.data.tagName);
    if (!this.data.tagName || this.data.tagName === '') return true;
    return this.data.tagName.match(/(0-9A-Za-z:\/)/);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
