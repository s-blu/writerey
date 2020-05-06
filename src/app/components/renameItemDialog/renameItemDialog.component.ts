import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wy-renameItemDialog',
  templateUrl: './renameItemDialog.component.html',
  styleUrls: ['./renameItemDialog.component.scss'],
})
export class RenameItemDialogComponent implements OnInit {
  ngOnInit() {
  }

  constructor(public dialogRef: MatDialogRef<RenameItemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.newName);
  }
}
