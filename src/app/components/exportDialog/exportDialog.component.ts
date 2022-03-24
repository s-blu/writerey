import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exportDialog',
  templateUrl: './exportDialog.component.html',
  styleUrls: ['./exportDialog.component.scss'],
})
export class ExportDialogComponent implements OnInit {
  filetype = '.txt';

  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>) {}

  ngOnInit() {}

  cancel() {
    this.dialogRef.close();
  }

  export() {
    this.dialogRef.close(this.filetype);
  }
}
