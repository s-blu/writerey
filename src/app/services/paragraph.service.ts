import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParagraphService {
  private UUID_V4_REGEX_STR = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  private P_ID_REGEX = RegExp(`<div class="${this.UUID_V4_REGEX_STR}`);

  constructor(
    private api: ApiService,
    private httpClient: HttpClient
  ) { }

  addParagraphIdentifierIfMissing(p) {
    if (p && p !== '' && !this.P_ID_REGEX.test(p)) {
      const id = uuid.v4();

      console.log('=========================');
      console.log('paragraph has no identifier, adding', p);
      return `${this.getParagraphWrapStart(id)}${p}${this.getParagraphWrapEnd()} `;
    }

    return p;
  }

  setParagraphMeta(docPath, docName, paragraphId, meta) {
    const formdata = new FormData();
    formdata.append('doc_path', docPath);
    formdata.append('p_id', paragraphId);
    formdata.append('content', meta);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    this.httpClient.put(this.api.getParagraphRoute(docName), formdata, { headers: httpHeaders })
      .pipe(catchError((err) => this.api.handleHttpError(err)))
      .subscribe((res) => console.log('setParagraphMeta', res));
  }

  getParagraphMeta(docPath, docName, paragraphId): Observable<any> {
    return this.httpClient.get(this.api.getParagraphRoute(docName) + `?doc_path=${docPath}&p_id=${paragraphId}`)
      .pipe(catchError((err) => this.api.handleHttpError(err)));
  }

  private getParagraphWrapStart(uuid) {
    return `<div class="${uuid} paragraph-wrap">`;
  }

  private getParagraphWrapEnd() {
    return `</div>`;
  }



}
