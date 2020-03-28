import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParagraphService {
  public UUID_V4_REGEX_STR = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  private P_ID_REGEX = RegExp(`<p class="${this.UUID_V4_REGEX_STR}">`);
  private PARAGRAPH_DELIMITER_WO_OPENING = `&nbsp;</p>`;
  private PARAGRAPH_DELIMITER = `<p>${this.PARAGRAPH_DELIMITER_WO_OPENING}`;
  private PARAGRAPH_DELIMITER_REGEX = RegExp(
    `<p(?: class="${this.UUID_V4_REGEX_STR}")?>` + this.PARAGRAPH_DELIMITER_WO_OPENING
  );

  paragraphMetaCache = {};

  constructor(private api: ApiService, private httpClient: HttpClient) {}

  enhanceDocumentWithParagraphIds(document: string) {
    let enhancedDocument = '';
    let previousUuid = '';
    let currentUuidBeforeEnhance = '';
    const paragraphs = document.split(this.PARAGRAPH_DELIMITER_REGEX);
    console.log('paragraphs', paragraphs);
    paragraphs.forEach((p, i) => {
      if (p === '') return;
      const prefix = i > 0 ? this.PARAGRAPH_DELIMITER + '\n' : '';
      currentUuidBeforeEnhance = this._extractUuid(p);
      p = this.upsertParagraphIdentifierIfNecessary(p, previousUuid);
      previousUuid = currentUuidBeforeEnhance;
      enhancedDocument += `${prefix}${p}\n`;
    });

    return enhancedDocument;
  }

  upsertParagraphIdentifierIfNecessary(p, previousUuid) {
    if (!p || p === '') return p;

    const currentUuid = this._extractUuid(p);

    if (_uuidsAreEqual(previousUuid, currentUuid) || !this.P_ID_REGEX.test(p)) {
      const pTagWithId = this._getParagraphTagWithIdentifier(uuid.v4());
      const enhancedP = p.replace(
        RegExp(`<p( class="${this.UUID_V4_REGEX_STR}")?>(?!${this.PARAGRAPH_DELIMITER_WO_OPENING})`, 'g'),
        pTagWithId
      );
      return enhancedP;
    }

    return p;

    function _uuidsAreEqual(prev, curr) {
      if (prev === '' || curr === '') return false;
      return prev === curr;
    }
  }

  setParagraphMeta(docPath, docName, paragraphId, metaType, metaContent) {
    const formdata = new FormData();
    formdata.append('doc_path', docPath);
    formdata.append('p_id', paragraphId);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    // FIXME rewrite this to a piped call
    return new Observable(subscriber => {
      this.getParagraphMeta(docPath, docName, paragraphId, metaType).subscribe(res => {
        const paragraphMeta = res || {};
        paragraphMeta[metaType] = metaContent;
        formdata.append('content', JSON.stringify(paragraphMeta));

        this.httpClient
          .put(this.api.getParagraphRoute(docName), formdata, { headers: httpHeaders })
          .pipe(catchError(err => this.api.handleHttpError(err)))
          .subscribe((putRes: string) => {
            try {
              putRes = JSON.parse(putRes);
              this.setCacheItem(docPath, docName, paragraphId, putRes);
            } finally {
              subscriber.next(putRes);
              subscriber.complete();
            }
          });
      });
    });
  }

  getParagraphMeta(docPath, docName, paragraphId, metaType?): Observable<any> {
    const cachedMeta = this.getCacheItem(docPath, docName, paragraphId);
    if (cachedMeta) {
      return metaType ? of(cachedMeta[metaType]) : of(cachedMeta);
    }
    const params = {
      doc_path: docPath,
      p_id: paragraphId,
    };

    return this.httpClient.get(this.api.getParagraphRoute(docName), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        if (!res || res === '') return res;
        try {
          const data = JSON.parse(res);
          this.setCacheItem(docPath, docName, paragraphId, data);
          return metaType ? data[metaType] : data;
        } catch {
          console.warn('Was not able to parse paragraph meta. Returning result as-is.');
          return res;
        }
      })
    );
  }

  private _getParagraphTagWithIdentifier(id: string) {
    return `<p class="${id}">`;
  }

  private _extractUuid(p) {
    let pUuid = '';
    let uuidExec;
    if (p && p !== '') {
      uuidExec = RegExp(this.UUID_V4_REGEX_STR).exec(p);
      if (uuidExec) pUuid = uuidExec[0];
      console.log('uuid exec', pUuid);
    }
    return pUuid;
  }

  // TODO do this in an own service
  private getCacheItem(path, name, paragraphId) {
    return this.paragraphMetaCache[this._getCacheItemKey(path, name, paragraphId)];
  }

  private setCacheItem(path, name, paragraphId, content) {
    this.paragraphMetaCache[this._getCacheItemKey(path, name, paragraphId)] = content;
  }

  private _getCacheItemKey(path, name, paragraphId) {
    const sanitizedPath = path.replace(/[\/\\]/g, '_');
    return `${sanitizedPath}__${name}__${paragraphId}`;
  }
}
