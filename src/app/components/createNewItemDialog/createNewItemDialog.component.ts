// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wy-createNewFileDialog',
  templateUrl: './createNewItemDialog.component.html',
  styleUrls: ['./createNewItemDialog.component.scss'],
})
export class CreateNewItemDialogComponent implements OnInit {
  typeOfDialog = '';

  ngOnInit() {
    switch (this.data.typeOfDialog) {
      case 'file':
        this.typeOfDialog = 'createFileDialog';
        break;
      case 'dir':
        this.typeOfDialog = 'createDirDialog';
        break;
      case 'project':
        this.typeOfDialog = 'createProjectDialog';
        break;
      default:
        this.typeOfDialog = 'createUnkownDialog';
        break;
    }
  }

  constructor(public dialogRef: MatDialogRef<CreateNewItemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.filename);
  }
}
