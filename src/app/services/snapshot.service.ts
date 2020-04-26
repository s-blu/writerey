import { TranslocoService } from '@ngneat/transloco';
import { SnapshotStore } from './../stores/snapshot.store';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, take } from 'rxjs/operators';

import { ApiService } from './api.service';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SnapshotService implements OnDestroy {
  automatedCommitSubscription;

  constructor(
    private httpClient: HttpClient,
    private api: ApiService,
    private snapshotStore: SnapshotStore,
    private transloco: TranslocoService
  ) {}

  createSnapshot(msg) {
    const formdata = new FormData();
    formdata.append('message', msg);
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient.put(this.api.getGitRoute(), formdata, { headers: httpHeaders }).pipe(
      tap((res: any) => {
        if (res?.commitDate) {
          this.snapshotStore.setLastSnapshotDate(res.commitDate);
        }
      }),
      catchError(err => this.api.handleHttpError(err))
    );
  }

  createTag(tagname) {
    const formdata = new FormData();
    formdata.append('tagname', tagname);
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient
      .put(this.api.getTagRoute(), formdata, { headers: httpHeaders })
      .pipe(catchError(err => this.api.handleHttpError(err)));
  }

  getSnapshotInfo() {
    return this.httpClient.get(this.api.getGitRoute()).pipe(
      catchError(err => this.api.handleHttpError(err)),
      tap((res: any) => {
        if (!res) return;
        if (res.lastCommitDate) this.snapshotStore.setLastSnapshotDate(res.lastCommitDate);
        if (res.lastTagDate) this.snapshotStore.setLastTagDate(res.lastTagDate);
        if (res.lastTagName) this.snapshotStore.setLastTagName(res.lastTagName);
      })
    );
  }

  init() {
    this.getSnapshotInfo().pipe(take(1)).subscribe();

    if (!environment.production) {
      // don't create the automated commit on development mode to not mess up VCS
      console.warn('App is running in development mode, so no automated commit hook will be created.');
      return;
    }
    this.automatedCommitSubscription = interval(1000 * 60 * 30).subscribe(() => {
      const date = new Date().toISOString();
      const msg = this.transloco.translate('git.message.automateCommit', { date });
      this.createSnapshot(msg)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res?.status === -1) {
            console.log('Skipped automated commit since working dir is clean.', date);
          } else {
            console.log('successfully created automated snapshot', date);
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.automatedCommitSubscription) this.automatedCommitSubscription.unsubscribe();
  }
}
