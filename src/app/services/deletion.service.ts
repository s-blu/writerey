// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { TranslocoService } from '@ngneat/transloco';
import { SnapshotService } from './snapshot.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../components/deleteConfirmationDialog/deleteConfirmationDialog.component';
import { map, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeletionService {
  constructor(
    private dialog: MatDialog,
    private snapshotService: SnapshotService,
    private translocoService: TranslocoService
  ) {}

  handleDeleteUserInputAndSnapshot(name: string, type: string) {
    const typeTranslation = this.translocoService.translate(`deletion.type.${type}`);
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: { name, type: typeTranslation },
    });

    return dialogRef.afterClosed().pipe(
      flatMap(res => {
        if (res) {
          const snapshotMsg = this.translocoService.translate('deletion.snapshot', { name, type: typeTranslation });
          return this.snapshotService.createSnapshot(snapshotMsg);
        } else {
          return res;
        }
      }),
      map(res => {
        return !!res;
      })
    );
  }
}
