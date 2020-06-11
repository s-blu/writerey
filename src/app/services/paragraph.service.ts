// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FileInfo } from './../models/fileInfo.interface';
import { TranslocoService } from '@ngneat/transloco';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map, flatMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParagraphService {
  public UUID_V4_REGEX_STR = 'p[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  private P_ID_REGEX = RegExp(`<p class="${this.UUID_V4_REGEX_STR}">`);
  private PARAGRAPH_DELIMITER = `<p><br></p>`;
  private PARAGRAPH_DELIMITER_REGEX = RegExp(this.getParagraphBreakRegExString());

  private paragraphMetaCache = {};

  constructor(private api: ApiService, private httpClient: HttpClient) {}

  enhanceDocumentWithParagraphIds(document: string, path: string, name: string) {
    if (!document) return;
    let enhancedDocument = '';
    let previousUuid = '';
    let currentUuidBeforeEnhance = '';
    const paragraphs = document.split(this.PARAGRAPH_DELIMITER_REGEX);
    paragraphs.forEach((p, i) => {
      if (p === '') return;
      const prefix = i > 0 ? this.PARAGRAPH_DELIMITER + '\n' : '';
      currentUuidBeforeEnhance = this._extractUuid(p);
      p = this.upsertParagraphIdentifierIfNecessary(p, previousUuid, path, name);
      previousUuid = currentUuidBeforeEnhance;
      enhancedDocument += `${prefix}${p}\n`;
    });
    return enhancedDocument;
  }

  upsertParagraphIdentifierIfNecessary(p: string, previousUuid: string, path: string, name: string) {
    if (!p || p === '') return p;

    const currentUuid = this._extractUuid(p);
    const equalUuids = _uuidsAreEqual(previousUuid, currentUuid);
    if (equalUuids || !this.P_ID_REGEX.test(p)) {
      const newUuid = 'p' + uuid.v4(); // needs to start with a character to be useable as a css class
      const pTagWithId = this._getParagraphTagWithIdentifier(newUuid);
      const regex = RegExp(this.getParagraphBreakRegExString(true, false), 'g');
      const enhancedP = p.replace(regex, pTagWithId);
      if (equalUuids) {
        this.inheritLabelsFromPreviousParagraph(newUuid, previousUuid, path, name);
      }
      return enhancedP;
    }

    return p;

    function _uuidsAreEqual(prev, curr) {
      if (prev === '' || curr === '') return false;
      return prev === curr;
    }
  }

  setParagraphMeta(docPath, docName, context, metaType, metaContent, project?) {
    if (!docPath || !docName || !context || !metaContent) {
      console.error('setParagraphMeta was called with invalid data. Aborting.');
      return;
    }

    const formdata = new FormData();
    formdata.append('doc_path', docPath);
    formdata.append('context', context);
    if (project) formdata.append('project', project);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.getParagraphMeta(docPath, docName, context).pipe(
      catchError(err => this.api.handleHttpError(err)),
      flatMap(getRes => {
        const paragraphMeta = getRes || {};
        paragraphMeta[metaType] = metaContent;

        const blob = new Blob([JSON.stringify(paragraphMeta)], { type: 'application/json' });
        const file = new File([blob], name, { type: 'application/json' });
        formdata.append('file', file);

        return this.httpClient.put(this.api.getParagraphRoute(docName), formdata, { headers: httpHeaders });
      }),
      map((putRes: string) => {
        return this.parseAndExtractParagraphMetaResponse(putRes, docPath, docName, context, metaType);
      })
    );
  }

  getParagraphMeta(docPath, docName, context, metaType?): Observable<any> {
    if (!docPath || !docName || !context) {
      return of(null);
    }

    const cachedMeta = this.getCacheItem(docPath, docName, context);
    if (cachedMeta && (!metaType || cachedMeta[metaType])) {
      return metaType ? of(cachedMeta[metaType]) : of(cachedMeta);
    }
    const params = {
      doc_path: docPath,
      context,
    };

    return this.httpClient.get(this.api.getParagraphRoute(docName), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        return this.parseAndExtractParagraphMetaResponse(res, docPath, docName, context, metaType);
      })
    );
  }

  private parseAndExtractParagraphMetaResponse(res, docPath, docName, context, metaType?) {
    if (!res || res === '') return res;
    try {
      const data = JSON.parse(res);
      const result = metaType ? data[metaType] : data;

      this.setCacheItem(docPath, docName, context, data);
      return result;
    } catch {
      console.warn('Was not able to parse paragraph meta. Returning result as-is.');
      return res;
    }
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
    }
    return pUuid;
  }

  // TODO do this in an own service
  private getCacheItem(path, name, paragraphId) {
    return this.paragraphMetaCache[this.getCacheItemKey(path, name, paragraphId)];
  }

  private setCacheItem(path, name, paragraphId, content) {
    this.paragraphMetaCache[this.getCacheItemKey(path, name, paragraphId)] = content;
  }

  private getCacheItemKey(path, name, paragraphId) {
    const sanitizedPath = path.replace(/[\/\\]/g, '_');
    return `${sanitizedPath}__${name}__${paragraphId}`;
  }

  private getParagraphBreakRegExString(negativeLookahead = false, closingTag = true) {
    const quantifier = negativeLookahead ? '?!' : '?:';
    const endTag = closingTag ? '</p>' : '';
    return `<p(?: class="[^>]*")?>(${quantifier}&nbsp;|<br>)${endTag}`;
  }

  private inheritLabelsFromPreviousParagraph(newUuid: string, previousUuid: string, path: string, name: string) {
    this.getParagraphMeta(path, name, previousUuid, 'labels')
      .pipe(
        take(1),
        flatMap(labelsOfPreviousP => {
          if (!labelsOfPreviousP) return;
          return this.setParagraphMeta(path, name, newUuid, 'labels', labelsOfPreviousP);
        }),
        take(1)
      )
      .subscribe();
  }
}
