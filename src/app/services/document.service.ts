import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private api: ApiService,
    private httpClient: HttpClient
  ) { }

  getDocument(path: string, name: string): Observable<any> {

    return this.httpClient.get(this.api.getDocumentRoute(name) + `?doc_path=${path}`)
      .pipe(catchError((err) => this.api.handleHttpError(err)));
  }

  saveDocument(path: string, name: string, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });

    const formdata = new FormData();
    formdata.append('doc_path', path);
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    this.httpClient.put(this.api.getDocumentRoute(name), formdata, { headers: httpHeaders })
      .pipe(catchError(err => this.api.handleHttpError(err)))
      .subscribe(res => console.log('saveDocument', res));
  }
}
