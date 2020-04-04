import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SnapshotService {
  constructor(private httpClient: HttpClient, private api: ApiService) {}

  createSnapshot(msg) {
    const formdata = new FormData();
    formdata.append('message', msg);
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient.put(this.api.getGitRoute(), formdata, { headers: httpHeaders }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      tap(r => console.log('made snapshot', Date.now()))
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
    return this.httpClient.get(this.api.getGitRoute()).pipe(catchError(err => this.api.handleHttpError(err)));
  }
}
