// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  serverAdress = 'http://localhost:5002';

  constructor() {}

  getServerReadyRoute() {
    return `${this.serverAdress}/ping`;
  }

  getDocumentRoute(docName) {
    return docName ? `${this.serverAdress}/doc/${docName}` : `${this.serverAdress}/doc`;
  }

  getParagraphRoute(docName) {
    return docName ? `${this.serverAdress}/p/${docName}` : `${this.serverAdress}/p`;
  }

  getDirectoryRoute(dirName?: string) {
    return dirName ? `${this.serverAdress}/dir/${dirName}` : `${this.serverAdress}/dir`;
  }

  getTreeRoute() {
    return `${this.serverAdress}/tree`;
  }

  getLinkRoute(project) {
    return `${this.serverAdress}/links${project ? '/' + project : ''}`;
  }

  getGitCommitRoute() {
    return `${this.serverAdress}/git/commit`;
  }

  getGitMoveRoute() {
    return `${this.serverAdress}/git/mv`;
  }

  getTagRoute() {
    return `${this.serverAdress}/git/tag`;
  }

  getLabelRoute(labelId = 'definitions') {
    return `${this.serverAdress}/label/${labelId}`;
  }

  getImagetRoute(docName) {
    return docName ? `${this.serverAdress}/img/${docName}` : `${this.serverAdress}/img`;
  }

  handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', JSON.stringify(error));
    } else {
      console.error(`Backend returned code ${error.status}`, JSON.stringify(error));
    }
    return throwError('Backend said no.');
  }
}
