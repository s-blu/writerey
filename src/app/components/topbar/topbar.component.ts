// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { NameSnapshotDialogComponent } from '@writerey/history/components/nameSnapshotDialog/nameSnapshotDialog.component';
import { TagDialogComponent } from '@writerey/history/components/tagDialog/tagDialog.component';
import { of, Subscription } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { SnapshotStore } from 'src/app/stores/snapshot.store';
import { SnapshotService } from '../../services/snapshot.service';
import { ExportService } from './../../services/export.service';
import { AboutDialogComponent } from './../aboutDialog/aboutDialog.component';
import { ExportDialogComponent } from './../exportDialog/exportDialog.component';

@Component({
  selector: 'wy-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  @Output() snapshotted = new EventEmitter<any>();

  private lastSnapshotDate: Date;
  private subscription = new Subscription();

  constructor(
    private snapshotService: SnapshotService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    public dialog: MatDialog,
    private snapshotStore: SnapshotStore,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.subscription.add(this.snapshotStore.snapshotDate$.subscribe(res => (this.lastSnapshotDate = res)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  snapshot() {
    const date = new Date();
    const commitMsg = this.translocoService.translate('git.message.manualCommit', { date: date.toLocaleString() });

    const dialogRef = this.dialog.open(NameSnapshotDialogComponent, {
      data: { msg: commitMsg },
      width: '500px',
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(msg => {
        if (!msg) return;
        this.snapshotService.createSnapshot(msg).subscribe((res: { status: number; text: string }) => {
          let snackBarMsg = '';
          if (res?.status === 0) {
            snackBarMsg = this.translocoService.translate('git.snackbar.manualCommit', { date: date.toLocaleString() });
          } else if (res?.status === -1) {
            snackBarMsg = this.translocoService.translate('git.snackbar.workingDirClean');
          } else {
            snackBarMsg = this.translocoService.translate('git.snackbar.unknownResponse');
            console.error('snapshot failed for some reason', res);
          }
          this.showSnackBar(snackBarMsg);
        });
        this.snapshotted.emit(date);
      })
    );
  }

  tag() {
    const displayDate = this.lastSnapshotDate?.toLocaleString();

    const dialogRef = this.dialog.open(TagDialogComponent, {
      data: { lastSnapshotDate: displayDate },
      width: '400px',
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(name => {
        if (!name) return;
        this.snapshotService.createTag(name).subscribe(
          () => {
            const snackBarMsg = this.translocoService.translate('git.snackbar.createTag', {
              date: displayDate,
              tag: name,
            });
            this.showSnackBar(snackBarMsg);
          },
          err => {
            console.error('creation of tag failed', err);
            const snackBarMsg = this.translocoService.translate('git.snackbar.error.createTag', { tag: name });
            this.showSnackBar(snackBarMsg, '', 5000);
          }
        );
      })
    );
  }

  showAboutDialog() {
    this.dialog.open(AboutDialogComponent, {
      width: '400px',
    });
  }

  export() {
    this.dialog
      .open(ExportDialogComponent, {
        width: '700px',
      })
      .afterClosed()
      .pipe(
        filter(res => !!res),
        switchMap(res => this.exportService.export(res)),
        catchError(err => {
          console.error('error occured on export', err);
          const snackBarMsg = this.translocoService.translate('export.error');
          this.showSnackBar(snackBarMsg, '', 10000);
          return of(null);
        })
      )
      .subscribe(res => {
        if (!res) return;
        const snackBarMsg = this.translocoService.translate('export.finished');
        this.showSnackBar(snackBarMsg, '', 10000);
      });
  }

  private showSnackBar(msg, action = '', duration = 2000) {
    this.snackBar.open(msg, action, {
      duration,
      horizontalPosition: 'right',
    });
  }
}
