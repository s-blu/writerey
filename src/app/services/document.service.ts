import { DocumentDefinition } from '../interfaces/documentDefinition.interface';
import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { sanitizeName } from '../utils/name.util';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private api: ApiService,
    private httpClient: HttpClient,
    private paragraphService: ParagraphService
  ) { }

  getDocument(path: string, name: string): Observable<any> {

    return this.httpClient.get(this.api.getDocumentRoute(name) + `?doc_path=${path}`)
      .pipe(
        catchError((err) => this.api.handleHttpError(err)),
        map((res: any) => {
          if (res.last_edited) {
            try {
              res.last_edited = new Date(res.last_edited * 1000);
            } finally {}

            return res;
          }
        })
      );
  }

  saveDocument(path: string, name: string, content) {
    // TODO remove me again. enhancing needs to take place explicitly to save file as-is
    const enhancedContent = this.paragraphService.enhanceDocumentWithParagraphIds(content);
    console.log('===========================')
    console.log('CONTENT TO SAVE', enhancedContent)
    console.log('===========================')

    const blob = new Blob([enhancedContent], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });

    const formdata = new FormData();
    formdata.append('doc_path', path);
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient.put(this.api.getDocumentRoute(name), formdata, { headers: httpHeaders })
      .pipe(catchError(err => this.api.handleHttpError(err)));
  }

  createDocument(path: string, name: string, ) {
    name = sanitizeName(name);
    return this.saveDocument(path, name, '');
  }
}
