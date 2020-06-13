import { LinkService } from 'src/app/services/link.service';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DirectoryStore } from './../stores/directory.store';
import { ProjectStore, LAST_PROJECT_KEY } from './../stores/project.store';
import { catchError, flatMap, map, tap, take, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { sanitizeName } from '../utils/name.util';
import { Subscription, of } from 'rxjs';
import { translate } from '@ngneat/transloco';

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
    private linkService: LinkService
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

  public moveDirectory(path: string, name: string, newName: string, movedPath?: string) {
    console.log('moveDir', path, name, newName);
    if (!newName) {
      console.error('moveDirectory got called without a new name. do nothing.');
      return;
    }
    newName = sanitizeName(newName);
    const oldPath = path + '/' + name;
    const newPath  = movedPath ? `${movedPath}/${newName}` : `${path}/${newName}`;

    let msg;
    if (movedPath) {
      msg = translate('git.message.move', { name: oldPath, newName: newPath });
    } else {
      msg = translate('git.message.rename', { oldName: oldPath, newName: newPath });
    }

    const formdata = new FormData();
    formdata.append('doc_path', oldPath);
    formdata.append('new_doc_path', newPath);
    formdata.append('msg', msg);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.projectStore.project$.pipe(
      flatMap(project => {
        formdata.append('project_dir', project);
        return this.linkService.moveLinkDestinations(project, oldPath, newPath);
      }),
      flatMap(_ => this.httpClient.put(this.api.getGitMoveRoute(), formdata, { headers: httpHeaders })),
      catchError(err => this.api.handleHttpError(err))
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
      map(
        (res: any) => {
          try {
            res = JSON.parse(res);
            this.directoryStore.setTree(res);
            return res;
          } catch (err) {
            console.error('Could not parse response of tree route. Will return empty object.');
            return {};
          }
        },
        catchError(err => this.api.handleHttpError(err))
      )
    );
  }

  init() {
    const lastProject = localStorage.getItem(LAST_PROJECT_KEY);
    if (lastProject) this.projectStore.setProject(lastProject);

    this.subscription.add(
      this.projectStore.project$
        .pipe(
          filter(res => res !== undefined),
          tap(res => (this.project = res)),
          flatMap(_ => {
            return this.getTree();
          })
        )
        .subscribe()
    );
  }
}
