/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { homepage, license, repository, version } from '../../../../package.json';

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
  documentationLink = 'https://s-blu.github.io/writerey';

  constructor(public dialogRef: MatDialogRef<AboutDialogComponent>) {}

  close(): void {
    this.dialogRef.close(null);
  }
}
