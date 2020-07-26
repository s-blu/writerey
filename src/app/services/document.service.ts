// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectStore } from './../stores/project.store';
import { LinkService } from 'src/app/services/link.service';
import { FileInfo } from '../shared/models/fileInfo.interface';
import { DocumentDefinition, LAST_DOCUMENT_KEY, START_PAGE_KEY } from '../shared/models/documentDefinition.interface';
import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map, tap, flatMap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { sanitizeName, ensureFileEnding } from '../shared/utils/name.util';
import { DocumentStore } from '../stores/document.store';
import { translate } from '@ngneat/transloco';
import { environment } from 'src/environments/environment';

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
    private projectStore: ProjectStore,
    private snackBar: MatSnackBar
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
      tap(_ => {
        if (environment.debugMode) console.log(`saved document [${new Date().toISOString()}] ${path}/${name} `);
      })
    );
  }

  moveDocument(path: string, name: string, newName?: string, newPath?: string) {
    let currentFileInfo;

    if (!newName && !newPath) {
      console.error('moveDocument got called without a new name or path. do nothing.');
      return of(null);
    }
    if (!newName) {
      newName = name;
    } else {
      newName = sanitizeName(newName);
      newName = ensureFileEnding(newName);
    }

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
    return this.documentStore.fileInfo$.pipe(
      tap(res => (currentFileInfo = res)),
      flatMap(_ => this.projectStore.project$),
      flatMap(project => {
        formdata.append('project_dir', project);
        return this.linkService.moveLinkDestination(project, name, path, newName, newPath);
      }),
      flatMap(_ => this.httpClient.put(this.api.getGitMoveRoute(), formdata, { headers: httpHeaders })),
      catchError(err => this.api.handleHttpError(err)),
      tap((res: FileInfo) => {
        if (currentFileInfo?.path === path && currentFileInfo.name === name) {
          console.log('current document was renamed or moved, will update current file information');
          this.documentStore.setFileInfo(res);
        }
      })
    );
  }

  createDocument(path: string, name: string) {
    name = sanitizeName(name);
    name = ensureFileEnding(name);

    return this.saveDocument(path, name, '');
  }

  deleteDocument(path: string, name: string) {
    const params: any = {
      doc_path: path,
    };

    return this.httpClient.delete(this.api.getDocumentRoute(name), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      tap(_ => console.log(`deleted document [${new Date().toISOString()}] ${path}/${name} `))
    );
  }

  getInitialDocumentInfo(): { initFileInfo: FileInfo; containingProject: string } {
    let initFileInfo = this.getStartPage();
    let containingProject;

    try {
      if (!initFileInfo) {
        initFileInfo = JSON.parse(localStorage.getItem(LAST_DOCUMENT_KEY));
      }

      containingProject = initFileInfo.path.split('/')[0];
    } catch {
      initFileInfo = null;
    }
    return {
      initFileInfo,
      containingProject,
    };
  }

  getStartPage(): FileInfo | null {
    let startPage;
    try {
      startPage = JSON.parse(localStorage.getItem(START_PAGE_KEY));
    } catch {
      startPage = null;
    }
    return startPage;
  }

  setStartPage(fileInfo: FileInfo) {
    localStorage.setItem(START_PAGE_KEY, JSON.stringify(fileInfo));
  }

  removeStartPage() {
    localStorage.removeItem(START_PAGE_KEY);
  }

  init() {
    const { initFileInfo, containingProject } = this.getInitialDocumentInfo();
    let fInfo;
    if (initFileInfo) {
      this.documentStore.setFileInfo(initFileInfo);
      this.projectStore.setProject(containingProject);
    }
    this.subscription.add(
      this.documentStore.fileInfo$
        .pipe(
          flatMap((fileInfo: FileInfo) => {
            if (!fileInfo) return of(null);
            fInfo = fileInfo;
            return this.getDocument(fileInfo.path, fileInfo.name, false);
          }),
          catchError(err => {
            this.snackBar.open(translate('error.couldNotLoadDocument', { name: fInfo.name }), '', {
              duration: 10000,
            });
            if (fInfo.name === initFileInfo.name && fInfo.path === initFileInfo.path) {
              console.warn(
                'Was not able to open last document. Will unset last document to avoid future problems.',
                fInfo.name
              );
              localStorage.removeItem(LAST_DOCUMENT_KEY);
            }

            return this.api.handleHttpError(err);
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
