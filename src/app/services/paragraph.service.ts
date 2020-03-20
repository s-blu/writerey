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
  public UUID_V4_REGEX_STR = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  private P_ID_REGEX = RegExp(`<p class="${this.UUID_V4_REGEX_STR}">`);
  private PARAGRAPH_DELIMITER = `<p>&nbsp;</p>`;
  private PARAGRAPH_DELIMITER_REGEX = RegExp(this.PARAGRAPH_DELIMITER);

  constructor(
    private api: ApiService,
    private httpClient: HttpClient
  ) { }

  enhanceDocumentWithParagraphIds(document: string) {
    let enhancedDocument = '';
    const paragraphs = document.split(this.PARAGRAPH_DELIMITER_REGEX);

    paragraphs.forEach((p, i) => {
      if (p === '') return;
      const prefix = i > 0 ? this.PARAGRAPH_DELIMITER + '\n' : '';
      p = this.addParagraphIdentifierIfMissing(p);
      enhancedDocument += `${prefix}${p}\n`;
    });

    return enhancedDocument;
  }

  addParagraphIdentifierIfMissing(p) {
    if (p && p !== '' && !this.P_ID_REGEX.test(p)) {
      const pTagWithId = this.getParagraphTagWithIdentifier(uuid.v4());
      const pDelimiterWoOpeningTag = this.PARAGRAPH_DELIMITER.replace('<p>', '');
      const enhancedP = p.replace(RegExp(`<p>(?!${pDelimiterWoOpeningTag})`, 'g'), pTagWithId);

      return enhancedP;
    }

    return p;
  }

  setParagraphMeta(docPath, docName, paragraphId, meta) {
    const formdata = new FormData();
    formdata.append('doc_path', docPath);
    formdata.append('p_id', paragraphId);
    formdata.append('content', JSON.stringify(meta));

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

  private getParagraphTagWithIdentifier(uuid: string) {
    return `<p class="${uuid}">`;
  }
}
