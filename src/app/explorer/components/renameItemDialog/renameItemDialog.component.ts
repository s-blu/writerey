// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wy-renameItemDialog',
  templateUrl: './renameItemDialog.component.html',
  styleUrls: ['./renameItemDialog.component.scss'],
})
export class RenameItemDialogComponent implements OnInit {
  ngOnInit() {
    this.data.newName = this.data.oldName;
  }

  constructor(public dialogRef: MatDialogRef<RenameItemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.newName);
  }
}
