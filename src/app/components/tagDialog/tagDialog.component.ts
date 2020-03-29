import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wy-tagDialog',
  templateUrl: './tagDialog.component.html',
  styleUrls: ['./tagDialog.component.scss']
})
export class TagDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TagDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  isTagNameValid() {
    console.log('isTagNameValid', this.data.tagName)
    if (!this.data.tagName || this.data.tagName === '') return true;
    return this.data.tagName.match(/(0-9A-Za-z:\/)/);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
