import { TranslocoService } from '@ngneat/transloco';
import { SnapshotService } from './snapshot.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../components/deleteConfirmationDialog/deleteConfirmationDialog.component';
import { tap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeletionService {
  constructor(
    private dialog: MatDialog,
    private snapshotService: SnapshotService,
    private translocoService: TranslocoService
  ) {}

  showDeleteConfirmDialog(name: string, type: string) {
    const typeTranslation = this.translocoService.translate(`deletion.type.${type}`);
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: { name, type: typeTranslation },
    });

    return dialogRef.afterClosed().pipe(
      map(res => {
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
