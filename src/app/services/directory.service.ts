// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DocumentStore } from 'src/app/stores/document.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LinkService } from 'src/app/services/link.service';
import { DirectoryStore } from './../stores/directory.store';
import { ProjectStore } from './../stores/project.store';
import { catchError, flatMap, map, tap, take, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { sanitizeName } from '../utils/name.util';
import { Subscription, of } from 'rxjs';
import { translate } from '@ngneat/transloco';
import { FileInfo } from '../models/fileInfo.interface';

@Injectable({
  providedIn: 'root',
})
export class DirectoryService implements OnDestroy {
  private project;
  private subscription = new Subscription();

  constructor(
    private api: ApiService,
    private httpClient: HttpClient,
    private projectStore: ProjectStore,
    private directoryStore: DirectoryStore,
    private documentStore: DocumentStore,
    private linkService: LinkService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public createDirectory(path, name) {
    name = sanitizeName(name);

    const formdata = new FormData();
    formdata.append('doc_path', path);
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient
      .put(this.api.getDirectoryRoute(name), formdata, { headers: httpHeaders })
      .pipe(catchError(err => this.api.handleHttpError(err)));
  }

  public renameProject(name: string, newName: string) {
    if (!newName) {
      console.error('renameProject got called without a new name. do nothing.');
      return;
    }
    newName = sanitizeName(newName);

    let msg = translate('git.message.rename', { oldName: name, newName });

    const formdata = new FormData();
    formdata.append('doc_path', name);
    formdata.append('project_dir', newName);
    formdata.append('new_doc_path', newName);
    formdata.append('msg', msg);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.linkService.moveLinkDestinations(name, name, newName).pipe(
      flatMap(_ => this.httpClient.put(this.api.getGitMoveRoute(), formdata, { headers: httpHeaders })),
      catchError(err => this.api.handleHttpError(err))
    );
  }

  public moveDirectory(path: string, name: string, newName: string, movedPath?: string) {
    let currentFileInfo;

    if (!newName && !movedPath) {
      console.error('moveDirectory got called without a new name or path. do nothing.');
      return of(null);
    }
    if (!newName) {
      newName = name;
    } else {
      newName = sanitizeName(newName);
    }
    const oldPath = path + '/' + name;
    const newPath = movedPath ? `${movedPath}/${newName}` : `${path}/${newName}`;

    let msg;
    if (movedPath) {
      msg = translate('git.message.move', { name, newPath, oldPath });
    } else {
      msg = translate('git.message.rename', { oldName: oldPath, newName: newPath });
    }

    const formdata = new FormData();
    formdata.append('doc_path', oldPath);
    formdata.append('new_doc_path', newPath);
    formdata.append('msg', msg);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.documentStore.fileInfo$.pipe(
      tap(res => (currentFileInfo = res)),
      flatMap(_ => this.projectStore.project$),
      flatMap(project => {
        formdata.append('project_dir', project);
        return this.linkService.moveLinkDestinations(project, oldPath, newPath);
      }),
      flatMap(_ => this.httpClient.put(this.api.getGitMoveRoute(), formdata, { headers: httpHeaders })),
      catchError(err => this.api.handleHttpError(err)),
      tap((res: FileInfo) => {
        if (currentFileInfo && currentFileInfo?.path.startsWith(oldPath)) {
          currentFileInfo.path = currentFileInfo.path.replace(oldPath, res.path);
          console.log('path of current document was renamed or moved, will update current file information');
          this.documentStore.setFileInfo(currentFileInfo);
        }
      })
    );
  }

  deleteDirectory(path: string, name: string) {
    const params: any = {
      dir_path: path,
    };

    return this.httpClient.delete(this.api.getDirectoryRoute(name), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      tap(_ => console.log(`deleted directory [${new Date().toISOString()}] ${path}/${name} `))
    );
  }

  public getTree(params?) {
    const parameter: any = {
      params: {
        base: this.project || '',
      },
    };
    if (params) parameter.params = params;
    return this.httpClient.get(this.api.getTreeRoute(), parameter).pipe(
      catchError(err => {
        this.snackBar.open(translate('error.couldNotFetchTree', { name: this.project }), '', {
          duration: 10000,
        });

        return this.api.handleHttpError(err);
      }),
      map((res: any) => {
        try {
          res = JSON.parse(res);
          this.directoryStore.setTree(res);
          return res;
        } catch (err) {
          console.error('Could not parse response of tree route. Will return empty object.');
          return {};
        }
      })
    );
  }

  init() {
    this.subscription.add(
      this.projectStore.project$
        .pipe(
          filter(res => res !== undefined && res !== ''),
          tap(res => (this.project = res)),
          flatMap(_ => {
            return this.getTree();
          })
        )
        .subscribe()
    );
  }
}
