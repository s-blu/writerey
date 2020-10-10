import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { version, repository, license, homepage } from '../../../../package.json';

@Component({
  selector: 'wy-about-dialog',
  templateUrl: './aboutDialog.component.html',
  styleUrls: ['./aboutDialog.component.scss'],
})
export class AboutDialogComponent {
  version = version;
  license = license;
  homepage = homepage;
  repositoryLink = repository.url;
  documentationLink = homepage;

  constructor(public dialogRef: MatDialogRef<AboutDialogComponent>) {}

  close(): void {
    this.dialogRef.close(null);
  }
}
