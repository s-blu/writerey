import { DOC_MODES } from './../../interfaces/docModes.enum';
import { TagDialogComponent } from './../tagDialog/tagDialog.component';
import { Subscription } from 'rxjs';
import { SnapshotService } from './../../services/snapshot.service';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  @Input() mode: DOC_MODES;

  @Output() snapshotted = new EventEmitter<any>();
  @Output() switchMode = new EventEmitter<any>();

  private subscription = new Subscription();

  constructor(
    private snapshotService: SnapshotService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { }

  review() {
    this.switchMode.emit(DOC_MODES.REVIEW);
  }

  read() {
    this.switchMode.emit(DOC_MODES.READ);
  }

  write() {
    this.switchMode.emit(DOC_MODES.WRITE);
  }

  isActive(mode) {
    return { active: this.mode === mode };
  }

  snapshot() {
    const date = new Date();
    const commitMsg = this.translocoService.translate('git.message.manualCommit', { date: date.toLocaleString() });
    const snackBarMsg = this.translocoService.translate('git.snackbar.manualCommit', { date: date.toLocaleString() });
    this.snapshotService.createSnapshot(commitMsg).subscribe((res) => {
      this.showSnackBar(snackBarMsg);
    });
    this.snapshotted.emit(date);
  }

  tag() {
    const displayDate = this.lastSnapshotDate.toLocaleString();

    const dialogRef = this.dialog.open(TagDialogComponent, {
      data: { lastSnapshotDate: displayDate },
      width: '400px'
    });

    this.subscription.add(dialogRef.afterClosed().subscribe(name => {
      if (!name) return;
      this.snapshotService.createTag(name).subscribe(() => {
        const snackBarMsg = this.translocoService.translate('git.snackbar.createTag', { date: displayDate, tag: name });
        this.showSnackBar(snackBarMsg);
      }, (err) => {
        console.error('creation of tag failed', err)
        const snackBarMsg = this.translocoService.translate('git.snackbar.error.createTag', { tag: name });
        this.showSnackBar(snackBarMsg, '', 5000);
      });
    }));
  }

  private showSnackBar(msg, action = '', duration = 2000) {
    this.snackBar.open(msg, action, {
      duration,
      horizontalPosition: 'right'
    });
  }
}
