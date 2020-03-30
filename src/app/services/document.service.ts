import { FileInfo } from './../interfaces/fileInfo.interface';
import { DocumentDefinition } from '../interfaces/documentDefinition.interface';
import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { sanitizeName } from '../utils/name.util';

const LAST_DOCUMENT_KEY = 'writerey_last_opened_document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private api: ApiService, private httpClient: HttpClient, private paragraphService: ParagraphService) { }

  getDocument(path: string, name: string): Observable<any> {
    return this.httpClient.get(this.api.getDocumentRoute(name) + `?doc_path=${path}`).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: any) => this.transformLastEditedIntoDate(res)),
      tap(res => {
        if (res) localStorage.setItem(LAST_DOCUMENT_KEY, JSON.stringify({ name: res.name, path: res.path }))
      })
    );
  }

  enhanceAndSaveDocument(path: string, name: string, content) {
    const enhancedContent = this.paragraphService.enhanceDocumentWithParagraphIds(content);
    return this.saveDocument(path, name, enhancedContent).pipe(
      map(res => {
        if (!res) return res;
        res.content = enhancedContent;
        return res;
      })
    )
  }

  saveDocument(path: string, name: string, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });

    const formdata = new FormData();
    formdata.append('doc_path', path);
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.httpClient
      .put(this.api.getDocumentRoute(name), formdata, { headers: httpHeaders })
      .pipe(
        catchError(err => this.api.handleHttpError(err)),
        map((res: any) => this.transformLastEditedIntoDate(res))
      );
  }

  createDocument(path: string, name: string) {
    name = sanitizeName(name);
    return this.saveDocument(path, name, '');
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
