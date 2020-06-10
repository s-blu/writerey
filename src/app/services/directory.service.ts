import { DirectoryStore } from './../stores/directory.store';
import { ProjectStore, LAST_PROJECT_KEY } from './../stores/project.store';
import { catchError, flatMap, map, tap, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { sanitizeName } from '../utils/name.util';
import { Subscription } from 'rxjs';

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
    private directoryStore: DirectoryStore
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
          tap(res => (this.project = res)),
          flatMap(_ => {
            return this.getTree();
          })
        )
        .subscribe()
    );
  };
}
