import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wy-createNewFileDialog',
  templateUrl: './createNewFileDialog.component.html',
  styleUrls: ['./createNewFileDialog.component.scss'],
})
export class CreateNewFileDialogComponent implements OnInit {
  typeOfDialog = '';

  ngOnInit() {
    this.typeOfDialog = this.data.typeOfDialog === 'file' ? 'createFileDialog' : 'createDirDialog';
  }

  constructor(public dialogRef: MatDialogRef<CreateNewFileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  cancel(): void {
    this.dialogRef.close();
  }
}
