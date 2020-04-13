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

  constructor(public dialogRef: MatDialogRef<CreateNewFileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.filename);
  }
}
