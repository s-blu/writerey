import { TranslocoService } from '@ngneat/transloco';
import { SnapshotStore } from './../stores/snapshot.store';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, take } from 'rxjs/operators';

import { ApiService } from './api.service';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnapshotService {
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

    return this.httpClient
      .put(this.api.getGitRoute(), formdata, { headers: httpHeaders })
      .pipe(catchError(err => this.api.handleHttpError(err)));
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

    // fixme set interval to 15 - 30 minutes
    interval(1000 * 60 * 2).subscribe(() => {
      console.log('creating automated snapshot...');
      const msg = this.transloco.translate('git.message.automateCommit', { date: new Date().toISOString() });
      this.createSnapshot(msg)
        .pipe(take(1))
        .subscribe(() => console.log('successfully created automated snapshot'));
    });
  }
}
