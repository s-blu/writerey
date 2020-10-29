// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wy-nameSnapshotDialog',
  templateUrl: './nameSnapshotDialog.component.html',
  styleUrls: ['./nameSnapshotDialog.component.scss'],
})
export class NameSnapshotDialogComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialogRef: MatDialogRef<NameSnapshotDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.msg);
  }
}
