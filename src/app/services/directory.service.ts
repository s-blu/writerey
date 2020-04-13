import { ProjectStore, LAST_PROJECT_KEY } from './../stores/project.store';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { sanitizeName } from '../utils/name.util';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DirectoryService implements OnDestroy {
  private subscription = new Subscription();

  constructor(private api: ApiService, private httpClient: HttpClient, private projectStore: ProjectStore) {}
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
    const parameter: any = {};
    if (params) parameter.params = params;

    return this.httpClient.get(this.api.getTreeRoute(), parameter).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: any) => {
        try {
          res = JSON.parse(res);
          return res;
        } catch (err) {
          console.error('Could not parse response of tree route. Will return empty object.');
          return {};
        }
      })
    );
  }

  init() {
    const lastProject = localStorage.getItem(LAST_PROJECT_KEY);
    if (lastProject) this.projectStore.setProject(lastProject);
  }
}
