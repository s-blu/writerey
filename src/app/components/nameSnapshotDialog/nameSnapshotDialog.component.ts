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
}
