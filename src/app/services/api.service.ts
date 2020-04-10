import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  serverAdress = 'http://localhost:5002';

  constructor() {}

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

  getGitRoute() {
    return `${this.serverAdress}/git/commit`;
  }

  getTagRoute() {
    return `${this.serverAdress}/git/tag`;
  }

  getMarkerRoute(markerId = 'definitions') {
    return `${this.serverAdress}/marker/${markerId}`;
  }

  handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', JSON.stringify(error));
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}`, JSON.stringify(error));
    }
    // return an observable with a user-facing error message
    return throwError('Backend said no.');
  }
}
