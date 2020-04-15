import { DocumentModeStore } from './../../stores/documentMode.store';
import { NameSnapshotDialogComponent } from './../nameSnapshotDialog/nameSnapshotDialog.component';
import { DOC_MODES } from '../../models/docModes.enum';
import { TagDialogComponent } from './../tagDialog/tagDialog.component';
import { Subscription } from 'rxjs';
import { SnapshotService } from './../../services/snapshot.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'wy-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  @Input() lastSnapshotDate: Date;

  @Output() snapshotted = new EventEmitter<any>();

  private subscription = new Subscription();


  constructor(
    private snapshotService: SnapshotService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    public dialog: MatDialog,
    private documentModeStore: DocumentModeStore
  ) {}

  ngOnInit() {
    
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
    const displayDate = this.lastSnapshotDate.toLocaleString();

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

  private showSnackBar(msg, action = '', duration = 2000) {
    this.snackBar.open(msg, action, {
      duration,
      horizontalPosition: 'right',
    });
  }


}
