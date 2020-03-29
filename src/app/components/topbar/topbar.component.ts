import { SnapshotService } from './../../services/snapshot.service';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'wy-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  @Output() snapshotted = new EventEmitter<any>();

  constructor(
    private snapshotService: SnapshotService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService
  ) { }

  ngOnInit() { }

  review() { }

  snapshot() {
    // TODO use translated message
    const date = new Date();
    const commitMsg = this.translocoService.translate('git.message.manualCommit', { date: date.toLocaleString() });
    const snackBarMsg = this.translocoService.translate('git.snackbar.manualCommit', { date: date.toLocaleString() });
    this.snapshotService.createSnapshot(commitMsg).subscribe((res) => {
      this.snackBar.open(snackBarMsg, '', {
        duration: 2000,
        horizontalPosition: 'right'
      });
    });
    this.snapshotted.emit(date);
  }
}
