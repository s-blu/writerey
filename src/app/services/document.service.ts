// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ProjectStore } from './../stores/project.store';
import { LinkService } from 'src/app/services/link.service';
import { FileInfo } from '../models/fileInfo.interface';
import { DocumentDefinition, LAST_DOCUMENT_KEY } from '../models/documentDefinition.interface';
import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map, tap, flatMap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { sanitizeName, ensureFileEnding } from '../utils/name.util';
import { DocumentStore } from '../stores/document.store';
import { translate } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnDestroy {
  private subscription = new Subscription();

  constructor(
    private api: ApiService,
    private httpClient: HttpClient,
    private paragraphService: ParagraphService,
    private documentStore: DocumentStore,
    private linkService: LinkService,
    private projectStore: ProjectStore
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDocument(path: string, name: string, withContent = true): Observable<any> {
    const params: any = {
      doc_path: path,
    };
    if (withContent) params.with_content = 'true';

    return this.httpClient.get(this.api.getDocumentRoute(name), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: any) => this.transformLastEditedIntoDate(res))
    );
  }

  enhanceAndSaveDocument(path: string, name: string, content) {
    const enhancedContent = this.paragraphService.enhanceDocumentWithParagraphIds(content, path, name);
    return this.saveDocument(path, name, enhancedContent).pipe(
      map(res => {
        if (!res) return res;
        res.content = enhancedContent;
        return res;
      })
    );
  }

  saveDocument(path: string, name: string, content) {
    const blob = new Blob([content || ''], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });

    const formdata = new FormData();
    formdata.append('doc_path', path);
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.httpClient.put(this.api.getDocumentRoute(name), formdata, { headers: httpHeaders }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: any) => this.transformLastEditedIntoDate(res)),
      tap(res => this.documentStore.setLastSaved(res?.last_edited)),
      tap(_ => console.log(`saved document [${new Date().toISOString()}] ${path}/${name} `))
    );
  }

  moveDocument(path: string, name: string, newName: string, newPath?: string) {
    if (!newName) {
      console.error('moveDocument got called without a new name. do nothing.');
      return;
    }
    newName = sanitizeName(newName);
    newName = ensureFileEnding(newName);

    let msg;
    if (newPath) {
      msg = translate('git.message.move', { name, oldPath: path, newPath });
    } else {
      msg = translate('git.message.rename', { oldName: name, newName, path });
    }

    const formdata = new FormData();
    formdata.append('doc_name', name);
    formdata.append('doc_path', path);
    formdata.append('new_doc_name', newName);
    formdata.append('new_doc_path', newPath || path);
    formdata.append('msg', msg);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.projectStore.project$.pipe(
      flatMap(project => {
        formdata.append('project_dir', project);
        return this.linkService.moveLinkDestination(project, name, path, newName, newPath);
      }),
      flatMap(_ => this.httpClient.put(this.api.getGitMoveRoute(), formdata, { headers: httpHeaders })),
      catchError(err => this.api.handleHttpError(err))
    );
  }

  createDocument(path: string, name: string) {
    name = sanitizeName(name);
    name = ensureFileEnding(name);

    return this.saveDocument(path, name, '');
  }

  deleteDocument(path: string, name: string) {
    const params: any = {
      doc_path: path
    };

    return this.httpClient.delete(this.api.getDocumentRoute(name), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      tap(_ => console.log(`deleted document [${new Date().toISOString()}] ${path}/${name} `))
    );
  }

  getLastSavedFileInfo(): FileInfo {
    let lastSaved = null;
    try {
      lastSaved = localStorage.getItem(LAST_DOCUMENT_KEY);
      lastSaved = JSON.parse(lastSaved);
    } catch {
      lastSaved = null;
    }
    return lastSaved;
  }

  init() {
    const lastSaved = this.getLastSavedFileInfo();
    if (lastSaved) this.documentStore.setFileInfo(lastSaved);

    this.subscription.add(
      this.documentStore.fileInfo$
        .pipe(
          flatMap((fileInfo: FileInfo) => {
            if (!fileInfo) return of(null);
            return this.getDocument(fileInfo.path, fileInfo.name, false);
          })
        )
        .subscribe((document: DocumentDefinition) => {
          if (!document) return;
          this.documentStore.setDocument(document);
        })
    );
  }

  private transformLastEditedIntoDate(res) {
    if (res.last_edited) {
      try {
        res.last_edited = new Date(res.last_edited * 1000);
      } finally {
      }
    }
    return res;
  }
}
